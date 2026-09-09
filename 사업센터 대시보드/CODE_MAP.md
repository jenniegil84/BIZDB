# CODE_MAP.md — index.html 코드 위치 지도

> 목적: `index.html`(한 파일에 전체 기능이 들어있음, 1만 6천 줄 이상)에서 **어떤 화면을
> 고치려면 어느 함수를 찾아야 하는지** 빠르게 알기 위한 지도. 코드 설명서가 아니라
> "어디를 열어야 하는가"만 다룬다. 줄 번호는 파일이 바뀌면 곧 틀어지므로 적지 않는다 —
> 대신 grep으로 바로 찾을 수 있는 **함수명·문자열**을 적는다.

- 버전: v01.06
- 최초 작성일: 2026-09-08
- 관련 문서: `MD_ROUTER.md`(정책·데이터 문서 안내), `PROJECT_CONTEXT.md`(현재 상태·이력)

## 유지보수 규칙 (중요, CLAUDE.md 8번 섹션 11번 항목과 동일)

**코드를 수정하거나 화면·함수를 추가·삭제했으면 이 문서도 반드시 갱신한다.** 예외를
임의로 판단하지 않는다 — 안 갱신하면 다음에 더 헷갈리게 만드는 낡은 지도가 된다.

---

## 1. 전체 구조 3줄 요약

1. 왼쪽 사이드바 메뉴는 `NAV` 배열(사이드바 섹션·항목 정의) → 클릭하면 `goTab(id)` →
   `TAB` 전역변수를 바꾸고 `paintSide()`(사이드바 다시 그림) → `route()`(오른쪽 화면 그림) 순으로 이어진다.
2. `route()`는 `TAB` 값을 보고 그 화면을 **3가지 방식 중 하나**로 그린다(아래 2번 참고) —
   같은 이름의 화면이라도 어떤 방식인지에 따라 실제 코드 위치가 완전히 다르다.
3. 저장·복원(새로고침해도 안 사라지게)은 **두 계층**으로 나뉘어 있고(6번 참고), 둘 다
   "무엇을 저장할지" 목록에 새로 등록해야만 실제로 저장된다 — 등록을 빠뜨리는 게 이 코드베이스
   에서 가장 자주 반복된 실수다(PROJECT_CONTEXT.md "13. 배운 점" 참고).

---

## 2. `route()`가 화면을 그리는 3가지 방식

`route()` 함수(`function route(){`로 검색) 안에서 `TAB` 값을 위에서부터 순서대로 검사한다.
**먼저 걸리는 조건이 그 화면을 그린다** — 뒤에 같은 id를 검사하는 코드가 또 있어도 절대
실행되지 않는다(3번 "알려진 함정" 참고).

| 방식 | 판별 조건 | 실제로 화면을 그리는 곳 |
|---|---|---|
| **① IX 시스템** (원본 index.html을 통째로 이식한 13개 화면) | `IX_TABS.indexOf(TAB)>=0` | `ixShell(TAB)`으로 틀만 만들고 `ixMount(TAB)`이 원본 탭바 버튼을 대신 클릭 + `RENDER[TAB]()`(=`window.__ixRender[TAB]()`)를 호출해 다시 그린다. **진짜 내용은 `RENDER['그화면id']=...` 로 등록된 함수 안에 있다.** |
| **② 영업 대시보드 어댑터** | `TAB==='sales'` | `salesShell()`+`salesMount()` — `#salesHost`/`#salesKeep`/`#salesSlot`으로 별도 영업용 대시보드를 붙였다 뗀다. IX 시스템과 다른 독자 구조. |
| **③ 단순 화면** (이 목업 전용으로 새로 만든 화면) | `TAB==='act'`, `'updates'`, `'mkt'/'biz'/'ux'`, `'sem'`, `'week'` | `route()` 안에 `p.innerHTML=OOShell(); paintOO();` 한 줄로 바로 그린다. `TABS`·`IX_TABS`·`STUB` 같은 4종 세트 없이 `NAV`+`BUILT_TABS`+이 한 줄만 있으면 된다. **새 화면을 추가할 때는 이 방식이 제일 간단하다.** |

