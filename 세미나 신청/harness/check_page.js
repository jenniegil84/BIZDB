// 하네스: 신청 페이지를 실제 브라우저로 열어 화면·검증·제출 흐름을 확인 · v00.02
// 실행: node "세미나 신청/harness/check_page.js"  (스크린샷은 harness/out/ 에 저장, 저장소에 올리지 않음)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const HTML = fs.readFileSync(path.join(__dirname, '../site/index.html'), 'utf8');
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const EP = 'https://script.google.com/macros/s/TEST/exec';
const FIXED = new Date('2026-11-12T03:00:00Z'); // KST 2026-11-12 12:00

let pass = 0, fail = 0;
const t = async (name, fn) => { try { await fn(); pass++; console.log('  ✓', name); } catch (e) { fail++; console.log('  ✗', name, '\n     ', e.message); } };
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error((m || '') + ' expected ' + JSON.stringify(b) + ' got ' + JSON.stringify(a)); };

async function open(browser, { endpoint = EP, reply, viewport } = {}) {
  const ctx = await browser.newContext({ viewport: viewport || { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.clock.install({ time: FIXED });
  const html = HTML.replace("endpoint: ''", "endpoint: '" + endpoint + "'");
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ contentType: 'text/css', body: '' }));
  await page.route('https://seminar.test/', r => r.fulfill({ contentType: 'text/html', body: html }));
  const sent = [];
  await page.route(EP, async r => { sent.push(JSON.parse(r.request().postData())); await r.fulfill({ contentType: 'application/json', body: JSON.stringify(reply || { ok: true }), headers: { 'access-control-allow-origin': '*' } }); });
  await page.goto('https://seminar.test/');
  return { page, ctx, sent, errors };
}
async function fill(page) {
  await page.fill('#name', '홍길동'); await page.fill('#phone', '01012345678'); await page.fill('#email', 'hong@example.com');
  await page.fill('#office', '길동세무회계'); await page.fill('#topic', '부가세 보고서'); await page.check('#agree');
}

