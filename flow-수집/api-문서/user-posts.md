# User Posts (https://api.flow.team/docs/api/user/posts)

기본 경로: https://api.flow.team

### GET /user/posts/projects/{projectId} 프로젝트 내 게시글 조회

#### [메타데이터]
GET /user/posts/projects/{projectId}
요청 헤더의 x-flow-api-key 로 인증된 사용자를 기준으로 선택한 프로젝트의 게시글 목록 을 조회합니다.
Path Parameter 에 projectId 를 입력하고, 필요하면 cursor, pageSize, postId, templateTypes Query Parameter를 함께 입력합니다.
별도의 userId Query Parameter는 입력하지 않습니다. 서버가 인증된 사용자 ID를 사용합니다.
다른 오류 케이스는 Error 탭에서 확인 가능합니다.
API 요청에 대한 예시 코드 는 Code Snippet 탭에서 확인 가능합니다.
Test 탭에서 API 요청을 테스트 해볼 수 있습니다.
<projectId 확인 하는 방법>
프로젝트 상단 '점 세개 버튼'을 누르면 프로젝트 번호(projectId)를 확인할 수 있습니다.

#### [요청]
> Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
헤더 파라미터
매개변수 유형 예시 설명
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string dd9dcb4c-1f79-4eb8-9522-940fdefe6c1e 키관리 페이지에서 발급받은 API Key
패스 파라미터
매개변수 유형 예시 설명
projectId* string 23277 프로젝트 ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
쿼리 파라미터
매개변수 유형 예시 설명
cursor string 0 0-based 페이지 커서
Constraints
accept: 0 이상의 숫자
pageSize string 20 페이지 크기
Constraints
accept: 1 이상 100 이하의 숫자
default: 20
max: 100
postId string 40001 특정 게시글 기준 조회용 게시글 ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
templateTypes string 1,2,4 템플릿 타입 콤마 구분 문자열
Constraints
accept: 숫자, 콤마
max-length: 1000

#### [응답]
> Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 오류 를 참고해주세요.
응답 본문
매개변수 유형 예시 설명
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
매개변수 유형 예시 설명
projectId* string 23277 프로젝트 ID
hasNext* boolean true 다음 페이지 존재 여부
lastCursor* number 1 다음 페이지 요청에 사용할 커서, 없으면 -1
posts* array - 조회된 게시글 목록
매개변수 유형 예시 설명
projectId* string 23277 프로젝트 ID
postId* string 40001 게시글 ID
remarkSrno* string -1 비고 일련번호
templateType* string 1 템플릿 타입
registerName* string 홍길동 작성자 이름
registeredDateTime* string 20260509093000 작성일시
projectTitle* string 고객 문의 프로젝트 프로젝트 제목
title* string 주간 진행 공유 게시글 제목
content* string 이번 주 주요 이슈를 공유합니다. 게시글 본문
htmlContent* string <p>이번 주 주요 이슈를 공유합니다.</p> HTML 본문
remarkCount* string 2 댓글 수
readYn* string Y 읽음 여부
sysCode* string FLOW 시스템 코드
rangeType* string ALL 공개 범위 타입
colaboGb* string 0 협업 구분값
checkedYn* string N 체크 여부
publicLinkPermission* string N 공개 링크 권한
subTaskCount* string 0 하위 업무 수
taskStatus* string REQUEST 업무 상태
scheduleStartDateTime* string 20260510100000 업무 시작일(yyyyMMdd) 또는 일정 시작일시(yyyyMMddHHmmss)
scheduleFinishDateTime* string 20260510110000 업무 종료일(yyyyMMdd) 또는 일정 종료일시(yyyyMMddHHmmss)
allDayYn* string N 종일 일정 여부
error object - API 응답 오류
매개변수 유형 예시 설명
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
응답 본문 예시
// json (요청성공)
{
"response": {
"success": true,
"code": 200,
"message": "success",
"data": {
"projectId": "23277",
"hasNext": true,
"lastCursor": 1,
"posts": [
{
"projectId": "23277",
"postId": "40001",
"remarkSrno": "-1",
"templateType": "1",
"registerName": "홍길동",
"registeredDateTime": "20260509093000",
"projectTitle": "고객 문의 프로젝트",
"title": "주간 진행 공유",
"content": "이번 주 주요 이슈를 공유합니다.",
"htmlContent": "<p>이번 주 주요 이슈를 공유합니다.</p>",
"remarkCount": "2",
"readYn": "Y",
"sysCode": "FLOW",
"rangeType": "ALL",
"colaboGb": "0",
"checkedYn": "N",
"publicLinkPermission": "N",
"subTaskCount": "0",
"taskStatus": "",
"scheduleStartDateTime": "",
"scheduleFinishDateTime": "",
"allDayYn": ""
},
{
"projectId": "23277",
"postId": "40002",
"remarkSrno": "-1",
"templateType": "2",
"registerName": "김플로",
"registeredDateTime": "20260509103000",
"projectTitle": "고객 문의 프로젝트",
"title": "1차 응대 업무",
"content": "고객 문의 1차 응대를 진행합니다.",
"htmlContent": "<p>고객 문의 1차 응대를 진행합니다.</p>",
"remarkCount": "0",
"readYn": "N",
"sysCode": "FLOW",
"rangeType": "ALL",
"colaboGb": "0",
"checkedYn": "N",
"publicLinkPermission": "N",
"subTaskCount": "3",
"taskStatus": "REQUEST",
"scheduleStartDateTime": "20260509",
"scheduleFinishDateTime": "20260512",
"allDayYn": ""
}
]
}
}
}
// json (요청실패)
{
"response": {
"success": false,
"code": 401,
"message": "error",
"error": {
"code": "UNAUTHORIZED_ERROR",
"message": "API Key 정보가 올바르지 않습니다."
}
}
}