`analyticsShell`/`homeShell`/`inqShell`로 시작하는 `else if(TAB==='home') ...` 계열 코드가
`route()` 맨 아래에 남아 있는데, `home`·`daily`·`monthly`·`cumul`·`inq`는 전부 ①(IX_TABS)에서
먼저 걸려 `return`하므로 **이 아래쪽 분기들은 죽은 코드**다(3번 참고).

---

## 3. 화면별 담당 함수 — 사이드바에 보이는 순서대로

각 행의 "찾는 법"은 그대로 grep에 붙여넣으면 되는 문자열이다.

| 사이드바 표시명 | tab id | 방식 | 실제 담당 함수 (찾는 법) | 비고 |
|---|---|---|---|---|
| 주간회의 | `week` | ③ | `function paintWeek(){` / `function weekShell(){` | 월별 표 2개는 `monPerfTableHtml`(플러스·프로모션 가입)·`planJoinTableHtml`(전체 가입 현황) — 이번 달 열 형광펜은 두 표가 공유하는 `wkMonHl(y,m,strong)`(v08.281). PDF 저장은 `@media print` CSS(파일 상단)로만 제어. `RENDER['week']`도 등록돼 있지만 route()는 안 거쳐가고 `paintWeek()`를 직접 부른다. |
| 통합 현황 | `home` | ① | `RENDER['home']=render;` 바로 위 IIFE, `document.getElementById('s-home')` | 화면 아래쪽 `homeShell()`/`paintHome()`은 **죽은 코드**(호출 안 됨). |
| 시장 현황 | `sales` | ② | `function salesMount(){` | |
| 일별 | `daily` | ① | `function renderDaily(){` (`document.getElementById('s-daily')`) | **중복 주의**: 파일 앞쪽에 옛 `render()`(같은 `#s-daily`)가 먼저 있는데 `RENDER['daily']`가 나중에 `renderDaily`로 다시 등록돼 덮어쓴다 — **`renderDaily`가 실제로 화면에 보이는 쪽**이다. 앞쪽 옛 `render()`를 고쳐도 반영 안 된다. |
| 월별 | `monthly` | ① | `function renderMonthly(){` (`document.getElementById('s-monthly')`) | 위와 같은 중복 구조 — `renderMonthly`가 활성. |
| 누적 | `cumul` | ① | `function renderCumul(){` (`document.getElementById('s-cumul')`) | 위와 같은 중복 구조 — `renderCumul`이 활성. |
| 실적 관리 | `perfmg` | ① | `function renderPerfMg(){` (`document.getElementById('s-perfmg')`) | 중복 없음. |
| 신청 관리 | `inq` | ① | `RENDER['inq']=render;` 바로 위 IIFE, `document.getElementById('s-inq')` | |
| 마케팅 / UX / 영업 | `mkt`/`ux`/`biz` | ③ | `function shell(){` / `function paint(){` | 3개 팀 탭이 **같은 함수 하나**를 공유하고 내부에서 `TAB` 값으로 분기한다. 팀탭 공통 UI(핵심과제 등)를 고칠 땐 여기. 「성과 지표」 블록은 `teamMetricPanelHtml`(표·입력칸)·`metricChartSvg`(막대 그래프)·`paintTeamMetric`. SVG는 실제 크기(width/height 속성)로 그린다 — `width:100%`만 주면 값이 몇 개 없을 때 통째로 확대된다(v08.280). |
| 세미나 운영 | `sem` | ③ | `function semShell(){` / `function paintSem(){` | |
| 프로모션 종료·정상가 전환 | `promo` | ① | `RENDER['promo']=render;` 바로 위 IIFE, `document.getElementById('s-promo')` | "종료 관리 목록"·"190만 일시납" 관련 로직이 전부 이 안에 있다. |
| 해지·재가입 | `churn` | ① | `function churnRender(){` (`document.getElementById('s-churn')`) | `opsPage()` 공통 틀(카드+목록) 사용. |
| 정지업체 | `suspend` | ① | `function suspendRender(){` (`document.getElementById('s-suspend')`) | 위와 같은 `opsPage()` 틀. |
| 고객 검색 | `cust` | ① (변형) | `window.custRender=function(){` (`document.getElementById('s-cust')`) | 다른 IX 화면과 달리 `RENDER[]`가 아니라 `window.custRender`로 노출 — 탭을 다시 열 때 자동 재호출(`ixMount`)이 안 걸릴 수 있으니, 값이 안 바뀌면 이 차이부터 의심할 것. |
| 데이터 업로드 | `data` | ① | `document.getElementById('s-data')` 를 채우는 IIFE (`xlPanelHTML()` 포함) | v08.272부터 사이드바 메뉴 자체가 `jennie.gil@roumit.com` 로그인일 때만 보임(`paintSide()`의 `DATA_UPLOAD_EMAIL` 필터). 엑셀 파서 본체는 `function xlParseOffice`/`xlParseBilling`/`xlParseMonitor`/`xlApplyInq`. |
| 활동 타임라인 | `act` | ③ | `function actShell(){` / `function paintAct(){` | v08.275부터 사이드바 "안내" 섹션 소속(예전엔 "요약"). |
| 업데이트 내역 | `updates` | ③ | `const UPDATE_LOG=[` / `function paintUpdates(){` | 새 업데이트를 추가할 땐 `UPDATE_LOG` 배열 **맨 앞에** `{id:'다음 번호', d:'날짜', tt:'제목', b:'쉬운 설명'}` 추가(id는 안 읽음 배지 판정 기준이라 한 번 쓰면 절대 재사용·수정 금지). |

