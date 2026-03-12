# Yoga Project Deep Dive Report

본 프로젝트의 아키텍처, 데이터 흐름, 그리고 코드 품질 상태에 대한 심층 분석 결과 보고서.

## 1. 시스템 아키텍처 (System Architecture)

본 프로젝트는 **Vite + React + Tailwind CSS 4** 기반의 SPA(Single Page Application)이다. 'Zero Monolith' 지침에 따라 기능별로 컴포넌트가 분리되어 있으나, 일부 페이지 컴포넌트의 로직 밀도가 높음.

### 핵심 컴포넌트 구조
- **AppShell (`AppShell.tsx`)**: 전체 레이아웃의 근간. 상단 헤더, 좌측 사이드바, 우측 통찰 패널, 중앙 본문을 관리. `100dvh` 및 `backdrop-blur` 환경 제공.
- **UIContext (`UIContext.tsx`)**: 사이드바 및 패널의 열림/닫힘 상태를 전역 관리. 데스크톱 상태는 `localStorage`에 저장됨.
- **ThemeContext (`ThemeContext.tsx`)**: 다크 모드 상태 관리.
- **Sidebar (`Sidebar.tsx`)**: 장(Chapter) 및 수트라(Sutra) 목록을 트리 구조로 렌더링. `SidebarMenu`를 사용하여 선언적으로 관리.
- **VerseView (`VerseView.tsx`)**: 가장 복잡한 컴포넌트. 오디오 재생, 단어별 뜻(Lexicon), 다국어 번역, 주석 등을 모두 렌더링함.

## 2. 데이터 흐름 및 관리 (Data Flow)

### 데이터 구조
- `public/data.json`: 모든 수트라 데이터의 원천.
- `src/utils/dataFetcher.ts`: `data.json`을 가져와서 `Chapter` 단위로 그룹화하고 캐싱함.

### 데이터 파이프라인 (Scripts)
- `generate_data.ps1`: 텍스트 소스 파일들(`.txt`)을 읽어 `data.js`를 생성하는 PowerShell 스크립트.
- `update_dictionary.js`: `7.dan.txt`와 `1.sans.txt`를 기반으로 `data.js`의 단어 뜻과 산스크리트어 본문을 동기화하는 도구.

## 3. 주요 발견 사항 및 개선 필요점 (Key Findings)

### 레이 표준(Ray Standard) 위반 사항
- **Console 사용**: `dataFetcher.ts`, `VerseView.tsx`, `Sidebar.tsx`, `ChapterList.tsx` 등 다수의 파일에 `console.error` 및 `console.warn`이 잔존함. 즉각적인 제거 또는 커스텀 로거로 대체 필요.
- **네이밍 일관성**: `localStorage` 키에 `gita-` 접두사가 사용되고 있음 (`gita-desktop-sidebar`, `gita-show-lexicon` 등). 프로젝트 명칭인 `yoga-`로 통일 필요.

### 아키텍처 및 코드 품질
- **VerseView 로직 비대화**: `VerseView.tsx` (391라인)가 오디오 제어 로직과 대규모 UI 렌더링을 동시에 수행 중. `useAudio` 커스텀 훅 추출 및 렌더링 하위 컴포넌트(TranslationSection, AudioPlayer 등) 분리 필요.
- **중복 로직**: 장/절 내비게이션 및 수트라 범위(Verse Range) 판단 로직이 여러 곳에서 반복됨. 이를 유틸리티화 하거나 데이터 페칭 단계에서 전처리 필요.
- **타입 정의**: `src/types/index.ts`에 정의된 인터페이스들이 실제 데이터 구조와 약간의 괴리가 있거나 옵셔널 처리가 미흡함.

### UI/UX 디테일
- **다크 모드**: Tailwind 4의 `@custom-variant` 전략은 구현되었으나, 일부 컴포넌트에서 `dark:` 프리픽스가 누락되었을 가능성 존재.
- **접근성**: `ThemeToggle` 외에는 `aria-label` 등의 웹 접근성 속성이 부족함.

## 4. 최종 결론 (Conclusion)

프로젝트는 기반이 튼튼하고 디자인 감각이 뛰어남. 하지만 세부적인 코드 관리(Console 제거, 네이밍 통일)와 거대 컴포넌트의 분할이 이루어지지 않으면 유지보수 비용이 급증할 위험이 있음. 다음 페이즈에서 '지저분한 코드 정리'는 **로직 추출 및 컴포넌트 모듈화**에 집중해야 함.