### GET /user/posts/{postId} 게시글 단건 상세 조회

#### [메타데이터]
GET /user/posts/{postId}
요청 헤더의 x-flow-api-key 로 인증된 사용자를 기준으로 게시글 단건 상세 를 조회합니다.
Path Parameter 에 postId 를 입력합니다.
별도의 projectId 와 userId 는 입력하지 않습니다. 서버가 게시글의 프로젝트를 조회하고 인증된 사용자 ID를 사용합니다.
다른 오류 케이스는 Error 탭에서 확인 가능합니다.
API 요청에 대한 예시 코드 는 Code Snippet 탭에서 확인 가능합니다.
Test 탭에서 API 요청을 테스트 해볼 수 있습니다.

#### [요청]
> Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
헤더 파라미터
매개변수 유형 예시 설명
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string dd9dcb4c-1f79-4eb8-9522-940fdefe6c1e 키관리 페이지에서 발급받은 사용자 API Key
패스 파라미터
매개변수 유형 예시 설명
postId* string 40001 게시글 ID
Constraints
accept: 숫자
min-length: 1
max-length: 15

#### [응답]
> Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 오류 를 참고해주세요.
응답 본문
매개변수 유형 예시 설명
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - 게시글 상세 데이터
매개변수 유형 예시 설명
projectId* string 23277 프로젝트 ID
postId* string 40001 게시글 ID
remarkSrno* string -1 댓글 일련번호
templateType* string 1 게시글 템플릿 타입
title* string 주간 진행 공유 게시글 제목
content* string 이번 주 주요 이슈를 공유합니다. 게시글 본문
commentContent string 이번 주 주요 이슈를 공유합니다. 댓글형 본문
outContent string 외부 표시 본문
htmlContent* string <p>이번 주 주요 이슈를 공유합니다.</p> HTML 본문
contentJsonYn* string N 본문 JSON 여부
registerId* string flow@flow.team 작성자 ID
registerName* string 홍길동 작성자 이름
registeredDateTime* string 20260509093000 작성 일시
editedDateTime* string 20260509113000 수정 일시
connectUrl string https://flow.team/post/40001 연결 URL
remarkCount* string 2 댓글 수
existYn* string Y 게시글 존재 여부
nextYn* string N 다음 데이터 존재 여부
totalCount* string 1 전체 건수
sectionCount* string 0 섹션 건수
remarks* array - 댓글 원본 목록
attachments* array - 첨부파일 원본 목록
imageAttachments* array - 이미지 첨부 원본 목록
todos* array - 할일 원본 목록
schedules* array - 일정 원본 목록
tasks* array - 업무 원본 목록
subTasks* array - 하위 업무 원본 목록
upLinkTasks* array - 상위 연결 업무 원본 목록
votes* array - 투표 원본 목록
projectColumns* array - 프로젝트 컬럼 원본 목록
error object - API 응답 오류
매개변수 유형 예시 설명
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
응답 본문 예시
// json (요청성공)
{
"response": {
"success": true,
"code": 200,
"message": "success",
"data": {
"projectId": "23277",
"postId": "40001",
"remarkSrno": "-1",
"templateType": "1",
"title": "주간 진행 공유",
"content": "이번 주 주요 이슈를 공유합니다.",
"commentContent": "이번 주 주요 이슈를 공유합니다.",
"outContent": "",
"htmlContent": "<p>이번 주 주요 이슈를 공유합니다.</p>",
"contentJsonYn": "N",
"registerId": "flow@flow.team",
"registerName": "홍길동",
"registeredDateTime": "20260509093000",
"editedDateTime": "20260509113000",
"connectUrl": "https://flow.team/post/40001",
"remarkCount": "2",
"existYn": "Y",
"nextYn": "N",
"totalCount": "1",
"sectionCount": "0",
"remarks": [],
"attachments": [],
"imageAttachments": [],
"todos": [],
"schedules": [],
"tasks": [],
"subTasks": [],
"upLinkTasks": [],
"votes": [],
"projectColumns": []
}
}
}
// json (요청실패)
{
"response": {
"success": false,
"code": 401,
"message": "error",
"error": {
"code": "UNAUTHORIZED_ERROR",
"message": "API Key 정보가 올바르지 않습니다."
}
}
}

### GET /user/posts/projects/{projectId}/tasks/filter 프로젝트 내 업무 필터 조회

#### [메타데이터]
GET /user/posts/projects/{projectId}/tasks/filter
요청 헤더의 x-flow-api-key 로 인증된 사용자를 기준으로 선택한 프로젝트의 업무 필터 목록 을 조회합니다.
Path Parameter 에 projectId 를 입력하고, 필요하면 cursor, pageSize, searchWord, upTaskId, mode, treeModeYn Query Parameter를 함께 입력합니다.
filterRecords 는 업무 컬럼 필터 조건 배열을 JSON 문자열로 입력합니다. 조건이 없으면 생략하거나 [] 로 보냅니다.
각 필터 객체는 COLUMN_SRNO, OPERATOR_TYPE, FILTER_DATA 로 구성합니다. COLUMN_SRNO 는 필터링할 업무 컬럼 ID이고, OPERATOR_TYPE 은 필터 연산자, FILTER_DATA 는 연산자에 전달할 값입니다.
예를 들어 상태 컬럼을 여러 값으로 필터링하려면 [{"COLUMN_SRNO":"12","OPERATOR_TYPE":"IN","FILTER_DATA":"19171,19172"}] 형태로 만들고, Query String에는 URL encode해서 전달합니다.
별도의 userId Query Parameter는 입력하지 않습니다. 서버가 인증된 사용자 ID를 사용합니다.
// filterRecords 작성 예시
{
"noFilter": [],
"statusFilter": [
{
"COLUMN_SRNO": "12",
"OPERATOR_TYPE": "IN",
"FILTER_DATA": "19171,19172"
}
],
"queryString": "filterRecords=%5B%7B%22COLUMN_SRNO%22%3A%2212%22%2C%22OPERATOR_TYPE%22%3A%22IN%22%2C%22FILTER_DATA%22%3A%2219171%2C19172%22%7D%5D"
}
다른 오류 케이스는 Error 탭에서 확인 가능합니다.
API 요청에 대한 예시 코드 는 Code Snippet 탭에서 확인 가능합니다.
Test 탭에서 API 요청을 테스트 해볼 수 있습니다.