---

## 4. 사이드바 메뉴 구조 자체를 고칠 때

- 메뉴 목록·섹션·순서: `const NAV=[` 배열.
- 메뉴 항목 옆 건수 배지·"NEW" 배지: `function paintSide(){` 안의 `.map(i=>{...})` 부분.
- 검정 글씨(화면 있음) vs 회색 글씨(화면 없음) 구분: `const BUILT_TABS=[` 배열 — 새 화면을
  만들면 여기에도 id를 추가해야 진하게 보인다.
- 탭이 없을 때 보여줄 안내문(스텁): `const STUB={`.

---

## 5. 계정별 화면 노출 제어

- 로그인 이메일은 `showUser()`가 `window.__curEmail`에 저장한다(로그인 성공마다 갱신).
- "이 계정만 보이게" 만들고 싶으면 `paintSide()`의 `sc.items.filter(...)`(메뉴 자체를 숨김) 또는
  `showUser()` 안의 버튼 조립 부분(버튼만 숨김, 예: "설정")을 참고해 같은 패턴
  (`window.__curEmail===특정이메일`)을 재사용한다. 이미 `DATA_UPLOAD_EMAIL`(현재
  `jennie.gil@roumit.com`) 상수가 있으니, 같은 계정 기준이면 새 상수를 또 만들지 않고 재사용한다.

---

## 6. 저장·복원 — 두 계층 (등록 안 하면 저장 안 됨)

| 계층 | 저장 함수 | 목록(반드시 등록) | 복원 함수 | 주로 다루는 데이터 |
|---|---|---|---|---|
| IX 계층 | `IX_saveToSheet(key, 값)` | `const STATE_MAP={` | `IX_loadFromSupabase()` | 업로드 파일(세무사무소목록·청구내역 등), 통합현황류 통계 |
| 보드 계층 | `saveToSheet(key, 값)` | `const BOARD_STATE_MAP={` | `loadFromSupabase()` | 칸반 카드(`CARDS`)·팀 핵심과제·업무보드·사용자 명부(`__userDir`)·팀탭 성과 지표 등 |

