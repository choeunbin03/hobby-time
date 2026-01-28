#  Hobby-Time 서비스 흐름도

# 서비스 아키텍처 및 페이지 구조 (Flowchart)
flowchart TB
  %% PRD 기준: 프론트 + 인증 + 백엔드 + DB + AI 연동 구조
  %% 페이지 구조와 주요 기능 흐름을 함께 표현

  subgraph L0["사용자"]
    U1["사용자"]
  end

  subgraph L1["프론트엔드(웹)"]
    FE0["공통 레이아웃\n헤더 네비게이션"]
    FE1["홈\n클래스 탐색(목록, 필터, 정렬)"]
    FE2["클래스 상세\n정보, 스튜디오, 회차 미리보기"]
    FE3["예약 화면\n회차 선택, 인원 선택, 확정"]
    FE4["내 예약\n목록, 상세, 상태 확인"]
    FE5["로그인 콜백 처리\n세션 생성"]
    FE6["관리자\n대시보드"]
  end

  subgraph L2["인증"]
    AU1["구글 OAuth"]
    AU2["세션 발급\n토큰 검증"]
  end

  subgraph L3["백엔드 API"]
    BE1["클래스 API\n목록, 상세"]
    BE2["회차 API\n조회, 좌석 정보"]
    BE3["예약 API\n생성, 조회, 취소"]
    BE4["관리자 API\n클래스/회차 관리"]
    BE5["AI API\n요약/추천 요청"]
  end

  subgraph L4["데이터베이스"]
    DB1["사용자"]
    DB2["스튜디오"]
    DB3["클래스"]
    DB4["회차"]
    DB5["예약"]
    DB6["AI 결과 기록"]
  end

  subgraph L5["AI 서비스"]
    AI1["AI 모델\n요약/추천 생성"]
  end

  %% 사용자 진입 및 네비게이션
  U1 --> FE0
  FE0 --> FE1
  FE1 --> FE2
  FE2 --> FE3
  FE0 --> FE4
  FE0 --> FE6

  %% 로그인 흐름
  FE3 -->|"로그인 필요"| AU1
  AU1 --> FE5
  FE5 --> AU2
  AU2 --> FE3

  %% 프론트 -> 백엔드 호출(핵심)
  FE1 -->|"클래스 목록 조회"| BE1
  FE2 -->|"클래스 상세 조회"| BE1
  FE2 -->|"회차 조회"| BE2
  FE3 -->|"회차 및 좌석 조회"| BE2
  FE3 -->|"예약 생성 요청"| BE3
  FE4 -->|"내 예약 조회"| BE3
  FE6 -->|"관리자 기능 호출"| BE4

  %% 백엔드 -> DB 관계
  BE1 --> DB3
  BE1 --> DB2
  BE2 --> DB4
  BE3 --> DB5
  BE3 --> DB4
  BE3 --> DB1
  BE4 --> DB3
  BE4 --> DB4
  AU2 --> DB1

  %% AI 확장 기능
  FE2 -. "AI 기능 진입" .-> BE5
  FE4 -. "AI 기능 진입" .-> BE5
  BE5 --> AI1
  BE5 --> DB6
  BE5 --> DB1

  %% 데이터 연관(참고용)
  DB2 -. "스튜디오가 클래스를 운영" .- DB3
  DB3 -. "클래스가 회차를 가짐" .- DB4
  DB4 -. "회차가 예약을 가짐" .- DB5
  DB1 -. "사용자가 예약을 생성" .- DB5

# 사용자 여정 및 로직 흐름 (Sequence Diagram)
sequenceDiagram
  autonumber
  actor U as 사용자
  participant Web as 웹 프론트엔드
  participant Auth as 인증 서버(Google OAuth)
  participant API as 백엔드 API
  participant DB as 데이터베이스
  participant AI as AI 서비스

  %% 1. 서비스 접속 및 클래스 탐색
  U->>Web: 서비스 접속
  Web->>API: 클래스 목록 조회 요청
  API->>DB: 클래스/스튜디오 정보 조회
  DB-->>API: 클래스 목록 반환
  API-->>Web: 클래스 목록 응답
  Web-->>U: 클래스 목록 화면 표시

  %% 2. 클래스 상세 조회
  U->>Web: 클래스 상세 선택
  Web->>API: 클래스 상세 정보 요청
  API->>DB: 클래스 + 회차 정보 조회
  DB-->>API: 상세 정보 반환
  API-->>Web: 클래스 상세 응답
  Web-->>U: 클래스 상세 화면 표시

  %% 3. 예약 시 로그인 처리
  U->>Web: 예약하기 클릭
  alt 로그인되지 않은 사용자
    Web->>Auth: 구글 로그인 요청
    Auth-->>Web: 인증 토큰 반환
    Web->>API: 로그인 정보 전달
    API->>DB: 사용자 정보 저장 또는 갱신
    DB-->>API: 저장 완료
    API-->>Web: 로그인 성공 응답
  end

  %% 4. 예약 정보 입력
  Web-->>U: 예약 화면 표시
  U->>Web: 날짜/시간(회차) 선택
  U->>Web: 예약 인원 선택

  %% 5. 예약 생성 (핵심 비즈니스 로직)
  Web->>API: 예약 생성 요청(회차ID, 인원)
  API->>DB: 트랜잭션 시작
  API->>DB: 회차 잔여 좌석 확인
  alt 좌석 충분
    API->>DB: 예약 데이터 생성(상태: 확정)
    API->>DB: 회차 예약 인원 증가
    API->>DB: 트랜잭션 커밋
    API-->>Web: 예약 완료 응답
    Web-->>U: 예약 완료 화면 표시
  else 좌석 부족
    API->>DB: 트랜잭션 롤백
    API-->>Web: 예약 실패 응답
    Web-->>U: 좌석 부족 안내 메시지
  end

  %% 6. 내 예약 조회
  U->>Web: 내 예약 목록 이동
  Web->>API: 사용자 예약 목록 요청
  API->>DB: 예약 목록 조회
  DB-->>API: 예약 데이터 반환
  API-->>Web: 예약 목록 응답
  Web-->>U: 내 예약 목록 화면 표시

  %% 7. AI 기능 (PRD 확장 기능)
  opt AI 요약 또는 추천 기능
    U->>Web: 텍스트 입력 또는 추천 요청
    Web->>API: AI 요청 전달
    API->>AI: AI 처리 요청
    AI-->>API: AI 결과 반환
    API->>DB: AI 결과 저장
    API-->>Web: AI 결과 응답
    Web-->>U: AI 결과 표시
  end