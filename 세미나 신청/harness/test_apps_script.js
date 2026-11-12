// 하네스: Apps Script(Code.gs)를 가짜 구글/Flow 환경에서 돌려 검증 · v00.02
// 실행: node "세미나 신청/harness/test_apps_script.js"
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '../apps-script/Code.gs'), 'utf8');

function makeEnv(opts = {}) {
  const rows = [];
  const fetches = [];
  const sheet = {
    appendRow: r => rows.push(r.slice()),
    setFrozenRows() {},
    getLastRow: () => rows.length,
    getRange: (r, c, nr = 1, nc = 1) => ({
      getValues: () => rows.slice(r - 1, r - 1 + nr).map(x => x.slice(c - 1, c - 1 + nc)),
      setValue: v => { rows[r - 1][c - 1] = v; }
    })
  };
  let has = false;
  const props = Object.assign({ FLOW_API_KEY: 'k', FLOW_PROJECT_ID: '123' }, opts.props || {});
  const ctx = {
    SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: () => has ? sheet : null, insertSheet: () => { has = true; return sheet; } }) },
    LockService: { getScriptLock: () => ({ tryLock: () => opts.lockFail ? false : true, releaseLock() {} }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => props[k] || null }) },
    UrlFetchApp: { fetch: (url, o) => {
      fetches.push({ url, o, body: JSON.parse(o.payload) });
      if (opts.fetchThrow) throw new Error('timeout');
      const code = opts.flowCode || 200;
      const text = code === 200
        ? JSON.stringify({ response: { success: true, code: 200, data: { tinyUrl: 'https://flow.team/l/x' } } })
        : JSON.stringify({ response: { success: false, code, error: { code: 'UNAUTHORIZED_ERROR' } } });
      return { getResponseCode: () => code, getContentText: () => text };
    } },
    Utilities: { formatDate: (d) => new Date(d.getTime() + 9 * 3600e3).toISOString().replace('T', ' ').slice(0, 19) },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: t => ({ t, setMimeType() { return JSON.parse(t); } }) },
    Logger: { log() {} }
  };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  return { ctx, rows, fetches };
}
const post = (env, body) => env.ctx.doPost({ postData: { contents: typeof body === 'string' ? body : JSON.stringify(body) } });

let pass = 0, fail = 0;
function t(name, fn) { try { fn(); pass++; console.log('  ✓', name); } catch (e) { fail++; console.log('  ✗', name, '\n     ', e.message); } }
function eq(a, b, m) { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error((m || '') + ' expected ' + JSON.stringify(b) + ' got ' + JSON.stringify(a)); }

// 회차 계산 검증용: 오늘(KST) 기준 다음 회차를 Code.gs 함수로 얻는다
const env0 = makeEnv();
const keys = env0.ctx.upcomingSessionKeys_(3, new Date());
const good = () => ({ session: keys[0], name: '홍길동', phone: '010-1234-5678', email: 'Hong@Example.com', office: '길동세무회계', topic: '부가세 보고서', agree: true, website: '', pageVersion: 'v00.01' });

console.log('[회차 계산]');
t('2026-11-12 → 11/18, 12/16, 2027-01-20 (셋째 주 수요일)', () => eq(env0.ctx.upcomingSessionKeys_(3, new Date('2026-11-12T03:00:00Z')), ['2026-11-18', '2026-12-16', '2027-01-20']));
t('당일(11/18 KST 23시)도 신청 가능', () => eq(env0.ctx.upcomingSessionKeys_(1, new Date('2026-11-18T14:00:00Z'))[0], '2026-11-18'));
t('다음날(11/19 KST 00시)이면 12월 회차부터', () => eq(env0.ctx.upcomingSessionKeys_(1, new Date('2026-11-18T15:00:00Z'))[0], '2026-12-16'));
t('1일이 수요일인 달(2027-09): 15일', () => eq(env0.ctx.upcomingSessionKeys_(1, new Date('2027-09-01T00:00:00Z'))[0], '2027-09-15'));
t('1일이 목요일인 달(2026-10): 21일', () => eq(env0.ctx.upcomingSessionKeys_(1, new Date('2026-10-01T00:00:00Z'))[0], '2026-10-21'));