새 전역 상태(`window.__새변수` 등)를 만들어서 새로고침 후에도 남아있어야 한다면, **어느 계층이든
반드시** 위 두 `_STATE_MAP` 중 하나에 `저장키:'전역변수명'` 한 줄을 추가하고, 그 계층의 복원
함수에도 복원 분기를 추가해야 한다. 둘 다 안 하면 화면엔 잘 나오다가 새로고침·재배포하면
조용히 사라진다 — 이 프로젝트에서 가장 많이 반복된 버그 유형이다.

---

## 7. 입력 칸 공통 규칙 — 날짜(v08.277)·검색(v08.278)

`type=date` 칸은 연·월·일이 따로 나뉘어 있어서 **「30」을 치려고 「3」만 눌러도 그 순간 값이
유효해지고(2026-09-03) change가 먼저 난다.** 그때 화면을 다시 그리면 입력 중이던 칸이 새로
만들어져 커서가 사라지고, 뒤이어 친 「0」이 갈 곳을 잃는다 → 「30」이 「03」으로 굳는다.
`type=month`도 연도 칸에서 같은 일이 난다(「2」만 쳐도 0002년으로 유효해진다).

**그래서 날짜 칸의 onchange에서 화면을 다시 그릴 때는 반드시 `dtRedraw(그릴함수)`로 감싼다.**
(`const RENDER={}` 선언 바로 아래에 있는 공통 블록 — `dtRedraw`로 grep)

- 커서가 그 칸에 있는 동안(직전 1.5초 안에 키를 눌렀으면)은 **다시 그리지 않고 미룬다** —
  칸을 벗어날 때(blur), 또는 커서를 계속 둬도 2초 뒤에 그린다.
- 달력에서 골랐거나 코드가 값을 바꾼 경우(키 입력 없이 change)는 **즉시** 그린다.
- 시작~끝 칸을 Tab으로 옮겨 이어 입력하는 경우도 그 칸까지 끝날 때까지 미룬다.
- blur 도중에 다시 그리면 브라우저가 `innerHTML` 오류("옮겨진 노드")를 내므로 한 틱 뒤에 그린다.
- 어느 칸인지 넘길 필요 없다 — change 시점에 그 칸이 `document.activeElement`다.
- 키 누른 시각은 문서 전체에 걸어 둔 keydown 리스너가 자동으로 기록한다. **새로 만드는 날짜
  칸에는 아무것도 달지 않아도 되고, 재렌더 함수만 `dtRedraw`로 감싸면 된다.**

적용된 곳(이 규칙을 따르는 setter): `pmSet`(실적 관리 발생일·등록일) · `ofSet`(신청 관리 ›
고객 현황 기간) · `inqSetVal`(신청 관리 등록일) · `daySet`(일별) · `monSet`(월별) ·
`mtMonthSet`(마케팅 정기업무 기준월) · 카드 상세는 `setF`/`setLog`가 v08.164에서 다른 방식
(패널을 아예 다시 안 그림)으로 이미 해결.

**기간 필터를 한 달씩 옮기는 버튼**은 `dtMonthRange(기준일, ±1)`(그 달 1일~말일을 돌려준다)로
만든다 — 화면별 래퍼는 `pmMonthShift`(실적 관리) · `ofMonthShift`(고객 현황). 일별·월별·기준월은
그 전부터 있던 `dayShift`/`monShift`/`moShift`를 쓴다.

### 검색 칸(글자 입력)도 같은 문제 — `txRedraw` — v08.278

