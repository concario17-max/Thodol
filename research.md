# 요가 UI/UX 리서치: 구절 이동 시 스크롤 상단 복귀 (Scroll-to-top) 현상 분석

## 1. 현상 파악
사용자가 하단 네비게이션(이전/다음 구절) 또는 좌측 사이드바(장/구절 목록)를 클릭해 다른 구절로 이동할 때, 스크롤이 이전 화면의 위치에 그대로 머무르는 현상이 발견됨. 

## 2. 원인 분석
`VerseView.tsx` 파일 내부에 이미 네비게이션 변경을 감지하는 `useEffect`가 존재하며, 다음과 같이 작성되어 있습니다.
```tsx
    // Reset audio on navigation
    useEffect(() => {
        window.scrollTo(0, 0);
        reset();
    }, [chapterNum, verseNum, reset]);
```
코드는 `window.scrollTo(0, 0)`를 호출하고 있으나 작동하지 않습니다. 그 이유는 **Zero Monolith 아키텍처**를 적용하면서 `AppShell.tsx`에서 전체 뷰포트를 `h-[100dvh] overflow-hidden`으로 고정시키고, 내부의 `<main>` 태그(flex-1)에 개별적으로 `overflow-y-auto` 스크롤을 적용했기 때문입니다. 즉, 현재 모던 레이아웃 환경에서는 전역 `window` 객체가 구절 콘텐츠의 스크롤을 들고 있지 않습니다.

## 3. 해결 방안 (구현 계획)
1. **스크롤 컨테이너 식별**: `AppShell.tsx`의 `<main>` 태그에 고유 식별자(ID) 부여 (예: `id="main-scroll-container"`).
2. **스크롤 초기화 타겟 변경**: `VerseView.tsx` 내부의 라우팅 감지 `useEffect`에서 `window.scrollTo` 대신, 해당 DOM 노드(`#main-scroll-container`)를 찾아서 `scrollTo(0,0)`을 실행하도록 로직을 수정.

이렇게 하면 리액트 라우터를 통한 SPA(Single 시 Application) 환경에서의 페이지간 이동 시, 스크롤 컨테이너의 최상단(산스크리트어 텍스트 위치)으로 완벽하게 이동하게 됩니다.

---

# 요가 UI/UX 리서치: Lexicon 모달 데이터 누락 및 챕터 페이지 정리 분석

## 1. 챕터 리스트 대문 - Lexicon (사전) 모달 이슈
- **현상**: 메인 화면(`ChapterList.tsx`)에서 "Lexicon" 메뉴를 클릭하면 모달 자체는 멋지게 열리지만, 안쪽에 사전 내용(단어들)이 전혀 렌더링되지 않는 빈 껍데기 상태입니다.
- **원인 분석**: `LexiconModal.tsx` 컴포넌트는 `fetch('/lexicon.json')`을 통해 데이터를 불러오도록 짜여 있습니다. 그러나 현재 프로젝트의 `public/` 폴더 내부나 전체 디렉터리를 탐색한 결과, **`lexicon.json` 원본 데이터 파일이 전면 누락(Missing)**된 상태입니다.
- **해결 방안 (대기)**: 이 기능이 정상 동작하기 위해서는 사용자님께서 `lexicon.json` 파일을 제공해 주시거나, 혹은 해당 기능(버튼) 자체를 당분간 숨기는(Hide) 조치가 필요합니다. (이번 구현 단계에서는 사용자님께 보고드리고 결정을 기다립니다.)