console.log('[정상 신청]');
t('시트에 머리줄 + 1행, Flow 완료·링크 기록', () => {
  const e = makeEnv(); const r = post(e, good());
  eq(r, { ok: true }); eq(e.rows.length, 2); eq(e.rows[0][0], '접수일시');
  const row = e.rows[1];
  eq([row[1], row[2], row[3], row[4], row[5], row[7], row[8], row[9]], [keys[0], '홍길동', '010-1234-5678', 'hong@example.com', '길동세무회계', 'Y', '완료', 'https://flow.team/l/x']);
});
t('Flow 호출 형식(api.flow.team · 헤더 · 필수 본문)', () => {
  const e = makeEnv({ props: { FLOW_WORKERS: 'A@x.com, b@y.com' } }); post(e, good());
  const f = e.fetches[0];
  eq(f.url, 'https://api.flow.team/user/posts/projects/123/tasks');
  eq(f.o.headers['x-flow-api-key'], 'k'); eq(f.body.status, 'request');
  eq(f.body.workers, [{ workerId: 'a@x.com' }, { workerId: 'b@y.com' }]);
  if (!f.body.title.startsWith('[세미나 신청]') || f.body.title.length > 200) throw new Error('title ' + f.body.title);
  if (!f.body.contents.includes('010-1234-5678')) throw new Error('contents');
});
t('서울 번호 02 포맷', () => { const e = makeEnv(); post(e, Object.assign(good(), { phone: '0212345678' })); eq(e.rows[1][3], '02-1234-5678'); });

console.log('[중복 · 실패해도 신청 보존]');
t('같은 이메일+같은 회차 → duplicate, 행 추가 안 됨', () => {
  const e = makeEnv(); post(e, good()); const r = post(e, Object.assign(good(), { email: 'HONG@example.com' }));
  eq(r, { ok: true, duplicate: true }); eq(e.rows.length, 2); eq(e.fetches.length, 1);
});
t('같은 이메일·다른 회차는 접수', () => { const e = makeEnv(); post(e, good()); post(e, Object.assign(good(), { session: keys[1] })); eq(e.rows.length, 3); });
t('Flow 키 미설정 → 시트는 기록, 상태 "미설정"', () => { const e = makeEnv({ props: { FLOW_API_KEY: '' } }); eq(post(e, good()).ok, true); eq(e.rows[1][8].startsWith('미설정'), true); eq(e.fetches.length, 0); });
t('Flow 401 → 시트는 기록, 상태 "실패(401 …)"', () => { const e = makeEnv({ flowCode: 401 }); eq(post(e, good()).ok, true); eq(e.rows[1][8], '실패(401 UNAUTHORIZED_ERROR)'); });
t('Flow 통신 예외 → 시트는 기록', () => { const e = makeEnv({ fetchThrow: true }); eq(post(e, good()).ok, true); eq(e.rows[1][8], '실패(timeout)'); });

console.log('[거절해야 하는 입력]');
const bad = (patch, label) => t(label, () => { const e = makeEnv(); const r = post(e, Object.assign(good(), patch)); eq(r.ok, false); eq(e.rows.length, 0); });
bad({ agree: false }, '동의 안 함'); bad({ agree: 'true' }, '동의값이 문자열'); bad({ name: '  ' }, '이름 공백');
bad({ phone: '1234' }, '연락처 짧음'); bad({ email: 'abc@' }, '이메일 형식'); bad({ office: '' }, '사무소명 없음');
bad({ topic: 'x'.repeat(1001) }, '듣고 싶은 내용 1001자'); bad({ session: '2020-01-15' }, '지난 회차'); bad({ session: '2026-11-19' }, '규칙에 없는 날짜');
t('JSON 아님 → 거절', () => { const e = makeEnv(); eq(post(e, 'not json').ok, false); });
t('잠금 실패 → 거절, 기록 없음', () => { const e = makeEnv({ lockFail: true }); eq(post(e, good()).ok, false); eq(e.rows.length, 0); });

console.log('[보안]');
t('스팸 칸 채움 → ok 응답이지만 기록·Flow 없음', () => { const e = makeEnv(); eq(post(e, Object.assign(good(), { website: 'http://spam' })), { ok: true }); eq(e.rows.length, 0); eq(e.fetches.length, 0); });
t('수식 주입(=HYPERLINK…) → 글자로 저장', () => { const e = makeEnv(); post(e, Object.assign(good(), { office: '=HYPERLINK("http://x")', topic: '+cmd' })); eq(e.rows[1][5], "'=HYPERLINK(\"http://x\")"); eq(e.rows[1][6], "'+cmd"); });

console.log(`\n결과: ${pass} 통과 / ${fail} 실패`);
process.exit(fail ? 1 : 0);
