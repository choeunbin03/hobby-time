# 001 - Initial Setup

## 날짜

- 2026-01-29

## 변경 내용 (What changed)

### 프로젝트 부트스트랩

- Next.js(App Router) + TypeScript(Strict) 기반 프로젝트 생성
- 기본 스크립트 구성: `dev`, `build`, `start`, `lint`
- 기본 라우팅 구조: `app/` 기반(페이지/레이아웃)

### 스타일/디자인 시스템 기반

- Tailwind CSS v4 구성 (`tailwindcss.config.js`, `postcss.config.mjs`, `app/globals.css`)
- CSS 변수 기반 디자인 토큰(색/라운드/폰트) 확장 구성

### UI 컴포넌트/아이콘

- `components/ui/`에 재사용 UI 프리미티브(예: Card, Button, Dialog, Select, Tabs 등) 구성
- 아이콘: `lucide-react`
- UI 기반 라이브러리: Radix UI(`@radix-ui/react-*`) 계열 포함

### 코드 구조(폴더) 정리

- `app/`: 라우트/레이아웃/서버 라우트(API) 위치
- `components/`: UI/도메인/레이아웃/공용 컴포넌트 구조
- `hooks/`: 도메인 훅(인증/클래스/예약/AI 등) 자리
- `lib/`: 유틸/검증/데이터 접근(supabase scaffold 포함) 자리
- `types/`: 도메인/DB/API 타입 정의 자리
- `docs/`: PRD/FLOW/기술 명세/DB 가이드/히스토리

### 데이터(현재 상태)

- 현재 화면 렌더링은 `lib/mock-data.ts` 기반 목데이터를 사용
- `lib/supabase/*`, `app/api/*`, `hooks/*`는 일부 파일이 **스텁 상태**(구현 전)로 존재

## 변경 이유 (Why)

- Phase 1(MVP) 개발을 위한 **표준 Next.js(App Router) 기반 골격**을 먼저 확보
- UI/UX 빠른 반복을 위해 **Tailwind + UI 프리미티브 + 목데이터**로 화면을 우선 완성할 수 있게 구성
- PRD/FLOW 기준 도메인 확장을 대비해 `components/domain`, `hooks`, `types`, `lib/supabase` 구조를 선제적으로 마련

## 의존성 요약 (Dependencies)

`package.json` 기준 핵심 의존성:

- `next` (App Router)
- `react`, `react-dom`
- `tailwindcss`, `@tailwindcss/postcss`
- `eslint`, `eslint-config-next`
- `@radix-ui/react-*` (dialog/label/select/slot/tabs)
- `lucide-react`
- `clsx`, `tailwind-merge`, `class-variance-authority`

> 참고: `docs/tech-stack.md`에는 Supabase/Zod/AI SDK 등이 포함되어 있으나, **현재 `package.json`에는 해당 패키지가 설치되어 있지 않습니다.** (추가 예정)

## 관련 이슈 / 에러

- 없음
