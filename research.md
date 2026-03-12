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
