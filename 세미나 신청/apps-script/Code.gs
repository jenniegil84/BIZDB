/**
 * 세미나 신청 접수 — 구글 시트 기록 + Flow 업무 등록
 * 버전: v00.01 (2026-11-12) — 변경 이력은 ../PROJECT_CONTEXT.md
 *
 * 설치: 신청 내역을 쌓을 구글 시트에서 [확장 프로그램 → Apps Script] 를 열고
 *       이 파일 내용을 그대로 붙여넣는다(설치안내.md 참고).
 *
 * 스크립트 속성(프로젝트 설정 → 스크립트 속성)에 넣는 값 — 코드에 직접 적지 않는다:
 *   FLOW_API_KEY     (필수) Flow 개발자 포털 「키관리」에서 발급한 API Key
 *   FLOW_PROJECT_ID  (필수) 세미나 신청 알림을 받을 Flow 프로젝트 번호
 *   FLOW_WORKERS     (선택) 업무 담당자 Flow 아이디(이메일), 여러 명이면 쉼표로 구분
 *
 * Flow 값이 비어 있거나 Flow 호출이 실패해도 **시트 기록은 먼저 끝난다** — 신청은 잃지 않는다.
 * Flow 결과는 시트의 「Flow 등록」 칸에 남는다.
 */

var CONFIG = {
  sheetName: '신청내역',
  schedule: { weekOfMonth: 3, weekday: 3 },  // 매월 셋째 주 수요일 — 페이지(index.html)의 SEMINAR.scheduleRule 과 같아야 한다
  allowedSessions: 3,                         // 페이지가 보여주는 회차 수와 같게
  flowApiBase: 'https://api.flow.team',
  seminarTitle: '세모리포트 사용법 교육 세미나'
};

var HEADERS = ['접수일시', '참여 회차', '이름', '연락처', '이메일', '사무소명', '듣고 싶은 내용',
               '개인정보 동의', 'Flow 등록', 'Flow 링크', '페이지 버전'];
var COL = {}; HEADERS.forEach(function (h, i) { COL[h] = i + 1; });

/* ── 진입점 ───────────────────────────────────────────────── */

function doGet() {
  return json_({ ok: true, service: 'seminar-apply', version: 'v00.01' });
}

function doPost(e) {
  var data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, message: '요청 형식이 올바르지 않습니다.' });
  }

  // 스팸 방지: 숨긴 칸이 채워져 왔으면 기록하지 않고 성공처럼 응답(봇에게 단서를 주지 않음)
  if (data.website) return json_({ ok: true });

  var clean = validate_(data, new Date());
  if (clean.error) return json_({ ok: false, message: clean.error });
  var v = clean.value;

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return json_({ ok: false, message: '신청이 몰려 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.' });
  }
  var row;
  try {
    var sheet = getSheet_();
    if (isDuplicate_(sheet, v.email, v.session)) {
      return json_({ ok: true, duplicate: true });
    }
    sheet.appendRow([
      v.receivedAt, v.session, safe_(v.name), v.phoneFormatted, safe_(v.email), safe_(v.office),
      safe_(v.topic), 'Y', '처리 중', '', safe_(v.pageVersion)
    ]);
    row = sheet.getLastRow();
  } finally {
    lock.releaseLock();
  }

  // 시트 기록이 끝난 뒤 Flow 등록(실패해도 신청은 유효)
  var flow = createFlowTask_(v);
  var sheet2 = getSheet_();
  sheet2.getRange(row, COL['Flow 등록']).setValue(flow.status);
  if (flow.url) sheet2.getRange(row, COL['Flow 링크']).setValue(flow.url);

  return json_({ ok: true });
}

/* ── 검증 ─────────────────────────────────────────────────── */