#### [요청]
> Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
헤더 파라미터
매개변수 유형 예시 설명
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string dd9dcb4c-1f79-4eb8-9522-940fdefe6c1e 키관리 페이지에서 발급받은 사용자 API Key
패스 파라미터
매개변수 유형 예시 설명
projectId* string 317938 프로젝트 ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
쿼리 파라미터
매개변수 유형 예시 설명
cursor string 0 0-based 페이지 커서
Constraints
accept: 0 이상의 숫자
pageSize string 50 페이지 크기
Constraints
accept: 1 이상 100 이하의 숫자
default: 50
searchWord string 응대 업무 검색어
Constraints
max-length: 1000
upTaskId string 321292 상위 업무 ID
Constraints
accept: 숫자
mode string TREE 조회 모드
Constraints
max-length: 100
treeModeYn string Y 트리 모드 여부
Constraints
accept: Y, N
filterRecords string [
{
"COLUMN_SRNO": "12",
"OPERATOR_TYPE": "IN",
"FILTER_DATA": "19171,19172"
}
] 업무 컬럼 필터 조건 JSON object array 문자열. 객체는 COLUMN_SRNO, OPERATOR_TYPE, FILTER_DATA로 구성합니다.
Constraints
accept: JSON object array string
item.COLUMN_SRNO: 필터링할 업무 컬럼 ID
item.OPERATOR_TYPE: 필터 연산자. 예: IN
item.FILTER_DATA: 필터 값. 여러 값은 콤마로 구분

#### [응답]
> Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 오류 를 참고해주세요.
응답 본문
매개변수 유형 예시 설명
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - 업무 필터 조회 데이터
매개변수 유형 예시 설명
hasNext* boolean false 다음 페이지 존재 여부
lastCursor* number -1 다음 페이지 요청에 사용할 커서, 없으면 -1
mode* string TREE 응답 모드
tasks* array - 업무 목록
매개변수 유형 예시 설명
taskId* string 321292 업무 ID
orderNumber* string 1 정렬 번호
upTaskId* string -1 상위 업무 ID
subTaskCount* string 0 하위 업무 수
postId* string 40002 게시글 ID
projectId* string 317938 프로젝트 ID
projectTitle* string 고객 문의 프로젝트 프로젝트 제목
sectionId* string 100 섹션 ID
editAuthType* string ALL 수정 권한 타입
managerYn* string Y 관리자 여부
content* string 1차 응대 업무 업무 내용
upTaskName string 상위 업무명
directlyFilteredYn* string Y 직접 필터링 여부
hasFilteredSubtaskYn* string N 필터링된 하위 업무 존재 여부
backgroundColor string #FFFFFF 배경 색상
connectUrl string 연결 URL
postViewAuthYn* string Y 게시글 조회 권한 여부
columns* array - 업무 컬럼 목록
groupAggregates* array - 그룹 집계 원본 목록
error object - API 응답 오류
매개변수 유형 예시 설명
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
응답 본문 예시
// json (요청성공)
{
"response": {
"success": true,
"code": 200,
"message": "success",
"data": {
"hasNext": false,
"lastCursor": -1,
"mode": "TREE",
"tasks": [
{
"taskId": "321292",
"orderNumber": "1",
"upTaskId": "-1",
"subTaskCount": "0",
"postId": "40002",
"projectId": "317938",
"projectTitle": "고객 문의 프로젝트",
"sectionId": "100",
"editAuthType": "ALL",
"managerYn": "Y",
"content": "1차 응대 업무",
"upTaskName": "",
"directlyFilteredYn": "Y",
"hasFilteredSubtaskYn": "N",
"backgroundColor": "#FFFFFF",
"connectUrl": "",
"postViewAuthYn": "Y",
"columns": []
}
],
"groupAggregates": []
}
}
}
// json (요청실패)
{
"response": {
"success": false,
"code": 401,
"message": "error",
"error": {
"code": "UNAUTHORIZED_ERROR",
"message": "API Key 정보가 올바르지 않습니다."
}
}
}

### POST /user/posts/projects/{projectId} 게시글 작성

#### [메타데이터]
POST /user/posts/projects/{projectId}
요청 헤더의 x-flow-api-key 로 인증된 사용자를 작성자로 사용해 선택한 프로젝트에 게시글 을 등록합니다.
Path Parameter 에 projectId, Body 에 필수값 title, contents 와 선택값 files, imageFiles, viewPermission, botId 를 입력해서 이용할 수 있습니다.
별도의 registerId 는 입력하지 않습니다. 서버가 인증된 사용자 ID를 사용합니다.
다른 오류 케이스는 Error 탭에서 확인 가능합니다.
API 요청에 대한 예시 코드 는 Code Snippet 탭에서 확인 가능합니다.
지원 언어(curl, JS, Java, Python)
Test 탭에서 API 요청을 테스트 해볼 수 있습니다.
<projectId 확인 하는 방법>
프로젝트 상단 '점 세개 버튼'을 누르면 프로젝트 번호(projectId)를 확인할 수 있습니다.