검색 칸은 `oninput`(글자 하나마다)으로 화면을 다시 그리던 곳이 있었다. 그러면 그 칸이 새로
만들어져 커서가 사라지고, **한글은 조합 중이던 글자까지 끊겨 첫 자모만 남는다**(「무선」을
치면 「ㅁ」만 들어갔다). 그래서 검색 칸에서 화면을 다시 그릴 때는 `txRedraw(그릴함수, '칸 id')`를
쓴다 — ① 마지막 입력 뒤 0.3초에 한 번만 그리고 ② 한글 조합 중에는 조합이 끝날 때까지 미루고
③ 그린 뒤 그 칸을 id로 다시 찾아 커서를 원래 자리로 되돌린다. **그래서 검색 칸에는 id가 있어야
하고, 마크업에서 `this.id`를 넘겨준다.**

적용된 곳: `pmSet('q',…)`(실적 관리 두 하위 탭 — `#pmQ`·`#pmQorp`) · `ofSet('q',…)`(신청 관리 ›
고객 현황 — `#ofQ`) · `inqSetVal('iq',…)`(신청 관리 제목 검색 — `#inqHdrQ`).

**반대로, 애초에 목록만 다시 그려서 이 문제가 없는 곳은 건드리지 않았다** — `chSet`→`chPaint()`
(`#chList`만), `spSet`→`spPaint()`(`#spList`만), 고객 검색 `custRender()`→`#cList`·`#cCnt`만,
사이드바 검색 `sideFilter()`(보이기만 토글). **이게 원래 더 나은 구조다** — 새 검색 칸을 만들 때는
가능하면 이 방식(입력 칸이 든 영역은 그대로 두고 목록만 갈아끼우기)을 먼저 쓰고, 화면 전체를
다시 그려야만 하는 경우에 `txRedraw`를 쓴다.

## 8. 실적 귀속 — 두 개의 "실적확정 명단" (v08.279)

사업자번호가 명단에 있으면 **유입경로·가입채널·최종실적 세 칸이 자동 확정**되고, 실적 관리
목록에서 **테두리 색**으로 구분된다. 두 명단은 구조가 완전히 같다.

| 명단 | 전역변수 / 저장키 | 판정 함수 | 적용 채널값 | 테두리 |
|---|---|---|---|---|
| 위멤버스 실적확정(실적보호업체) | `__wembProtect` / `wemb_protect` | `wembProtectHit(r)` | `위멤버스 > 온라인 마케팅` | **빨강** `var(--red)` |
| 로움 실적확정 | `__salesInside` / `sales_inside` | `salesInsideHit(r)` | `영업 > 내부영업` (`window.SALES_INSIDE_CH`) | **파랑** `#3B82F6` |

- 판정은 **사업자번호 완전일치만** — 상호명으로는 판정하지 않는다(짧은 상호가 다른 사무소 문의에
  우연히 들어가면 실적이 통째로 잘못 귀속된다, v08.98).
- **두 명단에 같은 번호가 있으면 위멤버스가 우선**한다(`salesInsideHit`이 내부에서 먼저 걸러낸다).
- 값을 계산하는 자리 3곳: `inflowBase`(유입경로) · `pmRows`의 `joinCh`(가입채널) ·
  `IX_creditChannel`(최종실적). **수동으로 고른 값이 있으면 항상 그것이 우선**한다(잠그지 않는다).
- 「문의 없는 실적」 탭은 드롭다운 대신 배지(「위멤버스 확정」/「로움 확정」)로 보여주고 잠근다.
- 일괄 지정(`pmBulkTargets`)에서는 두 명단 건을 **대상에서 제외**한다(이미 확정값이라).
- **두 명단 모두 앱 안에 등록 화면이 없다** — Supabase에서 불러오기만 한다(`STATE_MAP`).
  명단을 바꿔야 하면 등록 화면부터 만들어야 한다(2026-09-09 기준 미해결).

## 9. 알려진 함정 (grep하기 전에 먼저 확인)

1. **`route()` 아래쪽의 `else if(TAB==='home'/'daily'/'monthly'/'cumul'/'inq')` 분기는
   죽은 코드다** — 위쪽 IX_TABS 체크에서 이미 `return`하기 때문에 절대 실행되지 않는다.
   `homeShell`/`paintHome`/`analyticsShell`/`paintDaily`(옛 버전)/`inqShell`/`paintInq`를
   고쳐도 화면에 반영되지 않는다.
