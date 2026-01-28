# HobbyTime 기술 명세서

PRD·FLOW를 반영한 기술 스택 및 컴포넌트 설계 원칙을 정의합니다.

---

## 1. 사용 기술 스택

### 1.1 코어

| 구분 | 기술 | 버전/비고 |
|------|------|------------|
| 런타임 | Node.js | 20+ LTS |
| 프레임워크 | Next.js | 15+ (App Router) |
| 언어 | TypeScript | 5.x |
| 스타일 | Tailwind CSS | 4.x |

### 1.2 UI 라이브러리

| 라이브러리 | 용도 |
|------------|------|
| **shadcn/ui** | 버튼, 카드, 다이얼로그, 셀렉트 등 공통 UI 컴포넌트. `components/ui/`에 설치·관리 |
| **Lucide React** | 아이콘. 버튼·필터·네비게이션 등 일관된 아이콘 세트 |
| **Tailwind CSS** | 유틸리티 기반 스타일, 디자인 토큰(색·간격·타이포) |

### 1.3 데이터·인증

| 라이브러리 | 용도 |
|------------|------|
| **@supabase/supabase-js** | DB 클라이언트, RLS, 실시간 구독 |
| **@supabase/ssr** | App Router용 서버·미들웨어 클라이언트 |
| **@supabase/auth-helpers-nextjs** (또는 auth-js) | Google OAuth, 세션 관리 |

### 1.4 검증·유틸

| 라이브러리 | 용도 |
|------------|------|
| **Zod** | API·폼 입력 검증, `lib/validations/` 스키마 |
| **clsx** / **tailwind-merge** | `lib/utils/cn.ts`에서 className 병합 |

### 1.5 AI (Phase 1 최소)

| 라이브러리 | 용도 |
|------------|------|
| **Vercel AI SDK** 또는 **OpenAI SDK** | 텍스트 → AI 응답 → DB 저장 파이프라인 |

---

## 2. PRD·Flow 반영 컴포넌트 설계 원칙

### 2.1 계층 구조

- **`components/ui/`**  
  - shadcn 기반 **재사용 가능한 프레젠테이션 컴포넌트**.  
  - 비즈니스 로직·도메인 의존성 없음.
- **`components/domain/`**  
  - **도메인별** 컴포넌트.  
  - `class`, `session`, `reservation`, `studio`, `review` 등 PRD 기능 단위로 분리.  
  - `ui/`를 조합하고, `hooks/`·`lib/supabase/queries/`를 사용해 데이터·상태 처리.
- **`components/layout/`**  
  - 헤더, 푸터, 인증 가드 등 **레이아웃·공통 흐름**.
- **`components/shared/`**  
  - 에러 바운더리, 로딩, 빈 상태 등 **도메인 무관 공용** 컴포넌트.

### 2.2 Flow 기준 매핑

- **홈 → 클래스 목록·필터·정렬**  
  - `ClassList`, `ClassFilters`, `ClassCard` (domain/class).  
  - 필터·정렬 상태는 URL 쿼리 또는 훅 내부 상태로 관리.
- **클래스 상세 → 예약 CTA**  
  - `ClassDetail`, `StudioInfo` (domain).  
  - CTA는 비로그인 시 로그인 유도, 로그인 시 `classes/[id]/book` 이동.
- **예약 화면**  
  - `SessionList`, `SessionCard`, `CapacityIndicator`, `ReservationForm` (domain/session, domain/reservation).  
  - 회차·잔여 좌석은 `useSessions`, 예약 생성은 `useReservations` 또는 API 직접 호출.
- **내 예약**  
  - `ReservationList`, `ReservationCard` (domain/reservation).  
  - `useReservations`로 “내 예약”만 조회.
- **관리자 대시보드 (Phase 2)**  
  - 전용 라우트 그룹 `(dashboard)/admin/` 사용.  
  - 클래스/회차/예약 관리 UI는 domain 컴포넌트 확장 또는 admin 전용 컴포넌트로 구현.

### 2.3 원칙 요약

1. **도메인 단위로 파일·폴더 분리**  
   - 한 도메인 안에서만 참조할 컴포넌트는 해당 도메인 폴더에 두고, 여러 도메인에서 쓰이면 `shared/` 또는 `ui/`로 승격 검토.
2. **데이터·API 접근은 훅·쿼리 함수로 일원화**  
   - 페이지·domain 컴포넌트는 `useClasses`, `useSessions`, `useReservations` 등으로만 데이터 취득.  
   - 실제 Supabase 호출은 `lib/supabase/queries/`에서 처리.
3. **검증은 Zod 스키마 공유**  
   - `lib/validations/`의 스키마를 API 라우트와 클라이언트 폼 검증에서 공통 사용.
4. **Phase 2 기능은 기존 구조 확장**  
   - 후기·결제·관리자 기능은 새 domain 폴더(`review` 등) 또는 기존 domain에 파일 추가로 확장.  
   - UI 계층(ui / domain / layout / shared)은 유지.

---

## 3. 디렉터리별 책임

| 경로 | 책임 |
|------|------|
| `app/` | 라우트, 레이아웃, 페이지. 비즈니스 로직 최소화하고 domain·layout 컴포넌트 조합 |
| `components/ui/` | shadcn 및 공통 프레젠테이션 컴포넌트 |
| `components/domain/` | PRD 기능별 비즈니스 UI |
| `components/layout/` | 헤더, 푸터, AuthGuard |
| `components/shared/` | 에러/로딩/빈 상태 등 공용 |
| `lib/supabase/` | 클라이언트·서버·미들웨어, queries |
| `lib/ai/` | AI 클라이언트·프롬프트 |
| `lib/utils/` | cn, date, validation, constants |
| `lib/validations/` | Zod 스키마 |
| `hooks/` | 클래스·회차·예약·인증·AI용 커스텀 훅 |
| `types/` | DB·API·도메인 타입 정의 |

---

이 명세는 PRD Phase 1·2와 FLOW의 페이지·API 흐름을 기준으로 하며, 신규 라이브러리 추가·변경 시 이 문서를 우선 갱신합니다.
