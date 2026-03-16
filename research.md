# 요가 프로젝트(Yoga Sutras) 기술 및 아키텍처 상세 분석 보고서

## 1. 개요 (Overview)
본 프로젝트는 고전인 '요가 수트라'를 현대적인 감각의 하이엔드 웹 환경으로 재해석한 플랫폼입니다. React 19와 Vite 7, Tailwind 4 등 최신 기술 스택을 기반으로 하며, "Ray Standard"라는 엄격한 코딩 규준과 Meta-Design 철학을 따르고 있습니다.

## 2. 기술 스택 (Technology Stack)
- **Core**: React 19 (Hooks, Suspense, Lazy Loading)
- **Tooling**: Vite 7, TypeScript, Vitest (TDD 인프라)
- **Styling**: Tailwind CSS 4 (Selector-based Dark Mode, CSS Variable Tokens)
- **Animation**: Framer Motion (Reveal 효과, 부드러운 트랜지션)
- **Icons**: Lucide-React
- **Persistence**: LocalStorage (인증, 사용자 세팅, 통찰 기록)

## 3. 핵심 아키텍처 (Architecture)

### A. Zero Monolith & Modular Design
- **레이아웃 분리**: `AppShell`, `SidebarLayout` 등 구조적 틀을 담당하는 컴포넌트를 분리하여 비즈니스 로직과의 결합도를 낮춤.
- **모듈화**: 기능별(verse, ui) 컴포넌트 분리 및 관심사 분리(SoC)를 철저히 이행. 파일당 800라인, 함수당 50라인 제한 규준 준수.

### B. 데이터 흐름 (Data Flow)
1. **정적 데이터 소스**: `public/*.json` 파일에 경전 데이터 및 사전(Lexicon) 데이터가 저장됨.
2. **Data Fetcher**: `dataFetcher.ts`에서 데이터를 로드하고 런타임에서 정규화(Normalization, 예: 객체->배열 변환)를 수행.
3. **Custom Hooks**: `useYogaData`를 통해 전역적으로 데이터를 공급하며, `useAudio`, `useSutraNavigation` 등을 통해 기능별 로직을 캡슐화함.

### C. 상태 관리 (State Management)
- **UIContext**: 전역 Context API를 사용하여 반응형 사이드바, 우측 패널(Reflections, Commentary)의 상태를 통합 관리.
- **Responsive Logic**: 데스크탑(고정/확장)과 모바일(드로워/오버레이)에 최적화된 동적 레이아웃 로직 구현.

## 4. 디자인 및 사용자 인터랙션 (Design & Interaction)

### A. Meta-Design 가이드라인
- **색상 체계**: Deep Gold (#B8860B)와 Anthracite Dark (#0A0A0A)를 기조로 한 럭셔리한 테마.
- **시각 효과**: Glassmorphism (`glass-panel`), Radial Gradient 스포트라이트 배경, 미세한 조작 피드백(Scale/Color transition).
- **타이포그래피**: 고전미와 현대미의 조화 (`Crimson Pro` 세리프와 `Inter` 산세리프, `Noto Sans KR` 사용).

### B. 주요 기능 인터랙션
- **Sutra Viewer**: 산스크리트어 원문, 다국어 발음, 단어별 해석, 다각도 번역(베일리, 서튼, 배철현) 노출.
- **Audio Integration**: 구절별 오디오 파일 연동 및 커스텀 플레이어 UI.
- **Reflections (통찰 기록)**: 사용자의 개인적 통찰을 기록하고 개별 또는 전체 내보내기(Export) 기능 제공.
- **Password Gateway**: 프로젝트의 신성함과 프라이버시를 상징하는 테마형 진입 장벽.

## 5. 코딩 표준 (Ray Standard Compliance)
- **Purity**: 모든 상태 업데이트는 불변성(Immutability)을 유지하며 스프레드 연산자를 활용.
- **Efficiency**: `React.memo` 및 `useCallback`을 적극 활용하여 불필요한 리렌더링 방지.
- **Cleanliness**: 모든 `console.log` 및 불필요한 주석 제거, 명확한 타입 정의(Type safety).
- **TDD**: Vitest를 통한 핵심 비즈니스 로직의 단위 테스트 및 통합 테스트 구조 확보.

## 6. 결론
본 프로젝트는 높은 수준의 코드 무결성과 예술적인 UI를 동시에 추구하는 시각적/기능적 완성도가 매우 높은 수준의 웹 애플리케이션입니다. 특히 데이터의 정규화와 레이아웃의 유연한 대응 방식은 복잡한 텍스트 기반 콘텐츠를 처리하는 데 있어 최적의 사례를 보여줍니다.

---
보고자: Antigravity (Advanced Agentic Coding Team)
날짜: 2026-03-16
