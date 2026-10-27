# 웹훅 (https://api.flow.team/docs/webhook)

기본 경로: https://api.flow.team

웹훅 Webhook 연동
현재 Webhook API는 베타 서비스 단계로 이후 서비스 정책 및 스펙에 변동이 있을 수 있습니다.

## 플로우 Webhook 연동가이드

이 문서에서는 플로우 Webhook 연동을 위한 2단계에 대하여 설명합니다. 연동 중 어려움이 있거나 오류가 발생했을 경우 의견 보내기로 문의해주세요.

### [Step.00] Bot 생성

플로우 Webhook 연동을 통해 게시글 작성, 채팅 메시지 전송을 위해서는 사전에 생성된 Bot 이 필요합니다.
이용기관의 Bot 은 개발자 포털 관리자 전용 페이지의 봇 관리에서 생성이 가능합니다. (이용기관의 관리자에게 요청해주세요.)

Tip. 생성된 Bot 의 프로필 이미지 및 이름 변경은 해당 Bot 계정으로 직접 플로우에 로그인 후 환경설정을 통해 변경이 가능합니다.

### [Step.01] Webhook 생성

플로우 Webhook 연동은 개발자 포털 관리자 전용 페이지의 웹훅 관리에서 Webhook Endpoint 를 생성해서 시작할 수 있습니다.
Webhook Endpoint 는 생성 개수 제한이 없으며 연동하고자하는 프로젝트, 채팅방에 따라서 혹은 동작마다 생성하여 활용할 수 있습니다.
신규 Webhook Endpoint 생성에는 다음의 값들이 필요합니다.

Tip. 한 번 생성된 Webhook Endpoint 는 수정 불가며, 대상이 되는 프로젝트, 채팅방의 변경 필요시 삭제 후 새롭게 생성해야 합니다.

필수값 여부 | 이름 | 설명 | 예시
필수 Name Webhook 을 구분하기위한 별명 Test Webhook
선택 Token Webhook Secret Token (자동생성, 외부서비스에서 제공하는 경우에만 입력) 831ba0b75c117********34e8bd
필수 Bot 채팅 메시지, 게시글 작성자에 해당하는 봇 계정 (생성한 봇 중 선택) Test Bot
필수 Action 채팅, 글, 업무, 일정 중에서 선택 채팅
필수 Target ID 채팅 메시지의 경우 채팅방ID, 글/업무/일정의 경우 프로젝트ID ABC

채팅방 연동코드: 채팅방 우측상단 더보기 메뉴 > 우측하단 채팅방 설정 > 최하단 '연동 코드 복사' 아이콘 클릭
프로젝트 연동코드: 프로젝트 상단 프로젝트명 왼쪽 더보기 메뉴 > '연동 코드 복사' 메뉴 클릭

Tip. 연동 코드는 ID 값과는 상이하니 반드시 연동 코드(알파벳, 숫자로 구성)를 복사하여 사용해야합니다.

### [Step.02] Webhook URL 등록(외부 서비스에 연동)

Webhook Endpoint 가 정상적으로 생성되었다면 웹훅 관리 페이지의 목록에 표시됩니다.
등록된 Webhook Endpoint 는 각 엔드포인트 카드 상단의 Action, Target ID 나 생성시 입력한 Name 으로 구분이 가능합니다.

일반적으로 외부 서비스에 웹훅을 연동하려면 다음의 값들이 필요합니다(연동 코드 복사 활성화는 의견 보내기로 문의).

Webhook URL: 엔드포인트 카드의 우측 상단 더보기 메뉴 내의 'Copy URL' 를 클릭
Token: 엔드포인트 카드의 '******' 로 가려진 Token 값 부분을 클릭

Tip. 외부 서비스에서 Token 값을 직접 제공하는 경우 Webhook Endpoint 생성시에 이미 입력했기 때문에 따로 복사해둘 필요가 없습니다.

복사된 Webhook URL 은 다음과 같은 형태이며 {service} 부분을 연동하고자 하는 서비스가 현재 플로우 Webhook 에서 지원할 경우 지정된 값으로 변경이 필요합니다.
플로우 Webhook 에서 지원하는 외부 서비스 목록과 서비스 코드는 하단의 'Webhook 지원 서비스' 섹션을 참고 부탁드립니다.

# webhook url example
https://api.flow.team/webhook/{hookId}/{service}

# webhook url example (default or unknown)
https://api.flow.team/webhook/{hookId}/service

# webhook url example (github)
https://api.flow.team/webhook/{hookId}/github

커스텀 웹훅 혹은 지원하지 않는 서비스로부터의 웹훅을 직접 연동하고자 하시는 경우 요청 헤더의 'x-flow-webhook-token' 에 'Token' 값을 포함해야 합니다.

Tip. 아직 지원하지 않는 서비스나 이벤트의 경우 Unknown 서비스로 분류되어 JSON 형식의 요청 데이터가 그대로 채팅 또는 게시글 본문에 출력됩니다.
다만 요청 데이터에 text 라는 이름의 필드가 존재할 경우 해당 필드의 값만 채팅 또는 게시글 본문에 출력됩니다.

{
"title": "title",
"text": "Webhook Test Message"
}

### [추가정보] Webhook 지원 서비스
Webhook 최신 업데이트: 2025-03-26

서비스 | 경로 | 지원 이벤트
GitHub /github push, pull_request, issues, issue_comment, release
GitLab /gitlab push, merge_request, issue, note
Bitbucket /bitbucket repo:push, pullrequest:created
Jenkins /jenkins 빌드 완료 알림
커스텀 /service title, text 필드 지원
