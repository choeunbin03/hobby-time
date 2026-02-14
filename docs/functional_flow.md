# Functional Flow & Implementation List

이 문서는 화면 단위가 아닌 **데이터 흐름(Data Flow)**과 **구현 우선순위**를 기준으로 작성된 개발 로드맵입니다.
각 항목은 "컨펌" 가능한 단위로 번호가 매겨져 있으며, Phase 1부터 순차적으로 진행합니다.

---

## Phase 1: Foundation (환경 및 인증)

이 단계에서는 공통 유틸리티와 인증 상태 관리를 구현하여 데이터 페칭의 기반을 마련합니다.

1.  **Supabase Client/Server Utility Setup**
    *   **목표**: SSR, Client, Middleware 환경에서 Supabase에 접근할 수 있는 통합 진입점 마련.
    *   **구현 파일**: `lib/supabase/{client.ts, server.ts, middleware.ts}`
    *   **기술 스택**: `@supabase/ssr` (Next.js 15+ 호환)
    *   **Data Flow**: `Env Variables` -> `Supabase Client` -> `Auth State`

2.  **Global Middleware & Auth Guard**
    *   **목표**: 모든 요청에 대해 세션을 갱신하고, 보호된 라우트 접근 제어.
    *   **구현 파일**: `middleware.ts`
    *   **로직**:
        *   `updateSession(request)` 호출로 쿠키(세션) 갱신.
        *   로그인 필요한 페이지(`my/*` 등) 접근 시 미로그인 상태면 `/login` 리다이렉트.

3.  **Google OAuth Authentication Flow**
    *   **목표**: `users` 테이블(Supabase Auth)에 사용자 세션 생성.
    *   **구현**:
        *   **Login**: `supabase.auth.signInWithOAuth({ provider: 'google' })` (Client Component)
        *   **Callback**: `app/auth/callback/route.ts`에서 Authorization Code Exchange (`exchangeCodeForSession`).
    *   **Data Flow**: `OAuth Provider` -> `Callback Route` -> `Session Cookie` -> `Client State`

---

## Phase 2: Core Logic (비즈니스 데이터 I/O)

핵심 비즈니스 로직을 데이터 읽기(Read)와 쓰기(Write) 관점에서 구현합니다.

4.  **Class Discovery (Read)**
    *   **목표**: 메인 페이지에 클래스 목록과 스튜디오 정보를 조인하여 표시.
    *   **화면**: `/` (Home)
    *   **Server Component**: `app/page.tsx`
    *   **Query**:
        ```typescript
        supabase.from('classes')
          .select('*, studios(name, region)')
          .order('created_at', { ascending: false })
        ```
    *   **Note**: 필터링(지역/카테고리)은 URL Search Params(`?region=서울`)를 받아 Query에 `.eq()` 조건 추가.

5.  **Class Detail & Studio Info (Read)**
    *   **목표**: 특정 클래스의 상세 정보와 운영 스튜디오 정보 조회.
    *   **화면**: `/classes/[id]`
    *   **Server Component**: `app/classes/[id]/page.tsx`
    *   **Query**:
        ```typescript
        supabase.from('classes')
          .select('*, studios(*)')
          .eq('id', classId)
          .single()
        ```

6.  **Available Sessions Fetching (Read)**
    *   **목표**: 클래스 상세 페이지 내에서 "예약 가능한 회차" 목록 조회.
    *   **화면**: `/classes/[id]` (Client Component Section)
    *   **Hook**: `useSessions(classId)` (Client Side Fetching 권장 - 실시간성)
    *   **Query**:
        ```typescript
        supabase.from('sessions')
          .select('*')
          .eq('class_id', classId)
          .gte('start_at', new Date().toISOString()) // 미래 일정만
          .order('start_at')
        ```

7.  **Reservation Transaction (Write) [CRITICAL]**
    *   **목표**: 예약 생성과 동시성 제어(Database Transaction).
    *   **기술 스택**: Supabase Database Function (RPC) 사용 권장.
    *   **Data Flow**:
        1.  User clicks "Book" -> `Server Action` or `Client API Call`.
        2.  Call RPC `create_reservation(user_id, session_id, head_count)`.
        3.  **RPC Logic**:
            *   Check `(capacity - booked_count) >= head_count`
            *   Insert into `reservations`
            *   Update `sessions.booked_count`
            *   Commit or Rollback
    *   **Validation**: Server Actions에서 Zod로 입력값 검증 후 RPC 호출.

8.  **My Reservations (Read)**
    *   **목표**: 로그인한 사용자의 예약 내역 조회.
    *   **화면**: `/my/reservations`
    *   **Server Component**: `app/my/reservations/page.tsx`
    *   **Policy**: RLS (`auth.uid() == user_id`) 자동 적용.
    *   **Query**:
        ```typescript
        supabase.from('reservations')
          .select('*, sessions!inner(*, classes!inner(*))')
          .order('created_at', { ascending: false })
        ```

---

## Phase 3: Interaction & Feedback (사용자 경험)

데이터에 반응하는 UI 피드백을 구현합니다.

9.  **Optimistic UI Handling**
    *   내용: 예약 버튼 클릭 시 즉시 "예약 중..." 상태 표시 및 버튼 비활성화.
    *   구현: React `useTransition` 또는 `useOptimistic` (Next.js 15).

10. **Global Toast Notifications**
    *   내용: 성공/실패 메시지를 일관된 UI로 노출.
    *   구현: `sonner` 또는 `react-hot-toast` 라이브러리 연동. 중앙 `ToastProvider` 배치.

11. **Empty States & Skeletons**
    *   내용: 데이터 페칭 중 로딩 UI(Skeleton) 및 데이터 없음(Empty) 상태 처리.
    *   구현: `Suspense` 및 `loading.tsx` 활용.

---

**Next Step Proposal:**
가장 먼저 **Phase 1-1 (Supabase Setup)**과 **1-3 (Auth)**을 진행하여 "로그인이 가능한 상태"를 만드는 것을 추천합니다.
