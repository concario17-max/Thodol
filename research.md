# Deep Codebase Analysis Report: Yoga Sutras Project

이 보고서는 프로젝트의 아키텍처, 데이터 흐름, 핵심 기술 스택 및 현재 발견된 기술적 과제를 깊이 있게 분석한 결과입니다.

## 1. 프로젝트 개요 (Project Overview)
본 프로젝트는 요가 수트라(Yoga Sutras) 경전을 현대적이고 프리미엄한 웹 인터페이스로 제공하는 것을 목표로 합니다. 단순한 텍스트 나열을 넘어, 산스크리트어 원문, 발음(영문/국문), 단어별 의미, 다각도의 번역 및 주해, 그리고 오디오 가이드를 통합한 지식 플랫폼입니다.

## 2. 기술 스택 (Technical Stack)
- **Frontend Core**: React 19 (Strict Mode), Vite 7
- **Styling**: Tailwind CSS v4 (Alpha/Beta급 최신 엔진), Framer Motion (애니메이션)
- **Routing**: React Router DOM v7
- **Language**: TypeScript (엄격한 타입 지향)
- **Data Pipeline**: Windows PowerShell 5.1/7 (ETL 프로세스), Node.js (보조 스크립트)
- **Testing**: Vitest, React Testing Library

## 3. 아키텍처 및 동작 원리 (Architecture & Mechanisms)

### 3.1 데이터 파이프라인 (The ETL Pipeline)
프로젝트의 심장은 루트 디렉토리에 존재하는 11개의 소스 텍스트 파일과 `generate_data.ps1` 스크립트입니다.
1. **Source Content**: `1.sans.txt` (산스크리트어), `2.english.txt` (베일리 번역), `7.dan.txt` (단어 뜻) 등 파편화된 데이터 소스.
2. **Transformation**: PowerShell 스크립트가 각 파일을 순회하며 수트라 ID(예: `1-1`)를 기반으로 하나의 거대한 JSON 객체로 병합.
3. **Mapping Strategy**: 
    - **Line Format**: ID가 행 시작에 있는 경우 (`3-1. Text`)
    - **Block Format**: ID가 단독 행에 있고 다음 행이 내용인 경우 (`1-1\nSanskrit Text`)
    - **Word-by-word Mapping**: 산스크리트어 발음 행을 공백 분리하여 `7.dan.txt`의 뜻풀이와 인덱스 기반으로 1:1 매칭.
4. **Sync**: 최종 결과물은 `public/data.json` 및 `data.js`로 출력되어 프론트엔드에서 소비.

### 3.2 프론트엔드 데이터 흐름 (Data Hydration)
1. **Fetch/Cache**: `fetchYogaData` 유틸리티가 `/data.json`을 단 한 번 로드하여 `cachedData`에 저장.
2. **Context Provider**: `UIProvider`와 `ThemeProvider`가 전역 상태(사이드바 오픈 여부, 테마 등)를 관리.
3. **Custom Hook (`useYogaData`)**: 전체 데이터를 컴포넌트가 사용하기 쉬운 형태로 가공(Chapter 그룹화) 및 특정 수트라 검색 함수 제공.
4. **Container/Presentational**: `VerseView`가 수트라 데이터를 읽어 `SutraContent`, `WordMeanings`, `TranslationSection` 등 순수 컴포넌트들에게 데이터 주입.

## 4. 핵심 컴포넌트 분석 (Core Components)
- **`AppShell.tsx`**: 전체 화면 레이아웃을 담당하며, `h-[100dvh]`와 `overflow-hidden`을 통해 앱과 같은 사용자 경험(App-like UX)을 선사.
- **`VerseView.tsx`**: 본 서비스의 메인 뷰. 오디오 제어(`useAudio`), 네비게이션(`useSutraNavigation`), 스크롤 초기화 등 비즈니스 로직을 오케스트레이션.
- **`SutraContent.tsx`**: 산스크리트어 특유의 기호(`|`, `||`, `-`)를 정규식으로 실시간 정제하여 가독성 높은 텍스트 렌더링.
- **`WordMeanings.tsx`**: 아코디언 토글 방식을 통해 산스크리트어 단어와 뜻을 1:1 대응하여 시각화.

## 5. 심층 진단: 기술 부채 및 개선 포인트 (Bottlenecks & Debts)

### 5.1 데이터 정합성 임계점 (Data Shift Issue)
현재 `generate_data.ps1`의 ID 감지 로직(`^(\d+)-(\d+)$`)은 ID가 행의 시작과 끝을 완벽히 차지할 때만 작동합니다. 하지만 `7.dan.txt` 등 실제 데이터에서는 내용 끝에 ID가 붙는 경우가 많아, 이를 놓칠 경우 이전 수트라 데이터에 누적되어 전체 매핑이 하나씩 밀리는(Shift) 현상이 발생합니다. (최근 복구된 Phase 18의 핵심 해결 과제)

### 5.2 인코딩 안정성
Windows 환경의 PowerShell 기본 인코딩은 BOM 유무에 따라 한글 깨짐(`?????`)을 유발하기 쉽습니다. 모든 I/O에 명시적인 UTF-8 처리가 강제되어야 합니다.

### 5.3 테마 토큰 동기화
Tailwind CSS v4로의 전환 과정에서 구식 변수(`--color-text-primary`)와 신규 변수(`--color-text-main`) 간의 혼용이 존재합니다. 이를 "Ray" 표준에 따라 하나의 컨벤션으로 통합하는 과정이 진행 중입니다.

## 6. 레이(Ray) 코딩 표준 준수 평가
- **Zero Monolith**: 준수함. 대부분의 로직이 800라인 이하로 분리되어 있음.
- **Immutability**: 준수함. `dataFetcher.ts` 및 State 관리에서 불변 객체 패턴 사용.
- **Meta-Design**: 매우 우수함. 골드 톤의 프리미엄 룩과 `reveal` 애니메이션이 조화롭게 적용됨.

---
**보고자**: Antigravity (Ray Persona)
**최종 업데이트**: 2026-03-16
