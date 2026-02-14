# Google OAuth Implementation Roadmap (Supabase SDK)

이 문서는 Supabase SDK(`@supabase/ssr`)를 활용하여 Next.js App Router 환경에서 Google OAuth 로그인을 구현하기 위한 단계별 계획입니다.

## 1. 프로젝트 설정 및 의존성 설치

가장 먼저 Supabase 관련 필수 패키지를 설치해야 합니다. 분석 결과 현재 `package.json`에 관련 의존성이 누락되어 있습니다.

- [ ] **패키지 설치**: 다음 명령어로 패키지를 설치합니다.
  ```bash
  npm install @supabase/supabase-js @supabase/ssr
  ```

## 2. 환경 변수 설정

Supabase 프로젝트 연동을 위한 환경 변수를 설정합니다.

- [ ] **`.env.local` 파일 생성/수정**: 프로젝트 루트에 `.env.local` 파일이 없다면 생성하고, 다음 키를 추가합니다.
  ```env
  NEXT_PUBLIC_SUPABASE_URL=your-project-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  ```
  *(참고: 실제 값은 Supabase 대시보드에서 확인해야 합니다.)*

## 3. Supabase 유틸리티 구현 (`lib/supabase`)

Next.js의 SSR 환경(Server Components, Server Actions, Middleware, Client Components)에서 Supabase를 원활하게 사용하기 위해 헬퍼 함수를 구현합니다. 현재 `lib/supabase` 내 파일들은 비어있으므로 새로 작성해야 합니다.

- [ ] **Browser Client (`lib/supabase/client.ts`)**: 클라이언트 컴포넌트에서 사용할 싱글톤 클라이언트 생성 함수 구현.
- [ ] **Server Client (`lib/supabase/server.ts`)**: 서버 컴포넌트, 서버 액션, 라우트 핸들러에서 사용할 클라이언트 생성 함수 구현 (쿠키 조작 로직 포함).
- [ ] **Middleware Client (`lib/supabase/middleware.ts`)**: 미들웨어에서 세션을 관리하고 쿠키를 갱신하는 로직 구현 (`updateSession` 함수).

## 4. Next.js 미들웨어 설정

모든 요청에 대해 Supabase 세션을 갱신하여 인증 상태를 유지하기 위한 미들웨어를 설정합니다.

- [ ] **미들웨어 파일 생성 (`middleware.ts`)**: 프로젝트 루트(또는 `src`가 있다면 `src/middleware.ts`)에 파일 생성.
- [ ] **로직 구현**: `lib/supabase/middleware.ts`의 `updateSession` 함수를 호출하여 리스폰스를 반환하도록 구현.
- [ ] **Matcher 설정**: 정적 파일, 이미지 등을 제외한 경로에만 적용되도록 config 설정.

## 5. Auth Callback 라우트 구현

OAuth 로그인 후 Supabase에서 리다이렉트될 때 인증 코드를 세션으로 교환(Exchange Code for Session)하는 라우트 핸들러가 필요합니다.

- [ ] **라우트 파일 생성 (`app/auth/callback/route.ts`)**: 디렉토리 구조 생성.
- [ ] **GET 핸들러 구현**: URL 쿼리 파라미터에서 `code`를 추출하고 `supabase.auth.exchangeCodeForSession(code)`를 실행한 뒤 홈(`origin`)으로 리다이렉트하는 로직 구현.

## 6. UI 컴포넌트 및 로그인 로직

사용자가 클릭하여 로그인을 시도할 수 있는 버튼과 실제 로그인 로직을 구현합니다.

- [ ] **로그인 버튼 컴포넌트 (`components/auth/LoginButton.tsx`)**:
  - "Google로 시작하기" 버튼 UI 구현.
  - 클릭 이벤트 핸들러에서 `supabase.auth.signInWithOAuth` 호출.
  - `provider: 'google'`, `options: { redirectTo: description... }` 설정.
- [ ] **헤더 또는 로그인 페이지 연동**: 기존 헤더 컴포넌트(`components/layout/Header.tsx` 예상)에 로그인 버튼 배치 및 로그인 상태에 따른 UI 분기(로그인 시 프로필/로그아웃, 비로그인 시 로그인 버튼).

## 7. 검증 및 테스트 (Verification)

구현 후 다음 시나리오를 통해 동작을 검증합니다.

1. **로그인 시도**: "Google로 시작하기" 클릭 시 구글 로그인 창으로 이동하는가?
2. **콜백 처리**: 로그인 완료 후 `app/auth/callback`을 거쳐 메인 페이지로 정상 리다이렉트 되는가?
3. **세션 유지**: 새로고침 후에도 로그인 상태가 유지되는가? (쿠키 확인)
4. **로그아웃**: 로그아웃 버튼 클릭 시 세션이 삭제되고 비로그인 상태로 전환되는가?
