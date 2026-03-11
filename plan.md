# 요가 수트라 렌더링 레이아웃 복구 (Verse View Layout Fix)

## 1. 개요
현재 `VerseView` 컨트롤러에서 모델 데이터(수트라 텍스트)를 성공적으로 렌더링하고 있으나, Tailwind CSS JIT 컴파일러의 동적 클래스 파싱 누락으로 인해 뷰(View)의 사이드바 레이아웃이 붕괴되어 메인 콘텐츠가 화면에서 사라진 문제("안나옴")를 해결합니다. 더불어, 레퍼런스(The Tibetan Book of the Dead) UI처럼 본문 텍스트가 수직으로 우아하게 중앙에 오도록 CSS Flexbox로 메인 컨테이너 구조를 최적화합니다.

## 2. 작업 목록 (TODO)

### Stage 1: Tailwind 동적 클래스 할당 버그 수정
- [x] `src/components/ui/SidebarLayout.tsx` 수정
  - `widthClass` 프롭스로 넘어오는 값(예: `w-80`)을 템플릿 리터럴(`lg:${widthClass}`)로 결합하는 방식 제거.
  - 온전한 문자열(`lg:w-80`)을 통째로 전달받거나, 데스크톱용 클래스 프롭(`desktopWidthClass`)을 신설하여 JIT 엔진이 클래스를 누락시키지 않도록 구조 변경.
- [x] `src/components/Sidebar.tsx` 수정
  - `SidebarLayout` 컴포넌트를 호출할 때, 새로 정의한 프롭스 규격에 맞게 하드코딩된 완전한 Tailwind 문자열 클래스(`lg:w-80`) 전달.

### Stage 2: 본문(Verse) 수직 중앙 정렬 (Vertical Centering)
- [x] `src/pages/VerseView.tsx` 래퍼 레이아웃 수정
  - 레퍼런스 스타일처럼 수트라 내용이 화면 한가운데 오도록 중앙 정렬 로직 적용.
  - 적용 클래스: 기존 `min-h-screen`을 유지하되 `flex flex-col justify-center` 파라미터를 추가하여 내부의 모든 콘텐츠 블록(`section`)이 수직의 한가운데 배치되도록 스타일 상속 재정의.
  - 최상단 `div`의 불필요한 `pt-6 pb-24` 패딩 수치를 화면 비율에 맞게 재조정하여 중앙 정렬이 시각적으로 완벽히 맞도록 교정.

### Stage 3: 로컬 테스트 및 브라우저 검증
- [x] 브라우저 서브에이전트(혹은 Vite 수동 확인)를 통해 좌우 사이드바(장, Reflections)가 각각 정상적인 너비(`320px`, `400px`)를 점유하는지 확인.
- [x] 중앙 콘텐츠(main)가 남은 영역을 정확히 채우고, 텍스트가 정중앙에 플로팅되는지 검증.