#### [요청]
> Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
헤더 파라미터
매개변수 유형 예시 설명
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string dd9dcb4c-1f79-4eb8-9522-940fdefe6c1e 키관리 페이지에서 발급받은 API Key
패스 파라미터
매개변수 유형 예시 설명
projectId* string 940907 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
요청 본문
매개변수 유형 예시 설명
title* string 모니터링 알림 게시글 제목
Constraints
min-length: 1
max-length: 200
contents* string 모니터링 알림이 도착했습니다. 확인해주세요. 게시글 본문
Constraints
min-length: 1
max-length: 10000
files array - 첨부파일 정보
매개변수 유형 예시 설명
fileName* string file.txt 파일명
Constraints
refuse: 특수문자(\, /, :, *, ?, ", <, >, |)
min-length: 1
max-length: 100
fileContents* string iVBOAA ... YAAAKka 첨부 파일
Constraints
format: base64
min-length: 1
imageFiles array - 이미지 정보
매개변수 유형 예시 설명
fileName* string file.txt 이미지 파일명
Constraints
refuse: 특수문자(\, /, :, *, ?, ", <, >, |)
min-length: 1
max-length: 100
fileContents* string iVBOAA ... YAAAKka 이미지 파일
Constraints
format: base64
min-length: 1
viewPermission string all 조회권한
Constraints
default: all
format: all | admin
요청 본문 예시
// json
{
"title": "모니터링 알림",
"contents": "모니터링 알림이 도착했습니다. 확인해주세요."
}

#### [응답]
> Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 오류 를 참고해주세요.
응답 본문
매개변수 유형 예시 설명
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
매개변수 유형 예시 설명
projectId* string 940907 프로젝트ID
postId* string 960702 게시글ID
tinyUrl* string https://flow.team/l/a12412asd 링크주소
error object - API 응답 오류
매개변수 유형 예시 설명
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
응답 본문 예시
// json (요청성공)
{
"response": {
"success": true,
"code": 200,
"message": "success",
"data": {
"projectId": "940907",
"postId": "960702",
"tinyUrl": "https://flow.team/l/a12412asd"
}
}
}
// json (요청실패)
{
"response": {
"success": false,
"code": 401,
"message": "error",
"error": {
"code": "UNAUTHORIZED_ERROR",
"message": "API Key 정보가 올바르지 않습니다."
}
}
}

### POST /user/posts/projects/{projectId}/tasks 업무 작성

#### [메타데이터]
POST /user/posts/projects/{projectId}/tasks
요청 헤더의 x-flow-api-key 로 인증된 사용자를 작성자로 사용해 선택한 프로젝트에 업무 를 등록합니다.
Path Parameter 에 projectId, Body 에 업무 생성 정보를 입력해서 이용할 수 있습니다.
별도의 registerId 는 입력하지 않습니다. 서버가 인증된 사용자 ID를 사용합니다.
다른 오류 케이스는 Error 탭에서 확인 가능합니다.
API 요청에 대한 예시 코드 는 Code Snippet 탭에서 확인 가능합니다.
지원 언어(curl, JS, Java, Python)
Test 탭에서 API 요청을 테스트 해볼 수 있습니다.
<projectId 확인 하는 방법>
프로젝트 상단 '점 세개 버튼'을 누르면 프로젝트 번호(projectId)를 확인할 수 있습니다.

#### [요청]
> Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
헤더 파라미터
매개변수 유형 예시 설명
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string dd9dcb4c-1f79-4eb8-9522-940fdefe6c1e 키관리 페이지에서 발급받은 API Key
패스 파라미터
매개변수 유형 예시 설명
projectId* string 940907 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
요청 본문
매개변수 유형 예시 설명
title* string 구매 요청서 게시글 제목
Constraints
min-length: 1
max-length: 200
contents* string 구매 요청서가 도착했습니다. 게시글 본문
Constraints
min-length: 1
max-length: 10000
status* string request 업무 상태
Constraints
format: request | progress | feedback | complete | hold
priority string nomal 우선순위
Constraints
format: low | normal | high | urgent
startDate string 20230808 시작일
Constraints
format: YYYYMMDD
length: 8
endDate string 20230815 종료일
Constraints
format: YYYYMMDD
length: 8
workers array - 담당자 정보
매개변수 유형 예시 설명
workerId* string tyler@company.name 담당자
Constraints
accept: 소문자, 숫자, 특수문자(-, _, @, .)
min-length: 1
max-length: 100
files array - 첨부파일 정보
매개변수 유형 예시 설명
fileName* string file.txt 파일명
Constraints
refuse: 특수문자(\, /, :, *, ?, ", <, >, |)
min-length: 1
max-length: 100
fileContents* string iVBOAA ... YAAAKka 첨부 파일
Constraints
format: base64
min-length: 1
imageFiles array - 이미지 정보
매개변수 유형 예시 설명
fileName* string file.txt 이미지 파일명
Constraints
refuse: 특수문자(\, /, :, *, ?, ", <, >, |)
min-length: 1
max-length: 100
fileContents* string iVBOAA ... YAAAKka 이미지 파일
Constraints
format: base64
min-length: 1
viewPermission string all 조회권한
Constraints
default: all
format: all | admin
요청 본문 예시
// json
{
"title": "구매 요청서",
"contents": "구매 요청서가 도착했습니다.",
"status": "request",
"priority": "high",
"workers": [
{
"workerId": "tyler@company.name"
}
]
}

#### [응답]
> Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 오류 를 참고해주세요.
응답 본문
매개변수 유형 예시 설명
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
매개변수 유형 예시 설명
projectId* string 940907 프로젝트ID
postId* string 960702 게시글ID
taskId* string 981029 업무ID
tinyUrl* string https://flow.team/l/a12412asd 링크주소
error object - API 응답 오류
매개변수 유형 예시 설명
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
응답 본문 예시
// json (요청성공)
{
"response": {
"success": true,
"code": 200,
"message": "success",
"data": {
"projectId": "940907",
"postId": "960702",
"taskId": "981029",
"tinyUrl": "https://flow.team/l/a12412asd"
}
}
}
// json (요청실패)
{
"response": {
"success": false,
"code": 401,
"message": "error",
"error": {
"code": "UNAUTHORIZED_ERROR",
"message": "API Key 정보가 올바르지 않습니다."
}
}
}

### PATCH /user/posts/projects/{projectId}/tasks/{taskId}/status 업무 상태 수정

#### [메타데이터]
PATCH /user/posts/projects/{projectId}/tasks/{taskId}/status
요청 헤더의 x-flow-api-key 로 인증된 사용자를 기준으로 선택한 업무 상태 를 수정합니다.
Path Parameter 에 projectId, taskId, Body 에 status 또는 optionSrno 중 하나를 입력해서 이용할 수 있습니다.
별도의 registerId 는 입력하지 않습니다. 서버가 인증된 사용자 ID를 사용합니다.
다른 오류 케이스는 Error 탭에서 확인 가능합니다.
API 요청에 대한 예시 코드 는 Code Snippet 탭에서 확인 가능합니다. 지원 언어(curl, JS, Java, Python)
Test 탭에서 API 요청을 테스트 해볼 수 있습니다.
<projectId 확인 하는 방법>
프로젝트 좌측 상단의 '더보기 버튼'을 클릭하고 메뉴 상단에서 업무 번호(projectId)를 확인할 수 있습니다.
<taskId 확인 하는 방법>
게시물 우측 상단의 '더보기 버튼'을 클릭하고 메뉴에서 '연동 코드 복사'를 통해 업무 번호(taskId)를 확인할 수 있습니다.
연동 코드 복사 활성화는 의견 보내기를 통해서 문의해주세요.
<optionSrno 확인 하는 방법>
GET /v1/projects/{projectId}/columns/status API로 같은 프로젝트의 상태 컬럼 옵션 목록을 먼저 조회하면 됩니다.

#### [요청]
> Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
헤더 파라미터
매개변수 유형 예시 설명
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string dd9dcb4c-1f79-4eb8-9522-940fdefe6c1e 키관리 페이지에서 발급받은 API Key
패스 파라미터
매개변수 유형 예시 설명
projectId* string 317536 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
taskId* string 318014 업무ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
요청 본문
매개변수 유형 예시 설명
status string progress legacy 업무 상태
Constraints
format: request | progress | feedback | complete | hold
rule: optionSrno 와 동시에 보낼 수 없음
optionSrno string 18307 업무 2.0 상태 옵션 일련번호
Constraints
accept: 숫자
min-length: 1
max-length: 15
rule: status 와 동시에 보낼 수 없고 같은 프로젝트 상태 컬럼 옵션값이어야 함
요청 본문 예시
// json
{
"optionSrno": "18307"
}

#### [응답]
> Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 오류 를 참고해주세요.
응답 본문
매개변수 유형 예시 설명
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
error object - API 응답 오류
매개변수 유형 예시 설명
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
응답 본문 예시
// json (요청성공)
{
"response": {
"success": true,
"code": 200,
"message": "success"
}
}
// json (요청실패)
{
"response": {
"success": false,
"code": 400,
"message": "error",
"error": {
"code": "VALIDATION_ERROR",
"message": "동일한 업무 상태로 변경할 수 없습니다."
}
}
}

### PATCH /user/posts/projects/{projectId}/tasks/{taskId}/start-date 업무 시작일 수정

#### [메타데이터]
PATCH /user/posts/projects/{projectId}/tasks/{taskId}/start-date
요청 헤더의 x-flow-api-key 로 인증된 사용자를 기준으로 선택한 업무 시작일 을 수정합니다.
Path Parameter 에 projectId, taskId, Body 에 startDate 를 입력해서 이용할 수 있습니다.
별도의 registerId 는 입력하지 않습니다. 서버가 인증된 사용자 ID를 사용합니다.
다른 오류 케이스는 Error 탭에서 확인 가능합니다.
API 요청에 대한 예시 코드 는 Code Snippet 탭에서 확인 가능합니다.
지원 언어(curl, JS, Java, Python)
Test 탭에서 API 요청을 테스트 해볼 수 있습니다.
<projectId 확인 하는 방법>
프로젝트 좌측 상단의 '더보기 버튼'을 클릭하고 메뉴 상단에서 업무 번호(projectId)를 확인할 수 있습니다.
<taskId 확인 하는 방법>
게시물 우측 상단의 '더보기 버튼'을 클릭하고 메뉴에서 '연동 코드 복사'를 통해 업무 번호(taskId)를 확인할 수 있습니다.
연동 코드 복사 활성화는 의견 보내기를 통해서 문의해주세요.

#### [요청]
> Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
헤더 파라미터
매개변수 유형 예시 설명
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string dd9dcb4c-1f79-4eb8-9522-940fdefe6c1e 키관리 페이지에서 발급받은 API Key
패스 파라미터
매개변수 유형 예시 설명
projectId* string 940907 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
taskId* string 10923 업무ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
요청 본문
매개변수 유형 예시 설명
startDate string 20250101 시작일
Constraints
format: YYYYMMDD
length: 8
요청 본문 예시
// json
{
"startDate": "20250101"
}

#### [응답]
> Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 오류 를 참고해주세요.
응답 본문
매개변수 유형 예시 설명
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
error object - API 응답 오류
매개변수 유형 예시 설명
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
응답 본문 예시
// json (요청성공)
{
"response": {
"success": true,
"code": 200,
"message": "success"
}
}
// json (요청실패)
{
"response": {
"success": false,
"code": 401,
"message": "error",
"error": {
"code": "UNAUTHORIZED_ERROR",
"message": "API Key 정보가 올바르지 않습니다."
}
}
}

### PATCH /user/posts/projects/{projectId}/tasks/{taskId}/end-date 업무 마감일 수정

#### [메타데이터]
PATCH /user/posts/projects/{projectId}/tasks/{taskId}/end-date
요청 헤더의 x-flow-api-key 로 인증된 사용자를 기준으로 선택한 업무 마감일 을 수정합니다.
Path Parameter 에 projectId, taskId, Body 에 endDate 를 입력해서 이용할 수 있습니다.
별도의 registerId 는 입력하지 않습니다. 서버가 인증된 사용자 ID를 사용합니다.
다른 오류 케이스는 Error 탭에서 확인 가능합니다.
API 요청에 대한 예시 코드 는 Code Snippet 탭에서 확인 가능합니다.
지원 언어(curl, JS, Java, Python)
Test 탭에서 API 요청을 테스트 해볼 수 있습니다.
<projectId 확인 하는 방법>
프로젝트 좌측 상단의 '더보기 버튼'을 클릭하고 메뉴 상단에서 업무 번호(projectId)를 확인할 수 있습니다.
<taskId 확인 하는 방법>
게시물 우측 상단의 '더보기 버튼'을 클릭하고 메뉴에서 '연동 코드 복사'를 통해 업무 번호(taskId)를 확인할 수 있습니다.
연동 코드 복사 활성화는 의견 보내기를 통해서 문의해주세요.

#### [요청]
> Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
헤더 파라미터
매개변수 유형 예시 설명
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string dd9dcb4c-1f79-4eb8-9522-940fdefe6c1e 키관리 페이지에서 발급받은 API Key
패스 파라미터
매개변수 유형 예시 설명
projectId* string 940907 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
taskId* string 10923 업무ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
요청 본문
매개변수 유형 예시 설명
endDate string 20250101 마감일
Constraints
format: YYYYMMDD
length: 8
요청 본문 예시
// json
{
"endDate": "20250101"
}

#### [응답]
> Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 오류 를 참고해주세요.
응답 본문
매개변수 유형 예시 설명
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
error object - API 응답 오류
매개변수 유형 예시 설명
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
응답 본문 예시
// json (요청성공)
{
"response": {
"success": true,
"code": 200,
"message": "success"
}
}
// json (요청실패)
{
"response": {
"success": false,
"code": 401,
"message": "error",
"error": {
"code": "UNAUTHORIZED_ERROR",
"message": "API Key 정보가 올바르지 않습니다."
}
}
}

### PATCH /user/posts/projects/{projectId}/tasks/{taskId}/priority 업무 우선순위 수정

#### [메타데이터]
PATCH /user/posts/projects/{projectId}/tasks/{taskId}/priority
요청 헤더의 x-flow-api-key 로 인증된 사용자를 기준으로 선택한 업무 우선순위 를 수정합니다.
Path Parameter 에 projectId, taskId, Body 에 priority 를 입력해서 이용할 수 있습니다.
별도의 registerId 는 입력하지 않습니다. 서버가 인증된 사용자 ID를 사용합니다.
다른 오류 케이스는 Error 탭에서 확인 가능합니다.
API 요청에 대한 예시 코드 는 Code Snippet 탭에서 확인 가능합니다.
지원 언어(curl, JS, Java, Python)
Test 탭에서 API 요청을 테스트 해볼 수 있습니다.
<projectId 확인 하는 방법>
프로젝트 좌측 상단의 '더보기 버튼'을 클릭하고 메뉴 상단에서 업무 번호(projectId)를 확인할 수 있습니다.
<taskId 확인 하는 방법>
게시물 우측 상단의 '더보기 버튼'을 클릭하고 메뉴에서 '연동 코드 복사'를 통해 업무 번호(taskId)를 확인할 수 있습니다.
연동 코드 복사 활성화는 의견 보내기를 통해서 문의해주세요.

#### [요청]
> Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
헤더 파라미터
매개변수 유형 예시 설명
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string dd9dcb4c-1f79-4eb8-9522-940fdefe6c1e 키관리 페이지에서 발급받은 API Key
패스 파라미터
매개변수 유형 예시 설명
projectId* string 940907 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
taskId* string 10923 업무ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
요청 본문
매개변수 유형 예시 설명
priority string nomal 우선순위
Constraints
format: low | normal | high | urgent
요청 본문 예시
// json
{
"priority": "normal"
}

#### [응답]
> Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 오류 를 참고해주세요.
응답 본문
매개변수 유형 예시 설명
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
error object - API 응답 오류
매개변수 유형 예시 설명
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
응답 본문 예시
// json (요청성공)
{
"response": {
"success": true,
"code": 200,
"message": "success"
}
}
// json (요청실패)
{
"response": {
"success": false,
"code": 401,
"message": "error",
"error": {
"code": "UNAUTHORIZED_ERROR",
"message": "API Key 정보가 올바르지 않습니다."
}
}
}

### PATCH /user/posts/projects/{projectId}/tasks/{taskId}/worker 업무 담당자 수정

#### [메타데이터]
PATCH /user/posts/projects/{projectId}/tasks/{taskId}/worker
요청 헤더의 x-flow-api-key 로 인증된 사용자를 기준으로 선택한 업무 담당자 를 수정합니다.
Path Parameter 에 projectId, taskId, Body 에 workers 를 입력해서 이용할 수 있습니다.
별도의 registerId 는 입력하지 않습니다. 서버가 인증된 사용자 ID를 사용합니다.
다른 오류 케이스는 Error 탭에서 확인 가능합니다.
API 요청에 대한 예시 코드 는 Code Snippet 탭에서 확인 가능합니다.
지원 언어(curl, JS, Java, Python)
Test 탭에서 API 요청을 테스트 해볼 수 있습니다.
<projectId 확인 하는 방법>
프로젝트 좌측 상단의 '더보기 버튼'을 클릭하고 메뉴 상단에서 업무 번호(projectId)를 확인할 수 있습니다.
<taskId 확인 하는 방법>
게시물 우측 상단의 '더보기 버튼'을 클릭하고 메뉴에서 '연동 코드 복사'를 통해 업무 번호(taskId)를 확인할 수 있습니다.
연동 코드 복사 활성화는 의견 보내기를 통해서 문의해주세요.

#### [요청]
> Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
헤더 파라미터
매개변수 유형 예시 설명
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string dd9dcb4c-1f79-4eb8-9522-940fdefe6c1e 키관리 페이지에서 발급받은 API Key
패스 파라미터
매개변수 유형 예시 설명
projectId* string 940907 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
taskId* string 10923 업무ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
요청 본문
매개변수 유형 예시 설명
workers array - 담당자 정보
매개변수 유형 예시 설명
workerId* string tyler@company.name 담당자
Constraints
accept: 소문자, 숫자, 특수문자(-, _, @, .)
min-length: 1
max-length: 100
요청 본문 예시
// json
{
"workers": [
{
"workerId": "tyler@company.name"
}
]
}

#### [응답]
> Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 오류 를 참고해주세요.
응답 본문
매개변수 유형 예시 설명
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
error object - API 응답 오류
매개변수 유형 예시 설명
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
응답 본문 예시
// json (요청성공)
{
"response": {
"success": true,
"code": 200,
"message": "success"
}
}
// json (요청실패)
{
"response": {
"success": false,
"code": 401,
"message": "error",
"error": {
"code": "UNAUTHORIZED_ERROR",
"message": "API Key 정보가 올바르지 않습니다."
}
}
}

### POST /user/posts/projects/{projectId}/tasks/{taskId}/subtasks 하위업무 생성

#### [메타데이터]
POST /user/posts/projects/{projectId}/tasks/{taskId}/subtasks
요청 헤더의 x-flow-api-key 로 인증된 사용자가 접근 가능한 업무에 하위업무 를 생성합니다.
Path Parameter 에 projectId, taskId, Body 에 필수값 title 을 입력해서 이용할 수 있습니다.
선택값 contents, status, priority, progress 를 함께 보낼 수 있습니다.
별도의 userId 또는 registerId 는 입력하지 않습니다. 서버가 인증된 사용자 ID를 사용합니다.
다른 오류 케이스는 Error 탭에서 확인 가능합니다.
status 는 request, progress, complete, hold, feedback 중 하나입니다.
priority 는 low, normal, high, urgent 중 하나입니다.
progress 는 0부터 100까지의 숫자 문자열입니다.

#### [요청]
> Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
헤더 파라미터
매개변수 유형 예시 설명
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string dd9dcb4c-1f79-4eb8-9522-940fdefe6c1e 키관리 페이지에서 발급받은 API Key
패스 파라미터
매개변수 유형 예시 설명
projectId* string 318821 프로젝트 ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
taskId* string 319001 상위 업무 ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
요청 본문
매개변수 유형 예시 설명
title* string API 문서 작성 하위업무 제목
contents string 클라이언트 docs를 작성합니다. 하위업무 내용
status string request 업무 상태
Constraints
format: request | progress | complete | hold | feedback
priority string normal 업무 우선순위
Constraints
format: low | normal | high | urgent
progress string 0 진척률
Constraints
range: 0-100
요청 본문 예시
// json
{
"title": "API 문서 작성",
"contents": "클라이언트 docs를 작성합니다.",
"status": "request",
"priority": "normal",
"progress": "0"
}

#### [응답]
> Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 오류 를 참고해주세요.
응답 본문
매개변수 유형 예시 설명
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
매개변수 유형 예시 설명
subtask* object - 생성된 하위업무
매개변수 유형 예시 설명
taskId* string 319100 생성된 하위업무 ID
postId string 319100 생성된 하위업무 게시글 ID
taskNumber string 1 하위업무 번호
orderNumber string 1 정렬 번호
parentTaskId* string 319001 상위 업무 ID
parentPostId string 319000 상위 업무 게시글 ID
projectId* string 318821 프로젝트 ID
title* string API 문서 작성 하위업무 제목
error object - API 응답 오류
매개변수 유형 예시 설명
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
응답 본문 예시
// json (요청성공)
{
"response": {
"success": true,
"code": 200,
"message": "success",
"data": {
"subtask": {
"taskId": "319100",
"postId": "319100",
"taskNumber": "1",
"orderNumber": "1",
"parentTaskId": "319001",
"parentPostId": "319000",
"projectId": "318821",
"title": "API 문서 작성"
}
}
}
}
// json (요청실패)
{
"response": {
"success": false,
"code": 401,
"message": "error",
"error": {
"code": "UNAUTHORIZED_ERROR",
"message": "API Key 정보가 올바르지 않습니다."
}
}
}

### POST /user/posts/projects/{projectId}/schedules 일정 작성

#### [메타데이터]
POST /user/posts/projects/{projectId}/schedules
요청 헤더의 x-flow-api-key 로 인증된 사용자를 작성자로 사용해 선택한 프로젝트에 일정 을 등록합니다.
Path Parameter 에 projectId, Body 에 일정 생성 정보를 입력해서 이용할 수 있습니다.
별도의 registerId 는 입력하지 않습니다. 서버가 인증된 사용자 ID를 사용합니다.
다른 오류 케이스는 Error 탭에서 확인 가능합니다.
API 요청에 대한 예시 코드 는 Code Snippet 탭에서 확인 가능합니다.
지원 언어(curl, JS, Java, Python)
Test 탭에서 API 요청을 테스트 해볼 수 있습니다.
<projectId 확인 하는 방법>
프로젝트 상단 '점 세개 버튼'을 누르면 프로젝트 번호(projectId)를 확인할 수 있습니다.

#### [요청]
> Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
헤더 파라미터
매개변수 유형 예시 설명
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string dd9dcb4c-1f79-4eb8-9522-940fdefe6c1e 키관리 페이지에서 발급받은 API Key
패스 파라미터
매개변수 유형 예시 설명
projectId* string 940907 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
요청 본문
매개변수 유형 예시 설명
title* string 일정 제목 예시 일정 제목
Constraints
min-length: 1
max-length: 200
memo string 메모 예시 메모
Constraints
min-length: 1
max-length: 4000
isAllDay* boolean true 종일일정 여부
Constraints
format: true | false
startDateTime* string 20230808160000 시작일시
Constraints
format: YYYYMMDDHHmmss
length: 14
endDateTime* string 20230815093000 종료일시
Constraints
format: YYYYMMDDHHmmss
length: 14
attendance array - 참석자 정보
매개변수 유형 예시 설명
attendanceId* string tyler@company.name 참석자
Constraints
accept: 소문자, 숫자, 특수문자(-, _, @, .)
min-length: 1
max-length: 100
viewPermission string all 조회권한
Constraints
default: all
format: all | admin
요청 본문 예시
// json
{
"title": "일정 제목 예시",
"isAllDay": true,
"startDateTime": "20230808160000",
"endDateTime": "20230815093000",
"attendance": [
{
"attendanceId": "tyler@company.name"
}
]
}

#### [응답]
> Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 오류 를 참고해주세요.
응답 본문
매개변수 유형 예시 설명
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
매개변수 유형 예시 설명
projectId* string 940907 프로젝트ID
postId* string 960702 게시글ID
tinyUrl* string https://flow.team/l/a12412asd 링크주소
error object - API 응답 오류
매개변수 유형 예시 설명
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
응답 본문 예시
// json (요청성공)
{
"response": {
"success": true,
"code": 200,
"message": "success",
"data": {
"projectId": "940907",
"postId": "960702",
"tinyUrl": "https://flow.team/l/a12412asd"
}
}
}
// json (요청실패)
{
"response": {
"success": false,
"code": 401,
"message": "error",
"error": {
"code": "UNAUTHORIZED_ERROR",
"message": "API Key 정보가 올바르지 않습니다."
}
}
}

### POST /user/posts/projects/{projectId}/todos 할일 작성

#### [메타데이터]
POST /user/posts/projects/{projectId}/todos
요청 헤더의 x-flow-api-key 로 인증된 사용자를 작성자로 사용해 선택한 프로젝트에 할일 을 등록합니다.
Path Parameter 에 projectId, Body 에 필수값 title, todoList 와 선택값 viewPermission 를 입력해서 이용할 수 있습니다.
별도의 registerId 는 입력하지 않습니다. 서버가 인증된 사용자 ID를 사용합니다.
다른 오류 케이스는 Error 탭에서 확인 가능합니다.
API 요청에 대한 예시 코드 는 Code Snippet 탭에서 확인 가능합니다.
지원 언어(curl, JS, Java, Python)
Test 탭에서 API 요청을 테스트 해볼 수 있습니다.
<projectId 확인 하는 방법>
프로젝트 상단 '점 세개 버튼'을 누르면 프로젝트 번호(projectId)를 확인할 수 있습니다.

#### [요청]
> Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
헤더 파라미터
매개변수 유형 예시 설명
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string dd9dcb4c-1f79-4eb8-9522-940fdefe6c1e 키관리 페이지에서 발급받은 API Key
패스 파라미터
매개변수 유형 예시 설명
projectId* string 940907 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
요청 본문
매개변수 유형 예시 설명
title* string 할일 제목 예시 할일 제목
Constraints
min-length: 1
max-length: 200
todoList* array - 할일 목록
Constraints
min-size: 1
max-size: 50
매개변수 유형 예시 설명
contents* string 주간 회의록 작성하기 내용
Constraints
min-length: 1
max-length: 60
endDate string 20240617 종료일
Constraints
format: YYYYMMDD
length: 8
viewPermission string all 조회권한
Constraints
default: all
format: all | admin
요청 본문 예시
// json
{
"title": "일정 제목 예시",
"todoList": [
{
"contents": "주간 보고서 작성하기",
"endDate": "20240620"
},
{
"contents": "월간 보고서 작성하기"
}
]
}

#### [응답]
> Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 오류 를 참고해주세요.
응답 본문
매개변수 유형 예시 설명
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
매개변수 유형 예시 설명
projectId* string 940907 프로젝트ID
postId* string 960702 게시글ID
tinyUrl* string https://flow.team/l/a12412asd 링크주소
error object - API 응답 오류
매개변수 유형 예시 설명
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
응답 본문 예시
// json (요청성공)
{
"response": {
"success": true,
"code": 200,
"message": "success",
"data": {
"projectId": "940907",
"postId": "960702",
"tinyUrl": "https://flow.team/l/a12412asd"
}
}
}
// json (요청실패)
{
"response": {
"success": false,
"code": 401,
"message": "error",
"error": {
"code": "UNAUTHORIZED_ERROR",
"message": "API Key 정보가 올바르지 않습니다."
}
}
}
