# flow.team Developer API Docs — Harvest Index

Source: https://api.flow.team/docs (harvested 2026-08-24)
기본 경로 (base URL) for all endpoints: https://api.flow.team

Each endpoint file contains one `### <METHOD> <path> <name>` section per endpoint, with
`#### [메타데이터]`, `#### [요청]` (headers / path / query / body params + Constraints), and
`#### [응답]` (response fields + success/failure JSON examples) captured verbatim.
The "코드 스니펫" and "테스트" tabs were intentionally not captured.

## Reference / concept pages

| File | Description |
|---|---|
| 00-scopes.md | 권한·범위: read-only MCP behaviour, permission inheritance (master key + userId), per-plan tool gating |
| 00-pagination.md | Common list conventions: page/limit params, meta {page,limit,total,hasNext}, filters, sort=field:asc\|desc |
| 00-errors.md | Error envelope shape, HTTP status table, common error.code values, retry policy |
| 00-webhook.md | Webhook integration guide (Bot creation, endpoint creation, URL registration) + supported services/events table |
| 00-faq.md | FAQ: rate limits (1,000/min read, 120/min write), key & bot quotas, MCP questions — all answers expanded |

## Endpoint pages — /user/* (API key identifies the acting user; no userId parameter)

| File | Endpoints | Description |
|---|---|---|
| user-projects.md | 12 | 프로젝트 조회/상세/참여자/컬럼/상태컬럼, 프로젝트·참여자·그룹·업무 커스텀 컬럼 생성/수정 |
| user-divisions.md | 1 | 부서 조회 |
| user-employees.md | 3 | 구성원 목록 / 내 정보(me) / 단건 조회 |
| user-posts.md | 13 | 게시글 목록·단건 상세, 업무 필터 조회, 게시글·업무·하위업무·일정·할일 작성, 업무 상태/시작일/마감일/우선순위/담당자 수정 |
| user-comments.md | 3 | 게시글 댓글 조회/작성, 대댓글 조회 |
| user-calendars.md | 8 | 캘린더 목록/기본 캘린더/구독 가능 캘린더, 일정 범위·상세 조회, 일정 생성/수정/삭제 |
| user-search.md | 4 | 글·프로젝트·구성원·일정 검색 |
| user-drive.md | 3 | 파일 통합검색, 업로드 presigned URL 발급, 업로드 finalize |
| user-alarms.md | 3 | 내 알림 조회, 단일/전체 읽음 처리 |
| user-wiki.md | 7 | 위키 문서 생성/본문 조회/본문 수정/제목 수정, 문서 검색, 최상위·직속 자식 트리 조회 |

## Endpoint pages — /v1/* (organization API key; userId / registerId passed explicitly)

| File | Endpoints | Description |
|---|---|---|
| v1-bots.md | 6 | 알림봇 조회, 알림 메시지 단건/다수 전송, 봇 명의 게시글·업무·일정 작성 |
| v1-calendars.md | 8 | 캘린더 목록/기본/구독 가능, 일정 범위·상세 조회, 일정 생성/수정/삭제 (userId 필수) |
| v1-chats.md | 4 | 참여중인 채팅방 조회, 채팅방 상세, 메시지 전송, 참여자 초대 |
| v1-divisions.md | 5 | 부서 조회, 단건/복수 부서 추가, 단건/복수 부서 정보 수정 |
| v1-employees.md | 6 | 구성원 목록/단건 조회, 단건/복수 추가, 단건/복수 정보 수정 |
| v1-posts.md | 10 | 게시글 목록 조회, 게시글·업무·일정·할일 작성, 업무 상태/시작일/마감일/우선순위/담당자 수정 |
| v1-projects.md | 7 | 프로젝트 조회, 참여중인 프로젝트, 참여자 조회, 컬럼·상태컬럼 조회, 프로젝트·참여자 생성 |
| v1-search.md | 2 | 글 검색, 프로젝트 검색 |
| v1-sso.md | 3 | SSO RSA Public Key 생성(3단계 연동가이드 + JS/Java 암호화 예시), 참여중인 프로젝트 SSO URL 조회, 단일 프로젝트 SSO URL 조회 |

## Endpoint pages — /v2/*

| File | Endpoints | Description |
|---|---|---|
| v2-employees.md | 2 | 구성원 리스트 조회(cursor/nextCursor), 단일 구성원 조회 — 응답 envelope가 v1과 다름(최상위 필드, code/message 오류) |

## Totals

- Reference pages: 5
- Endpoint pages: 20
- Total endpoints captured: 110 (user/* 57, v1/* 51, v2/* 2)
