# 002 - UI Migration & Dependencies (pnpm add)

## 1) 설치 날짜 및 작업자

- **설치/적용 날짜(근거: git commit)**: 2026-01-28 (KST)
- **작업자**: 시니어 개발자(choeunbin03) & AI 파트너(Cursor)

> 참고: 이 파일은 과거 커밋에서 “빈 파일로 생성”되어(내용 기록 누락) 현재 시점의 `package.json`을 기준으로 설치 내역을 정리했습니다.

## 2) 설치된 라이브러리 목록

### UI/컴포넌트 기반

- `@radix-ui/react-dialog`
- `@radix-ui/react-label`
- `@radix-ui/react-select`
- `@radix-ui/react-slot`
- `@radix-ui/react-tabs`

### 스타일/유틸리티

- `tailwindcss` (dev)
- `@tailwindcss/postcss` (dev)
- `tailwind-merge`
- `clsx`
- `class-variance-authority`

### 아이콘

- `lucide-react`

### 개발/품질(프로젝트 표준)

- `eslint` (dev)
- `eslint-config-next` (dev)
- `typescript` (dev)
- `@types/node` (dev)
- `@types/react` (dev)
- `@types/react-dom` (dev)

## 3) 각 라이브러리를 설치한 이유

### v0 UI 이식 / Headless UI 기반

- **Radix UI(`@radix-ui/react-*`)**
  - v0/shadcn 스타일의 UI 구성(다이얼로그/셀렉트/탭 등)에 필요한 headless 컴포넌트 기반
  - 접근성(A11y) 및 상호작용(포커스/키보드) 구현 비용을 낮추기 위함

### Tailwind 기반 스타일링 생산성

- **`tailwind-merge`**
  - 조건부 className 조합 시 중복/충돌 클래스를 자동 정리(특히 variant/size 조합 UI에서 효과 큼)
- **`clsx`**
  - className 조건부 결합을 간단하고 안전하게 처리
- **`class-variance-authority`**
  - Button/Badge 같은 UI 컴포넌트의 variant(색상/크기/상태) 규칙을 타입 안정적으로 관리

### 아이콘 일관성

- **`lucide-react`**
  - 프로젝트 전반에서 일관된 아이콘 세트를 사용하고, UI 이식 시 아이콘 교체 비용을 줄이기 위함

### 빌드/정적 분석 표준화

- **TypeScript/ESLint 관련(dev deps)**
  - Next.js(App Router) + TS strict 환경에서 안정적인 타입/린트 체계를 확보
  - UI 이식 과정에서 스타일/컴포넌트가 빠르게 늘어나도 코드 품질을 유지하기 위함

## 4) 발생했던 에러와 해결 과정 요약

- **확인된 에러 기록 없음**
  - 본 문서(002)가 과거 커밋에서 “빈 파일로 생성”되어 당시 에러/해결 로그가 남아있지 않습니다.
  - 현재 리포지토리 기준으로는 의존성 설치/빌드 관련 에러 로그가 별도로 기록된 파일이 확인되지 않았습니다.

> 추후 `pnpm add` 또는 UI 이식 작업 중 에러가 발생하면, 본 파일에 “에러 발생 → 원인 → 해결 → 재발 방지”를 반드시 추가 기록합니다.

