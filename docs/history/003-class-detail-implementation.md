# 003. Class Detail Page & Database Integration

**Date**: 2026-02-14
**Phase**: Phase 1 (Foundation) & Phase 2 (Core Logic - Partial)

## 1. Summary
클래스 상세 페이지(`app/classes/[id]/page.tsx`)를 고도화하여 Mock Data 대신 **Supabase Database**의 실제 데이터를 연동했습니다. 또한 클래스의 예약 가능 회차를 조회하는 로직을 구현했습니다.

## 2. Key Changes

### 2.1 Class Detail Page (`/classes/[id]`)
- **DB Connection**: `classes` 테이블과 `studios` 테이블을 조인(`*, studios(*)`)하여 데이터 페칭.
- **Error Handling**: 유효하지 않은 UUID 접근 시 404 처리.
- **UI**: 스튜디오 위치, 설명, 가격 등 DB 데이터를 화면에 바인딩.

### 2.2 Session Management (Logic Only)
- **`hooks/useSessions.ts`**:
  - `class_sessions` 테이블에서 `class_id`와 일치하고, 현재 시간 이후(`gte`)인 일정만 조회.
  - 날짜순 정렬(`order`).
- **`components/classes/SessionList.tsx`**:
  - 회차 목록을 시각화(날짜, 시간, 잔여석 표시).
  - *Note*: 현재 상세 페이지에서는 기획 변경으로 인해 **UI 노출을 숨김 처리** 했으나, 추후 예약 페이지에서 재사용 예정.

## 3. Tech Stack & Dependencies
- **Supabase SSR**: `@supabase/ssr`을 통한 Server Component 데이터 페칭.
- **Date Handling**: `date-fns` 라이브러리 추가 (날짜 포맷팅).

## 4. Next Steps
- **Booking Flow**: '예약하기' 버튼 클릭 시 회차 선택 및 예약 진행 프로세스 구현.