function validate_(d, now) {
  var str = function (x) { return (x === undefined || x === null) ? '' : String(x).trim(); };
  var name = str(d.name), phone = str(d.phone).replace(/\D/g, ''), email = str(d.email),
      office = str(d.office), topic = str(d.topic), session = str(d.session);

  if (d.agree !== true) return { error: '개인정보 수집·이용에 동의해 주세요.' };
  if (!name || name.length > 30) return { error: '이름을 확인해 주세요.' };
  if (!/^0\d{8,10}$/.test(phone)) return { error: '연락처를 확인해 주세요.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 100) return { error: '이메일 주소를 확인해 주세요.' };
  if (!office || office.length > 60) return { error: '사무소명을 확인해 주세요.' };
  if (topic.length > 1000) return { error: '듣고 싶은 내용은 1,000자 이내로 적어 주세요.' };

  var allowed = upcomingSessionKeys_(CONFIG.allowedSessions, now);
  if (allowed.indexOf(session) < 0) {
    return { error: '선택한 회차를 신청할 수 없습니다. 페이지를 새로고침한 뒤 다시 선택해 주세요.' };
  }

  return { value: {
    name: name, phone: phone, phoneFormatted: formatPhone_(phone), email: email.toLowerCase(),
    office: office, topic: topic, session: session,
    pageVersion: str(d.pageVersion).slice(0, 20),
    receivedAt: Utilities.formatDate(now, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss')
  } };
}

/* ── 회차 계산(페이지와 같은 규칙, 한국 시간 기준, 당일 포함) ─────── */

function upcomingSessionKeys_(count, now) {
  var k = new Date(now.getTime() + 9 * 3600 * 1000);
  var ty = k.getUTCFullYear(), tm = k.getUTCMonth(), td = k.getUTCDate();
  var out = [], y = ty, m = tm, guard = 0;
  while (out.length < count && guard++ < 24) {
    var first = new Date(Date.UTC(y, m, 1)).getUTCDay();
    var day = 1 + ((CONFIG.schedule.weekday - first + 7) % 7) + (CONFIG.schedule.weekOfMonth - 1) * 7;
    if (y > ty || (y === ty && m > tm) || (y === ty && m === tm && day >= td)) {
      out.push(y + '-' + pad_(m + 1) + '-' + pad_(day));
    }
    m++; if (m > 11) { m = 0; y++; }
  }
  return out;
}
function pad_(n) { return (n < 10 ? '0' : '') + n; }

/* ── 시트 ─────────────────────────────────────────────────── */

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(CONFIG.sheetName);
  if (!sh) {
    sh = ss.insertSheet(CONFIG.sheetName);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function isDuplicate_(sheet, email, session) {
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var vals = sheet.getRange(2, COL['참여 회차'], last - 1, COL['이메일'] - COL['참여 회차'] + 1).getValues();
  var ei = COL['이메일'] - COL['참여 회차'];
  for (var i = 0; i < vals.length; i++) {
    if (String(vals[i][0]) === session && String(vals[i][ei]).toLowerCase() === email) return true;
  }
  return false;
}

// 시트 수식 주입 방지: =, +, -, @ 로 시작하는 값은 글자로 저장
function safe_(s) {
  s = String(s || '');
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function formatPhone_(d) {
  if (d.indexOf('02') === 0) {
    return d.length === 10 ? d.slice(0, 2) + '-' + d.slice(2, 6) + '-' + d.slice(6)
                           : d.slice(0, 2) + '-' + d.slice(2, 5) + '-' + d.slice(5);
  }
  return d.length === 11 ? d.slice(0, 3) + '-' + d.slice(3, 7) + '-' + d.slice(7)
                         : d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6);
}

/* ── Flow 업무 등록 ──────────────────────────────────────────
 * POST /user/posts/projects/{projectId}/tasks (flow-수집/api-문서/user-posts.md)
 * 헤더 x-flow-api-key · 본문 title(≤200) · contents(≤10000) · status · workers
 */
function createFlowTask_(v) {
  var props = PropertiesService.getScriptProperties();
  var key = props.getProperty('FLOW_API_KEY');
  var projectId = props.getProperty('FLOW_PROJECT_ID');
  if (!key || !projectId) return { status: '미설정(스크립트 속성 확인)' };

  var p = v.session.split('-');
  var sessionLabel = Number(p[1]) + '/' + Number(p[2]);
  var body = {
    title: ('[세미나 신청] ' + sessionLabel + ' 회차 · ' + v.office + ' ' + v.name).slice(0, 200),
    contents: [
      CONFIG.seminarTitle + ' 신청이 접수되었습니다.',
      '',
      '· 참여 회차: ' + v.session,
      '· 이름: ' + v.name,
      '· 연락처: ' + v.phoneFormatted,
      '· 이메일: ' + v.email,
      '· 사무소명: ' + v.office,
      '· 듣고 싶은 내용: ' + (v.topic || '(없음)'),
      '',
      '· 접수일시: ' + v.receivedAt
    ].join('\n').slice(0, 10000),
    status: 'request'
  };
  var workers = (props.getProperty('FLOW_WORKERS') || '').split(',')
    .map(function (s) { return s.trim().toLowerCase(); }).filter(String);
  if (workers.length) body.workers = workers.map(function (w) { return { workerId: w }; });

  try {
    var res = UrlFetchApp.fetch(CONFIG.flowApiBase + '/user/posts/projects/' + encodeURIComponent(projectId) + '/tasks', {
      method: 'post',
      contentType: 'application/json',
      headers: { 'x-flow-api-key': key },
      payload: JSON.stringify(body),
      muteHttpExceptions: true
    });
    var code = res.getResponseCode();
    var parsed = {};
    try { parsed = JSON.parse(res.getContentText()); } catch (ignore) {}
    var r = parsed.response || parsed;
    if (code >= 200 && code < 300 && r.success !== false) {
      return { status: '완료', url: (r.data && r.data.tinyUrl) || '' };
    }
    var msg = (r.error && (r.error.code || r.error.message)) || r.message || '';
    return { status: '실패(' + code + (msg ? ' ' + msg : '') + ')' };
  } catch (err) {
    return { status: '실패(' + String(err && err.message || err).slice(0, 80) + ')' };
  }
}

/* ── 설치 후 점검용(편집기에서 직접 실행) ─────────────────────── */

// 1) 시트 머리줄 만들기
function setup() { getSheet_(); }

// 2) Flow 연결 확인 — 실제로 테스트 업무 1건이 Flow 에 등록된다
function testFlow() {
  var r = createFlowTask_({
    session: upcomingSessionKeys_(1, new Date())[0], name: '테스트', phoneFormatted: '010-0000-0000',
    email: 'test@example.com', office: '연결 확인용', topic: '설치 점검 — 지워도 됩니다',
    receivedAt: Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss')
  });
  Logger.log(JSON.stringify(r));
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