2. **`daily`/`monthly`/`cumul`은 각각 렌더 함수가 파일에 두 번 정의돼 있다** — 나중에 정의된
   `renderDaily`/`renderMonthly`/`renderCumul`이 `RENDER[]`에 마지막으로 등록돼 실제로
   화면에 보이는 쪽이다. 고칠 함수가 맞는지 헷갈리면 `RENDER['daily']=`를 grep해서 **몇 번
   나오는지, 그중 어느 줄이 파일에서 더 아래에 있는지** 확인한다(더 아래 것이 이긴다).
3. **같은 이름의 함수·변수가 여러 화면에 나눠 있을 수 있다** — 고치기 전에 항상
   `grep -n "함수명"`으로 정의·호출 위치를 먼저 셀 것(CLAUDE.md 8번 섹션 2번 항목).
4. **전역 상태를 읽기 전에 복원이 끝났는지 확인할 것** — `loadFromSupabase()`/
   `IX_loadFromSupabase()` 완료 전에 어떤 전역값을 읽어 저장을 예약하면, 복원이 끝난 뒤에도
   그 예약이 옛 값으로 서버를 덮어쓸 수 있다("복원 전 계산·저장" 경합조건, PROJECT_CONTEXT.md
   "13. 배운 점" 참고 — 이미 4번 이상 반복된 유형).
5. **입력 칸(날짜·검색)의 핸들러에서 그 칸이 들어있는 영역을 다시 그리면 입력이 끊긴다**
   — 7번 섹션 참고. "연도 4자리 검사"나 "0.4초 디바운스" 같은 임시 방어로는 못 막는다(사람이
   그보다 느리게 치면 그대로 깨지고, 한글은 조합 중 글자가 날아간다). 날짜 칸은 `dtRedraw`,
   검색 칸은 `txRedraw`로 감싸거나, 애초에 목록만 갈아끼운다(CLAUDE.md 8번 섹션 5번 항목).
6. **`#s-mkt`·`#s-biz`(마케팅 정기업무·영업 잠재고객 화면)는 지금 어디에서도 열리지 않는다** —
   `mkt`·`biz` 탭은 팀 보드(`shell()`/`paint()`)로 가고 `IX_TABS`에도 없어서, 그 안의 UI(기준 월
   칸·검색 칸 등)는 화면에 뜨지 않는다(그래서 그 안의 같은 버그는 손대지 않았다 — 확인할 방법이
   없다). 그 화면을 고치라는 요청을 받으면 먼저 이 사실을 알릴 것.
7. **`inqRowOf(fid)`의 색인은 행 수로 무효화한다** — 이 색인은 화면을 처음 그릴 때(업로드·복원
   전, `PAY.inq.rows`가 빈 상태) 만들어지는데, v08.279 전에는 한 번 만들면 다시 만들지 않아
   업로드 뒤에도 계속 비어 있었다. 그래서 이 색인으로 사업자번호를 찾는 **유입경로 자동 판정만
   조용히 실패**했다(최종실적·가입채널은 행을 직접 받아 써서 정상 — "칸마다 값이 다르다"의 원인).
   플로우 원본 행을 fid로 찾는 코드를 새로 쓸 때는 이 색인이 최신인지 확인할 것.
8. **입력 칸에 id를 새로 붙일 때는 그 마크업에 이미 id가 있는지 먼저 확인한다** — 해지·재가입·
   정지업체 검색 칸(`#chQ`·`#spQ`)은 이미 id가 있었는데 못 보고 또 붙여 `id` 속성이 두 번 들어간
   적이 있다(v08.278 작업 중, 커밋 전에 되돌림). 죽은 화면(`inqShell`)의 `#inqQ`와 이름이 겹치는
   문제도 있었다 — `grep -n 'id="붙일이름"'`으로 먼저 확인할 것.
