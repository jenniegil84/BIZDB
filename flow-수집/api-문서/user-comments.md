# User Comments (https://api.flow.team/docs/api/user/comments)

기본 경로: https://api.flow.team

### GET /user/comments/{postId} 게시글 댓글 조회

#### [메타데이터]
GET /user/comments/{postId}
요청 헤더의 x-flow-api-key 로 인증된 사용자를 기준으로 게시글 댓글 목록 을 조회합니다.
Path Parameter 에 postId 를 입력해서 이용할 수 있습니다.
댓글 조회 권한은 게시글 단건 조회 권한과 동일합니다. 인증된 사용자가 볼 수 없는 게시글의 댓글은 조회할 수 없습니다.
선택값 cursor, size 로 페이징을 제어할 수 있습니다. size 기본값은 100이며 1 이상 100 이하입니다.
선택값 replyYn 은 Y 또는 N이며 기본값은 N입니다. Y이면 각 댓글의 replies 에 대댓글을 최대 10개까지 반환합니다.
댓글별 replyHasNext 는 반환된 10개 이후의 대댓글 존재 여부입니다. 최상위 hasNext 는 다음 부모 댓글 페이지 존재 여부입니다.
replyYn 이 생략되거나 N이면 기존 응답과 동일하게 replies, replyHasNext 필드를 반환하지 않습니다. 페이징은 항상 부모 댓글을 기준으로 합니다.
별도의 userId 는 입력하지 않습니다. 서버가 인증된 사용자 ID를 사용합니다.
다른 오류 케이스는 Error 탭에서 확인 가능합니다.
API 요청에 대한 예시 코드 는 Code Snippet 탭에서 확인 가능합니다.
지원 언어(curl, JS, Java, Python)
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
쿼리 파라미터
매개변수 유형 예시 설명
cursor string 0 페이징 커서
Constraints
accept: 0 이상의 숫자
size string 100 조회 개수
Constraints
min: 1
max: 100
replyYn string Y 대댓글 포함 여부
Constraints
accept: Y, N
default: N

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
hasNext* boolean false 다음 페이지 존재 여부
lastCursor* number 0 다음 조회에 사용할 마지막 커서
comments* array - 댓글 목록
매개변수 유형 예시 설명
projectId* string 23277 프로젝트 ID
postId* string 40001 게시글 ID
commentId* string 90001 댓글 ID
contents* string 확인했습니다. 댓글 내용
registerId* string flow@flow.team 댓글 작성자 ID
registerName string 홍길동 댓글 작성자 이름
registeredDateTime* string 20260630153000 댓글 등록 일시
editedDateTime string 20260630153000 댓글 수정 일시
systemCode string 시스템 댓글 코드
replies array - 대댓글 목록(replyYn=Y인 경우에만 최대 10개 제공)
매개변수 유형 예시 설명
projectId* string 23277 프로젝트 ID
postId* string 40001 게시글 ID
replyId* string 91001 대댓글 ID
parentCommentId* string 90001 부모 댓글 ID
contents string 확인했습니다. 대댓글 내용
registerId* string reply@flow.team 대댓글 작성자 ID
registerInttId* string UTLZ_001 대댓글 작성자 이용기관 ID
registerName string 김플로우 대댓글 작성자 이름
registeredDateTime* string 20260730160000 대댓글 등록 일시
editedDateTime string 20260730163000 대댓글 수정 일시
encrypted string Y 대댓글 암호화 여부
systemCode string 시스템 대댓글 코드
language string ko 대댓글 언어
replyHasNext boolean false 반환되지 않은 후속 대댓글 존재 여부(replyYn=Y인 경우에만 제공)
error object - API 응답 오류
매개변수 유형 예시 설명
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
응답 본문 예시
// json (요청성공)
{
"response": {
"success": true,
"message": "success",
"data": {
"hasNext": false,
"lastCursor": 0,
"comments": [
{
"projectId": "23277",
"postId": "40001",
"commentId": "90001",
"contents": "확인했습니다.",
"registerId": "flow@flow.team",
"registerInttId": "UTLZ_001",
"registerName": "홍길동",
"registerCorpName": "플로우",
"registerDivisionName": "개발팀",
"registeredDateTime": "20260630153000",
"editedDateTime": "20260630153000",
"objectContentsName": "web",
"encrypted": "Y",
"editorId": "flow@flow.team",
"editorName": "홍길동",
"systemCode": "",
"repeatDateTime": "",
"repeatId": "",
"registerProfilePhoto": "",
"language": "ko",
"replies": [
{
"projectId": "23277",
"postId": "40001",
"replyId": "91001",
"parentCommentId": "90001",
"contents": "확인했습니다.",
"registerId": "reply@flow.team",
"registerInttId": "UTLZ_001",
"registerName": "김플로우",
"registeredDateTime": "20260730160000",
"editedDateTime": "20260730163000",
"encrypted": "Y",
"systemCode": "",
"language": "ko"
}
],
"replyHasNext": false
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

### POST /user/comments/{postId} 게시글 댓글 작성

#### [메타데이터]
POST /user/comments/{postId}
요청 헤더의 x-flow-api-key 로 인증된 사용자를 작성자로 사용해 게시글 댓글 을 등록합니다.
Path Parameter 에 postId, Body 에 필수값 contents 를 입력해서 이용할 수 있습니다.
댓글 생성 권한은 게시글 접근 권한을 먼저 확인한 뒤 플로우 댓글 생성 정책을 따릅니다.
별도의 userId 는 입력하지 않습니다. 서버가 인증된 사용자 ID를 사용합니다.
다른 오류 케이스는 Error 탭에서 확인 가능합니다.
API 요청에 대한 예시 코드 는 Code Snippet 탭에서 확인 가능합니다.
지원 언어(curl, JS, Java, Python)
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
요청 본문
매개변수 유형 예시 설명
contents* string 확인했습니다. 댓글 내용
Constraints
min-length: 1
max-length: 10000
요청 본문 예시
// json
{
"contents": "확인했습니다."
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
projectId* string 23277 프로젝트 ID
postId* string 40001 게시글 ID
commentId* string 90002 생성된 댓글 ID
error object - API 응답 오류
매개변수 유형 예시 설명
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
응답 본문 예시
// json (요청성공)
{
"response": {
"success": true,
"message": "success",
"data": {
"projectId": "23277",
"postId": "40001",
"commentId": "90002"
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

### GET /user/comments/{postId}/replies/{commentId} 대댓글 조회

#### [메타데이터]
GET /user/comments/{postId}/replies/{commentId}
요청 헤더의 x-flow-api-key 로 인증된 사용자를 기준으로 댓글의 대댓글 목록 을 조회합니다.
Path Parameter 에 부모 댓글이 속한 postId 와 commentId 를 입력해서 이용할 수 있습니다.
일반 댓글 조회 API에서 replyYn=Y 를 지정하면 댓글별 대댓글을 최대 10개까지 제공합니다. 대댓글이 많은 댓글의 전체 대댓글 정보가 필요하거나 replyHasNext=true 인 경우 이 API를 페이지네이션하여 호출하세요.
대댓글 조회 권한은 부모 댓글이 속한 게시글 단건 조회 권한과 동일합니다.
선택값 cursor, size 로 페이징을 제어할 수 있습니다. cursor 기본값은 0, size 기본값은 100이며 1 이상 100 이하입니다.
대댓글은 replyId 오름차순으로 반환됩니다. hasNext 가 true이면 lastCursor 를 다음 요청의 cursor 로 사용합니다.
별도의 userId 는 입력하지 않습니다. 서버가 인증된 사용자 ID를 사용합니다.
다른 오류 케이스는 Error 탭에서 확인 가능합니다.
API 요청에 대한 예시 코드 는 Code Snippet 탭에서 확인 가능합니다.
지원 언어(curl, JS, Java, Python)
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
commentId* string 90001 부모 댓글 ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
쿼리 파라미터
매개변수 유형 예시 설명
cursor string 0 조회 시작 위치
Constraints
accept: 0 이상의 숫자
default: 0
size string 100 조회 개수
Constraints
accept: 1 이상 100 이하의 숫자
default: 100

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
hasNext* boolean false 다음 페이지 존재 여부
lastCursor* number 0 다음 요청에 사용할 cursor
replies* array - 대댓글 목록
매개변수 유형 예시 설명
projectId* string 23277 프로젝트 ID
postId* string 40001 게시글 ID
replyId* string 91001 대댓글 ID
parentCommentId* string 90001 부모 댓글 ID
contents string 확인했습니다. 대댓글 내용
registerId* string reply@flow.team 대댓글 작성자 ID
registerInttId* string UTLZ_001 대댓글 작성자 이용기관 ID
registerName string 김플로우 대댓글 작성자 이름
registeredDateTime* string 20260730160000 대댓글 등록 일시
editedDateTime string 20260730163000 대댓글 수정 일시
encrypted string Y 대댓글 암호화 여부
systemCode string 시스템 대댓글 코드
language string ko 대댓글 언어
error object - API 응답 오류
매개변수 유형 예시 설명
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
응답 본문 예시
// json (요청성공)
{
"response": {
"success": true,
"message": "success",
"data": {
"hasNext": false,
"lastCursor": 0,
"replies": [
{
"projectId": "23277",
"postId": "40001",
"replyId": "91001",
"parentCommentId": "90001",
"contents": "확인했습니다.",
"registerId": "reply@flow.team",
"registerInttId": "UTLZ_001",
"registerName": "김플로우",
"registeredDateTime": "20260730160000",
"editedDateTime": "20260730163000",
"encrypted": "Y",
"systemCode": "",
"language": "ko"
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