## 2. 챕터(구절) 뷰어 하단의 빈 코멘터리 및 구분선 제거
- **현상**: 구절 상세 페이지(`VerseView.tsx` -> `TranslationSection.tsx`) 하단에 흐리게(opacity-20) 표시되는 "Commentary" 텍스트와 구분선(`<div className="h-px w-24...">`)이 남아있어 시각적으로 혼란을 줍니다.
- **원인 분석**: 이전 작업(Phase 5)에서 코멘터리 영문 본문을 니콜라스 서튼 섹션으로 복구하면서, 구조를 유지하기 위해 기존 코멘터리 섹션을 단순히 '빈 칸(Placeholder)'으로 남겨둔 흔적입니다. 현재 우측 슬라이드 패널(`CommentarySidebar.tsx`)이 새로 생겼으므로 하단의 고정 빈 칸은 완전히 불필요해졌습니다.
- **해결 방안**: `TranslationSection.tsx`의 마지막 부분에 위치한 `{/* Empty Commentary Section */}` `<section>...</section>` 블록 컴포넌트를 코드로 주석 처리하거나 완전히 제거(Delete)합니다.

---

# 요가 UI/UX 리서치: 웹 및 모바일 반응형 최적화(Web & Mobile UI/UX Optimization) 분석 결과

현재 프로젝트 코루틴(`AppShell`, `Header`, `SidebarLayout`, `VerseView`, `ChapterList` 등)을 전반적으로 점검한 결과, 모바일과 데스크탑 간의 UI/UX 완성도를 극대화(Premium Responsive Design)하기 위한 구체적인 최적화 포인트들을 도출했습니다.

## 1. 터치 디바이스(모바일) 안전 영역 및 스크롤 최적화
- **문제점**: 모바일 기기(아이폰 하단 홈 바, 상단 노치 등)의 `safe-area`에 대한 패딩 처리가 미흡하여, 콘텐츠가 화면 끝에 너무 달라붙는 현상이 발생할 수 있습니다.
- **해결 패턴**:
  - `pb-safe`, `pt-safe` 류의 Tailwind Utility 결합 (또는 `pb-6 sm:pb-8` 등 기본 여백 강화).
  - 모바일에서 사이드바가 열려있을 때 뒷단 Content의 스크롤을 막기 위한 `touch-none` 락킹 메커니즘은 `AppShell.tsx`에 `isMobilePanelOpen` Prop으로 준비되어 있으나, 각 사이드바(`SidebarLayout`, `ReflectionsSidebar`, `CommentarySidebar`)의 Open 상태와 Context를 연동하여 완전하게 제어해야 합니다.

## 2. 폰트(글꼴) 크기의 Dynamic Scaling (반응형 타이포그래피)
- **문제점**: 구절 뷰어(`VerseView`) 내부의 산스크리트어(`text-xl sm:text-2xl`), 영문 발음 표기 등의 크기가 모바일에서는 다소 크거나, 반대로 데스크탑에서는 여백에 비해 다소 작아 보이는 등 브레이크포인트(`sm`, `md`, `lg`)별 세밀한 대응이 부족합니다.
- **해결 패턴**:
  - 모바일(기본) -> 태블릿(`sm:`) -> 데스크탑(`lg:`) 순으로 텍스트 크기 단위(rem 단위인 `text-base, lg:text-lg` 등)를 계단식으로 촘촘히 적용.
  - 특히 발음 표기(한글/영문)는 모바일 레이아웃에서 너무 길어지면 줄바꿈이 지저분해지므로 약간 작은 폰트(`text-sm sm:text-[15px]`)와 넉넉한 `leading-relaxed`를 혼합하여 가독성 확보.

## 3. 대문 페이지(ChapterList.tsx) 컴포넌트의 모바일 터치 타겟 (Tap Target)
- **문제점**: 챕터 선택을 위한 `<select>` 드롭다운 컴포넌트나, 상단의 모달 진입 텍스트 링크("Compendium", "Lexicon", "Commentaries")가 모바일에서 손가락으로 누르기에 간격(gap)이 너무 좁거나 타겟 영역이 작습니다 (Fat Finger 이슈).
- **해결 방안**:
  - 링크 요소들에 `p-2` 또는 `py-1 px-2` 이상의 패딩을 주어 실제 터치 영역을 확대.
  - 모바일에서 요소 간 `gap`을 소폭 상승 (`gap-4` 이상).
  