(async () => {
  const browser = await chromium.launch();

  console.log('[접수 주소 미설정(배포 기본값)]');
  await t('신청 버튼 잠금 + 준비 중 안내', async () => {
    const { page, ctx } = await open(browser, { endpoint: '' });
    eq(await page.isDisabled('#submitBtn'), true);
    eq((await page.textContent('#formMsg')).includes('준비 중'), true);
    await ctx.close();
  });

  console.log('[화면 내용 — 기준일 2026-11-12]');
  await t('다음 세미나 = 11월 18일 (수) · 2026년 · 온라인', async () => {
    const { page, ctx } = await open(browser); eq(await page.textContent('#heroNextDate'), '11월 18일 (수)'); eq(await page.textContent('#heroNextMeta'), '2026년 · 온라인'); await ctx.close();
  });
  await t('일정 3개 · 회차 선택지 3개(11/18, 12/16, 1/20)', async () => {
    const { page, ctx } = await open(browser);
    eq(await page.locator('#sessions li').count(), 3);
    eq(await page.$$eval('#session option', o => o.map(x => x.value)), ['2026-11-18', '2026-12-16', '2027-01-20']);
    await ctx.close();
  });
  await t('시간 미정(null) → 「시간」 카드 숨김, 안내 카드 4개', async () => {
    const { page, ctx } = await open(browser);
    const ks = await page.$$eval('.fact .k', e => e.map(x => x.textContent)); eq(ks, ['일정', '진행 방식', '정원', '신청 마감']);
    await ctx.close();
  });
  await t('문의 버튼 → 채널톡 주소, 새 창', async () => {
    const { page, ctx } = await open(browser);
    eq(await page.getAttribute('#contactBtn', 'href'), 'https://qe398.channel.io'); eq(await page.getAttribute('#contactBtn', 'target'), '_blank');
    await ctx.close();
  });

  await t('일정의 「이 회차 신청」 → 신청서 회차가 그 날짜로 바뀜', async () => {
    const { page, ctx } = await open(browser);
    await page.click('#sessions li:nth-child(2) .pick');
    eq(await page.inputValue('#session'), '2026-12-16'); await ctx.close();
  });
  await t('개인정보 동의 내용: 기본 접힘 → 「내용 보기」로 펼침', async () => {
    const { page, ctx } = await open(browser);
    eq(await page.isVisible('#consentTable'), false);
    await page.click('#consentToggle'); eq(await page.isVisible('#consentTable'), true);
    eq((await page.textContent('#consentTable')).includes('보유 기간'), true); await ctx.close();
  });

  console.log('[입력 검증]');
  await t('빈 채로 제출 → 필수 5칸 오류 표시, 전송 없음', async () => {
    const { page, ctx, sent } = await open(browser);
    await page.click('#submitBtn');
    eq(await page.locator('.field.has-error').count(), 5); eq(sent.length, 0);
    await page.screenshot({ path: path.join(OUT, 'errors.png'), fullPage: false });
    await ctx.close();
  });
  await t('잘못된 연락처·이메일 → 해당 칸만 오류', async () => {
    const { page, ctx, sent } = await open(browser); await fill(page);
    await page.fill('#phone', '1234'); await page.fill('#email', 'abc@'); await page.click('#submitBtn');
    eq(await page.$$eval('.field.has-error input', e => e.map(x => x.id)), ['phone', 'email']); eq(sent.length, 0);
    await ctx.close();
  });
  await t('연락처 자동 하이픈(01012345678 → 010-1234-5678)', async () => {
    const { page, ctx } = await open(browser); await page.fill('#phone', ''); await page.type('#phone', '01012345678');
    eq(await page.inputValue('#phone'), '010-1234-5678'); await ctx.close();
  });

  console.log('[제출]');
  await t('정상 제출 → 전송값 확인 + 완료 화면', async () => {
    const { page, ctx, sent, errors } = await open(browser); await fill(page); await page.click('#submitBtn');
    await page.waitForSelector('#done.show');
    eq(sent[0], { session: '2026-11-18', name: '홍길동', phone: '01012345678', email: 'hong@example.com', office: '길동세무회계', topic: '부가세 보고서', agree: true, website: '', pageVersion: 'v00.02' });
    eq(await page.textContent('#done h3'), '신청이 완료되었습니다');
    eq(await page.isVisible('#applyForm'), false);
    eq(errors, [], 'console errors');
    await page.screenshot({ path: path.join(OUT, 'done.png') });
    await ctx.close();
  });
  await t('이미 신청한 회차 → 「이미 신청된 회차입니다」', async () => {
    const { page, ctx } = await open(browser, { reply: { ok: true, duplicate: true } }); await fill(page); await page.click('#submitBtn');
    await page.waitForSelector('#done.show'); eq(await page.textContent('#done h3'), '이미 신청된 회차입니다'); await ctx.close();
  });
  await t('서버 거절 → 서버 안내문 표시, 폼 유지, 버튼 복구', async () => {
    const { page, ctx } = await open(browser, { reply: { ok: false, message: '연락처를 확인해 주세요.' } }); await fill(page); await page.click('#submitBtn');
    await page.waitForSelector('#formMsg.error'); eq(await page.textContent('#formMsg'), '연락처를 확인해 주세요.');
    eq(await page.isVisible('#applyForm'), true); eq(await page.isEnabled('#submitBtn'), true); await ctx.close();
  });

  console.log('[모바일]');
  await t('375px 폭 — 가로 스크롤 없음', async () => {
    const { page, ctx } = await open(browser, { viewport: { width: 375, height: 812 } });
    eq(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    eq(await page.isVisible('.hdr-cta'), true, '모바일에서도 상단 신청 버튼 표시');
    await page.screenshot({ path: path.join(OUT, 'mobile.png'), fullPage: true });
    await ctx.close();
  });

  const { page, ctx } = await open(browser); await page.screenshot({ path: path.join(OUT, 'desktop.png'), fullPage: true }); await ctx.close();
  await browser.close();
  console.log(`\n결과: ${pass} 통과 / ${fail} 실패`);
  process.exit(fail ? 1 : 0);
})();
