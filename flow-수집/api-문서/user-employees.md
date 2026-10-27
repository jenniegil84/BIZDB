# User Employees (https://api.flow.team/docs/api/user/employees)

기본 경로: https://api.flow.team

### GET /user/employees 구성원 목록 조회

#### [메타데이터]
GET /user/employees
요청 헤더의 x-flow-api-key 로 인증된 사용자의 이용기관 기준으로 구성원 목록 을 조회합니다.
선택값 cursor 로 페이징을 제어할 수 있습니다. 최초 조회 시 입력하지 않거나 0 을 입력합니다.
한번에 최대 100개의 구성원 정보를 조회합니다.
응답의 hasNext 가 true 이면 lastCursor 값을 다음 요청의 cursor 로 사용할 수 있습니다.
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
x-flow-api-key* string dd9dcb4c-1f79-4eb8-9522-940fdefe6c1e 키관리 페이지에서 발급받은 API Key
쿼리 파라미터
매개변수 유형 예시 설명
cursor string 0 페이징 커서 (page size: 100)
Constraints
accept: 숫자
default: 0

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
hasNext* boolean true 다음 정보 여부
lastCursor* number 100 마지막 커서 정보
employees* array - 사용자(구성원) 정보
매개변수 유형 예시 설명
inttId* string BFLOW_000000001234 이용기관ID
userId* string flow@flow.team 사용자(구성원)ID
fullname* string 플로키 사용자(구성원) 이름
divisionId* string 1 부서코드 (삭제예정)
divisionCode* string 1 부서코드
divisionName* string 개발팀 부서명
responsibility* string 팀장 직책
cellPhoneNumber* string 01000000000 휴대폰 번호
companyPhoneNumber* string 01000000000 회사 전화번호
email* string company@company.com 이메일
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
"hasNext": true,
"lastCursor": 3,
"employees": [
{
"inttId": "BFLOW_000000001234",
"userId": "flow1@flow.team",
"fullname": "플로키1",
"divisionId": "1",
"divisionName": "개발팀",
"responsibility": "팀장",
"cellPhoneNumber": "01000000000",
"companyPhoneNumber": "01000000000",
"email": "company01@company.com"
},
{
"inttId": "BFLOW_000000001234",
"userId": "flow2@flow.team",
"fullname": "플로키2",
"divisionId": "1",
"divisionName": "개발팀",
"responsibility": "팀원",
"cellPhoneNumber": "01000000000",
"companyPhoneNumber": "01000000000",
"email": "company02@company.com"
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

### GET /user/employees/me 내 구성원 정보 조회

#### [메타데이터]
GET /user/employees/me
요청 헤더의 x-flow-api-key 로 인증된 사용자 본인의 구성원 정보 를 조회합니다.
별도의 userId 는 입력하지 않습니다. 서버가 인증된 사용자 ID를 사용합니다.
구성원 조회에 성공하면 본인의 구성원 상세 정보가 반환됩니다.
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
x-flow-api-key* string dd9dcb4c-1f79-4eb8-9522-940fdefe6c1e 키관리 페이지에서 발급받은 API Key

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
inttId* string BFLOW_000000001234 이용기관ID
userId* string flow@flow.team 사용자(구성원)ID
fullname* string 플로키 사용자(구성원) 이름
divisionId* string 1 부서코드 (삭제예정)
divisionCode* string 1 부서코드
divisionName* string 개발팀 부서명
responsibility* string 팀장 직책
cellPhoneNumber* string 01000000000 휴대폰 번호
companyPhoneNumber* string 01000000000 회사 전화번호
email* string company@company.com 이메일
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
"inttId": "BFLOW_000000001234",
"userId": "flow@flow.team",
"fullname": "플로키",
"divisionId": "1",
"divisionName": "개발팀",
"responsibility": "팀장",
"cellPhoneNumber": "01000000000",
"companyPhoneNumber": "01000000000",
"email": "company01@company.com"
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

### GET /user/employees/{userId} 구성원 단건 조회

#### [메타데이터]
GET /user/employees/{userId}
요청 헤더의 x-flow-api-key 로 인증된 사용자의 이용기관에 속한 특정 구성원 정보 를 조회합니다.
Path Parameter 의 userId 로 조회할 구성원을 지정합니다.
같은 이용기관에 속한 구성원만 조회할 수 있습니다.
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
x-flow-api-key* string dd9dcb4c-1f79-4eb8-9522-940fdefe6c1e 키관리 페이지에서 발급받은 API Key
패스 파라미터
매개변수 유형 예시 설명
userId* string flow@flow.team 사용자(구성원)ID
Constraints
accept: 알파벳, 숫자, 특수문자(-, _, @, .)
min-length: 1
max-length: 100

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
inttId* string BFLOW_000000001234 이용기관ID
userId* string flow@flow.team 사용자(구성원)ID
fullname* string 플로키 사용자(구성원) 이름
divisionId* string 1 부서코드 (삭제예정)
divisionCode* string 1 부서코드
divisionName* string 개발팀 부서명
responsibility* string 팀장 직책
cellPhoneNumber* string 01000000000 휴대폰 번호
companyPhoneNumber* string 01000000000 회사 전화번호
email* string company@company.com 이메일
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
"inttId": "BFLOW_000000001234",
"userId": "flow@flow.team",
"fullname": "플로키",
"divisionId": "1",
"divisionName": "개발팀",
"responsibility": "팀장",
"cellPhoneNumber": "01000000000",
"companyPhoneNumber": "01000000000",
"email": "company01@company.com"
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
