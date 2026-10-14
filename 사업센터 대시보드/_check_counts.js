/* 집계 규칙이 바뀌지 않았는지 검산하는 도구 (CLAUDE.md 32번 — 집계 규칙 동결)
   화면·집계 코드를 고친 뒤 반드시 돌린다. 하나라도 ✗면 의도치 않게 기준을 건드린 것이다.
   기준값은 2026-10-07 마스터(세무사무소목록, 919행)로 뽑은 2026년 값이다.
   실행: NODE_PATH=/opt/node22/lib/node_modules /opt/node22/bin/node _check_counts.js <마스터JSON>
         (마스터JSON = {hdr:[...], rows:[[...]]} 형태. 엑셀을 그대로 옮긴 것) */
const {chromium}=require('playwright');
const MP=process.argv[2];
if(!MP){ console.error('마스터 JSON 경로를 인자로 주세요'); process.exit(1); }
const M=JSON.parse(require('fs').readFileSync(MP,'utf8'));
const EXPECT={
  '플러스 가입':89, '└ 신규 플러스':28, '└ 재가입':1, '└ 업셀':60,
  '플러스 전환':60, '개업세무사 가입':19, '개업세무사∩플러스':16,
  '총 가입수':100, '재가입':11, '정지':101, '해지':117,
  '요금제 변경':121, '월 목표 분자':149,
};
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const pg=await b.newPage();
const errs=[]; pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('file://'+require('path').resolve(__dirname,'index.html'));
await pg.evaluate(()=>{window.DEV_SKIP_AUTH=true;});
await pg.reload();
await pg.evaluate(()=>{document.querySelectorAll('#authGate,#hostWarnBar').forEach(e=>e.remove());});
await pg.waitForTimeout(900);
const got=await pg.evaluate(M=>{
  xlParseOffice(M.rows,M.hdr);
  const last=m=>new Date(2026,m,0).getDate();
  const J=window.joinSplitCount, add=(f)=>{let t=0;for(let m=1;m<=12;m++){
    const s='2026-'+String(m).padStart(2,'0')+'-01', e='2026-'+String(m).padStart(2,'0')+'-'+String(last(m)).padStart(2,'0');
    t+=f(s,e)||0;} return t;};
  return {
    '플러스 가입':   add((s,e)=>J('plus',s,e)),
    '└ 신규 플러스': add((s,e)=>J('plus_new',s,e)),
    '└ 재가입':      add((s,e)=>J('plus_rejoin',s,e)),
    '└ 업셀':        add((s,e)=>J('plus_upsell',s,e)),
    '플러스 전환':   add((s,e)=>perfStat(s,e).plusConvN),
    '개업세무사 가입':add((s,e)=>J('pkg',s,e)),
    '개업세무사∩플러스':add((s,e)=>J('plus_pkg',s,e)),
    '총 가입수':     add((s,e)=>J('join_n',s,e)+J('join_r',s,e)),
    '재가입':        add((s,e)=>J('join_r',s,e)),
    '정지':          add((s,e)=>J('pause',s,e)),
    '해지':          add((s,e)=>J('churn',s,e)),
    '요금제 변경':   add((s,e)=>perfStat(s,e).plan.length),
    '월 목표 분자':  add((s,e)=>perfStat(s,e).goalJoinN),
  };
},M);
let bad=0;
Object.keys(EXPECT).forEach(k=>{
  const ok=got[k]===EXPECT[k]; if(!ok)bad++;
  console.log((ok?'✓':'✗')+' '+k.padEnd(18)+' 기준 '+String(EXPECT[k]).padStart(4)+'  지금 '+String(got[k]).padStart(4));
});
/* 기간 길이와 무관해야 한다 — 연간 한 번 계산한 값이 월별 합과 같아야 하고, 누적은 0이면 안 된다 */
const extra=await pg.evaluate(()=>({
  연간전환: perfStat('2026-01-01','2026-12-31').plusConvN,
  누적전환: perfStat('1900-01-01','2026-12-31').plusConvN,
}));
const okY=extra.연간전환===EXPECT['플러스 전환'], okC=extra.누적전환>0;
if(!okY)bad++; if(!okC)bad++;
console.log((okY?'✓':'✗')+' 연간 전환 = 월별 합   기준 '+EXPECT['플러스 전환']+'  지금 '+extra.연간전환);
console.log((okC?'✓':'✗')+' 누적 전환 > 0          지금 '+extra.누적전환);
console.log(bad? ('\n✗ '+bad+'곳이 기준과 다릅니다 — 집계 규칙을 건드렸는지 확인하세요(CLAUDE.md 32번)')
               : '\n✓ 전부 기준과 같습니다');
if(errs.length)console.log('pageerror',errs.length,errs.slice(0,3));
await b.close();
process.exit(bad?1:0);
})();
