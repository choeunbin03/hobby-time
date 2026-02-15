# Hobby Time (1-Week MVP Project)

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-blue?style=for-the-badge&logo=tailwind-css)

## 1. 프로젝트 개요 (Project Overview)
**Hobby Time**은 누구나 쉽게 원데이 클래스를 예약하고 취미 생활을 즐길 수 있도록 돕는 웹 애플리케이션입니다.

이 프로젝트는 **약 1주일간 진행된 MVP(Minimum Viable Product)** 개발 프로젝트로, 핵심 기능인 '클래스 조회'와 '예약'에 집중하여 구현되었습니다.

---

## 2. 개발 방식: AI Native & Vibe Coding
이 프로젝트의 가장 큰 특징은 **"Vibe Coding"** 방식으로 개발되었다는 점입니다.
저는 코드를 한 줄씩 직접 타이핑하는 전통적인 방식에서 벗어나, **AI 도구들과 협업하여 개발 생산성을 극대화**하는 실험을 진행했습니다.

- **Tools Used**: Cursor (IDE), Antigravity (Agent), v0 (UI Generation), LLMs (Claude 3.5 Sonnet / GPT-4o)
- **Workflow**:
  1.  **설계 & 지시**: 제가 전체 아키텍처와 데이터베이스 스키마(Supabase)를 설계하고, AI에게 구체적인 요구사항을 프롬프트로 전달했습니다.
  2.  **생성 & 구현**: AI(Cursor, Antigravity)가 비즈니스 로직과 UI 컴포넌트의 초안을 작성했습니다.
  3.  **검토 & 조율**: 생성된 코드를 제가 리뷰하고, 버그를 수정하거나 UX를 개선하는 방향으로 AI를 다시 가이드했습니다.
  4.  **통합 & 배포**: 개별 모듈들을 통합하고 전체적인 완성도를 높였습니다.

이를 통해 개발 속도를 획기적으로 단축하면서도, 코드의 구조와 퀄리티를 일정 수준 이상으로 유지할 수 있었습니다.

---

## 3. 기획 배경 및 목적
- **배경**: 학교 비교과 프로그램의 일환으로, 최신 AI 개발 트렌드인 'Vibe Coding'을 직접 실습해보고자 시작했습니다.
- **목적**:
  - AI를 활용한 실제 소프트웨어 개발 사이클 경험
  - Next.js 16 (App Router)와 Supabase의 최신 기능 활용
  - 짧은 시간(1주) 안에 동작 가능한 서비스(MVP) 완성

---

## 4. 주요 기능 (Key Features)

### 👤 사용자 (Client)
- **회원가입/로그인**: 이메일 기반의 간편한 인증 (Supabase Auth).
- **클래스 둘러보기**: 카테고리별 취미 클래스 목록 조회.
- **클래스 상세 정보**: 수업 상세 내용, 강사 프로필, 위치 정보 확인.
- **실시간 예약**: 원하는 날짜와 시간을 선택하여 원데이 클래스 예약 (중복 예약 방지 로직 적용).
- **마이페이지**: 나의 예약 내역 확인 및 예약 취소 기능.

### 🏢 관리자/강사 (Admin/Instructor Scope)
*(MVP 단계에서는 데이터베이스 시딩을 통해 임의 데이터를 생성하여 테스트했습니다)*
- 클래스 생성 및 스케줄 관리 데이터 모델링 완료.

---

## 5. 기술 스택 (Tech Stack)

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Lucide React (Icons)
- **UI Components**: Radix UI Primitives (Dialog, Dropdown, etc.), Sonner (Toast)

### Backend & Infrastructure
- **BaaS**: Supabase
  - **Database**: PostgreSQL (Relational Data Model)
  - **Auth**: Authentication & Authorization (RLS Policies)
  - **Realtime**: Database subscribing (Optional)

### Utilities
- `date-fns`: 날짜 및 시간 처리
- `zod`: 데이터 검증 (Schema Validation)
- `clsx` / `tailwind-merge`: 조건부 스타일링 관리

---

## 6. 개발자의 역할과 의사결정 (My Role & Decisions)
AI가 코드를 생성해주더라도, **결국 중요한 의사결정은 사람(개발자)의 몫**이었습니다.

1.  **데이터 모델링 (Schema Design)**:
    - 예약 시스템의 핵심인 '중복 예약 방지'를 위해 `class_sessions`과 `reservations` 테이블을 분리하고, Database Transaction(또는 Atomic Operation)을 고려하여 설계했습니다.
    - 예약 시점의 가격 변동 이슈를 해결하기 위해 `reservations` 테이블에 스냅샷 필드(`price_snapshot`)를 추가하도록 지시했습니다.

2.  **Next.js App Router 구조 설계**:
    - 서버 컴포넌트(RSC)와 클라이언트 컴포넌트의 경계를 명확히 하여 성능을 최적화했습니다.
    - 데이터 페칭은 서버 사이드에서, 인터랙션은 클라이언트 사이드에서 처리하도록 구조를 잡았습니다.

3.  **UX 디테일 챙기기**:
    - AI가 놓치기 쉬운 사용자 경험(로딩 상태 스켈레톤 UI, 예약 성공/실패 시의 명확한 피드백, 에러 핸들링)을 직접 챙기고 구현했습니다.

---

## 7. MVP 범위 및 한계 (Limitations)
이 프로젝트는 **1주일**이라는 짧은 기간 동안 진행된 MVP입니다. 따라서 다음과 같은 한계가 존재하며, 이는 추후 고도화 과제로 남겨두었습니다.

- **결제 연동 미구현**: 실제 PG사 연동 대신 예약 버튼 클릭 시 즉시 예약 확정 처리됩니다.
- **어드민 페이지 부재**: 강사가 클래스를 등록하는 UI는 생략되었으며, Supabase 대시보드에서 데이터를 관리합니다.
- **고급 검색 필터 미구현**: 단순 카테고리 분류 정도만 구현되어 있습니다.

---

## 8. 실행 방법 (How to Run)

1. **프로젝트 클론**
   ```bash
   git clone https://github.com/choeunbin03/hobby-time.git
   cd hobby-time
   ```

2. **패키지 설치**
   ```bash
   npm install
   # 또는
   pnpm install
   ```

3. **환경 변수 설정**
   `.env.local` 파일을 생성하고 Supabase 키를 입력합니다.
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   # 또는
   pnpm dev
   ```

---

## 9. 회고 (Retrospective)
이번 프로젝트를 통해 **"개발자의 역할이 코더(Coder)에서 아키텍트(Architect)이자 감독(Director)으로 변화하고 있음"**을 체감했습니다.

단순 반복적인 코드 작성은 AI에게 맡기고, 저는 **"어떤 데이터를 저장할 것인가?", "사용자 흐름은 어떻게 이어지는가?", "이 코드가 전체 구조에 적합한가?"**를 고민하는 데 더 많은 시간을 쏟을 수 있었습니다.

완벽하진 않지만, AI와 협업하여 빠르게 아이디어를 실체화하는 **Modern Development Workflow**를 익힌 뜻깊은 경험이었습니다.
