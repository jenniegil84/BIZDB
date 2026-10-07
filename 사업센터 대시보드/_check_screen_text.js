/* 화면에 남아 있는 "설명 문장"을 찾아내는 점검 도구 (CLAUDE.md 28번 규칙)
   - 전 탭(실적 분석은 책갈피 4개까지)을 열어, 보이는 텍스트 중 35자 이상이면서
     「~습니다/~입니다/~됩니다/~주세요」로 끝나는 문장을 전부 뽑는다.
   - 남아도 되는 것은 **원본 데이터뿐**이다(예: 고객이 쓴 해지사유 — churn 탭).
     그 밖에 뽑히는 것은 전부 지울 대상이다.
   실행: NODE_PATH=/opt/node22/lib/node_modules /opt/node22/bin/node _check_screen_text.js [마스터JSON경로]
   마스터 JSON을 안 주면 데이터 없이 훑는다(빈 화면이라 놓치는 문구가 생길 수 있다). */
const {chromium}=require('playwright');
const MP=process.argv[2]||'';
const M=MP?JSON.parse(require('fs').readFileSync(MP,'utf8')):null;
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const pg=await b.newPage({viewport:{width:1500,height:1200}});
await pg.goto('file:///workspace/BIZDB/사업센터 대시보드/index.html');
await pg.evaluate(()=>{window.DEV_SKIP_AUTH=true;});
await pg.reload();
await pg.evaluate(()=>{document.querySelectorAll('#authGate,#hostWarnBar').forEach(e=>e.remove());});
await pg.waitForTimeout(900);
if(M)await pg.evaluate(M=>{xlParseOffice(M.rows,M.hdr);},M);
const tabs=['week','home','perf','perfmg','inq','promo','churn','suspend','cust','data'];
const subs={perf:['daily','monthly','year','cumul']};
const seen=new Set();
for(const t of tabs){
  await pg.evaluate(t=>goTab(t),t); await pg.waitForTimeout(800);
  if(t==='week'){ await pg.evaluate(()=>{try{paintWeek();}catch(e){}}); await pg.waitForTimeout(800); }
  const views=subs[t]||[null];
  for(const sv of views){
    if(sv){ await pg.evaluate(k=>perfSubSet(k),sv); await pg.waitForTimeout(700); }
    const found=await pg.evaluate(()=>{
      const out=[];
      const vis=el=>{ const r=el.getBoundingClientRect(); const st=getComputedStyle(el);
        return st.display!=='none'&&st.visibility!=='hidden'&&(r.width>0||r.height>0); };
      document.querySelectorAll('#page *, #ixHost *').forEach(el=>{
        if(el.children.length)return;
        if(/^(INPUT|TEXTAREA|SELECT|OPTION|SCRIPT|STYLE|BUTTON)$/.test(el.tagName))return;
        const s=(el.textContent||'').trim().replace(/\s+/g,' ');
        if(s.length<35)return;
        if(!/(습니다|입니다|됩니다|하세요|주세요|않습니다|합니다)/.test(s))return;
        let p=el, ok=true;
        for(let i=0;i<6&&p;i++){ if(!vis(p)){ok=false;break;} p=p.parentElement; }
        if(!ok)return;
        out.push(s.slice(0,110));
      });
      return out;
    });
    found.forEach(x=>{ const k=(sv||t)+' :: '+x; if(!seen.has(x)){ seen.add(x); console.log('['+(sv||t)+'] '+x); } });
  }
}
await b.close();
})();