## 4. 모바일 하단 구절 네비게이션(SutraNavigation.tsx) 사용성
- **문제점**: 하단에 고정되거나 페이지 맨 밑에 위치하는 이전/다음 구절 이동 버튼이 모바일에서는 접근성이 약간 떨어질 수 있습니다.
- **해결 방안**: 버튼 컨테이너를 모바일 화면 너비에 꽉 차게(`w-full`) 만들거나, 플로팅 툴바로 고정하는 방안이 있으나, 현재 디자인 기조(Luxury, 여백의 미)를 해치지 않는 선에서 패딩을 늘리고 버튼의 세로 크기를 확보하는 선으로 타협.

## 5. 헤더(Header.tsx) 아이콘 축소 및 우측 패널 제어 로직 통일
- **문제점**: 모바일 화면(가로 375px 수준)에서 좌측 메뉴 햄버거 버튼과, 중앙 타이틀, 우측 테마 토글 버튼 간의 공간이 좁아 타이틀이 밀리거나 구겨질 수 있습니다.
- **해결 방안**: 
  - 모바일 전용에서는 로고 아이콘(`֍`)이나 타이틀 텍스트(`YOGA`) 중 덜 중요한 텍스트를 숨기거나 축소.
  - `max-w-[70%]` 등 컨테이너 제한 두기.
  
위 분석 내용에 따라 `plan.md`에 "Phase 11: 웹 및 모바일 UI/UX 최적화" 챕터를 신설하고 세부 할 일 목록을 정리합니다.
---

# 요가 UI/UX 리서치: 단어별 의미(Word-by-word) 토글 기능 복구 분석

## 1. 현상 파악
- **문제**: 과거에 존재했던 "단어 뜻 토글(Word-by-word toggle)" 기능이 현재 UI에서 제거된 상태임.
- **영향**: 사용자가 개별 산스크리트어 단어의 상세 의미를 파악하기 위해서는 사전(Lexicon)을 별도로 열어야 하는 번거로움이 발생.

## 2. 코드 및 데이터 분석
- **데이터 소스**: `data.js` 내의 각 sutra 객체는 `word_meanings`라는 딕셔너리 형태의 데이터를 이미 보유하고 있음.
  - 예: `{"atha": "지금 여기", "yoga": "요가, 합일..."}`
- **타입 정의**: `src/types.ts`에 `word_meanings?: WordMeaning;` 인터페이스가 정의되어 있어 데이터 구조적 준비는 완료된 상태.
- **삭제 원인 추정**: Phase 12의 "Zero Monolith" 리팩토링 및 Meta-Design 적용 과정에서 UI의 미니멀리즘을 위해 일시적으로 제거되었거나, 컴포넌트 분리 과정에서 누락된 것으로 판단됨.

## 3. 기능 원복 및 개선 설계 (Proposed Design)
- **컴포넌트 신설**: `src/components/verse/WordMeanings.tsx`를 생성하여 단일 책임을 부여.
- **UI/UX 아키텍처**:
  - **Header**: "WORD-BY-WORD" 텍스트와 Lucide-React의 `ChevronDown/Up` 아이콘 결합.
  - **Interaction**: 클릭 시 Framer Motion 또는 CSS `grid-template-rows` 애니메이션을 이용한 부드러운 아코디언 토글 구현.
  - **Aesthetics**: `glass-panel` 스타일을 적용하고, 단어와 뜻 사이에 Deep Gold 색상의 구분선을 배치하여 Meta-Design 무드 유지.
- **배치**: `VerseView.tsx`에서 `SutraContent`와 `AudioPlayer` 사이에 배치하여 콘텐츠 읽기 흐름을 자연스럽게 유도.

## 4. 구현 가이드라인
- `any` 또는 `unknown` 타입 사용 금지 (Strict Typing).
- `typecheck` 및 `test`를 통한 정합성 검증 필수.
- 반응형 레이아웃 대응: 모바일에서는 2열 배치를 1열로 전환하여 가독성 확보.
