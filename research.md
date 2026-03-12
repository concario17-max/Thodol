# 요가 프로젝트 화면 레이아웃 및 토글 메커니즘 리서치 보고서

## 1. 현재 레이아웃 구조 (AppShell)
현재 프로젝트는 `AppShell.tsx`를 기반으로 한 3-Column(좌측 사이드바, 중앙 메인, 우측 패널) 레이아웃을 사용하고 있습니다.
- **좌측 사이드바 (Chapter)**: `Sidebar.tsx` (폭: `lg:w-80` = 320px)
- **중앙 (Main)**: `VerseView.tsx` 등 메인 콘텐츠 영역 (`flex-1`)
- **우측 패널 (Reflections)**: `Reflections.tsx` (폭: `sm:w-[400px]`)

## 2. 사용자 요구사항
1. **토글 버튼 구현**: 
   - 좌측 영역(Chapter)을 열고 닫는 토글 버튼 구현.
   - 우측 영역에 기존의 '통찰 기록(Reflections)' 외에 '코멘터리(Commentary)' 영역 추가.
   - 즉, 우측을 제어하는 2개의 토글(Reflections, Commentary) 버튼 구현 필요.
2. **조건부 확장(Expanding) 로직**:
   - 좌측 장(Chapter) 패널이 숨겨진(Closed) 상태에서, 우측의 코멘터리를 확장(Open)할 경우 코멘터리의 너비가 **`현재 통찰 기록 너비(400px) + 장 너비(320px) = 720px`** 로 대폭 확장되어야 함.

## 3. 구현 전략 (토글 버튼 위치 및 상태 관리)

### 토글 버튼 위치 선정
"토글 버튼은 어디에 만들지 고민해봐"라는 요구사항에 따라, 다음과 같이 `Header.tsx`에 배치하는 것이 가장 이상적입니다.
- **좌측 토글 (Chapter)**: 헤더 우측 상단 메인 로고 근처에 `Menu` 아이콘 배치 (기존 `showSidebarToggle` 활용).
- **우측 토글 2개 (Reflections & Commentary)**: 헤더 우측 끝(테마 토글 옆)에 `Edit3 (펜)` 아이콘과 `MessageSquare (코멘트)` 아이콘을 나란히 배치. 헤더 영역은 항시 노출(`sticky`)되므로 어느 문서에서든 패널을 즉각 제어할 수 있어 UX상 가장 유리합니다.

### 전역 상태(Context) 개편
- `UIContext.tsx` 내의 데스크톱/모바일 우측 패널 상태 관리 방식을 boolean(`isReflectionsOpen`)에서 Union Type(`'reflections' | 'commentary' | null`)로 업그레이드하여, 하나의 패널 영역에서 두 가지 모드를 상호 배타적으로 스위칭할 수 있도록 합니다.

### 반응형 폭(Width) 가변 로직
코멘터리 패널(`Commentary.tsx` 파일 신규 생성)을 렌더링할 때, `isDesktopSidebarOpen`의 값이 `false`(좌측이 숨겨짐)인지 실시간으로 판단합니다.
- `if (!isDesktopSidebarOpen)`: 코멘터리 패널 너비를 `w-[720px]`로 동적 할당 (`w-80` + `w-[400px]`).
- `else`: 기본 너비인 `w-[400px]` 할당.
