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

이렇게 하면 리액트 라우터를 통한 SPA(Single Page Application) 환경에서의 페이지간 이동 시, 스크롤 컨테이너의 최상단(산스크리트어 텍스트 위치)으로 완벽하게 이동하게 됩니다.
