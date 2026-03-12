# 요가 프로젝트 고도화 구현 계획 (Todo List)

이 계획은 `research.md`의 데이터 필드 분석과 기호 정제 전략을 바탕으로 작성된 구체적인 "실행 예정" 목록입니다. 사용자의 승인 전까지는 코드에 구현하지 않습니다.

## Phase 1: 한글 발음 데이터 필드 오류 수정 및 위치 배치
- [x] **데이터 바인딩 수정 (`VerseView.tsx`)**
    - `SutraContent` 컴포넌트로 전달하는 `pronunciationKr` prop의 참조값을 `verseData.pronunciation_kr` 에서 `verseData['4.han bal']` 로 변경 명시.
- [x] **레이아웃 계층 조정 (`SutraContent.tsx`)**
    - 영어 발음(`<p className="...">{pronunciation}</p>`) 섹션 바로 아래에 한글 발음 섹션이 출력되도록 HTML 마크업 순서 및 마진(Margin) 조절.

## Phase 2: 발음 텍스트 기호 정제 로직 구현
- [x] **영어 발음 정제 (`SutraContent.tsx`)**
    - `pronunciation` 문자열에서 `|` 와 `||` 기호를 찾아내는 정규 표현식(`/\|/g`) 적용.
    - 해당 기호들을 빈 문자열(`''`) 로 완전히 치환하여 깔끔한 영문 텍스트 생성.
- [x] **한글 발음 정제 (`SutraContent.tsx`)**
    - `pronunciationKr` 문자열에서 `-` 기호와 `｜` 기호를 찾아내는 정규 표현식(`/-/g` 및 `/｜/g`) 적용.
    - 호흡 기호들을 걷어내고, 빈 문자열 혹 띄어쓰기로 완전히 치환하여 자연스러운 한글 발음 표기화.

## Phase 3: 최종 검증 및 배포 준비
- [ ] **디자인 호환성 검토**
    - 기호가 제거된 문장이 긴 구절에서도 텍스트 정렬(`text-center`)과 줄바꿈(`break-keep`) 등에서 레이아웃을 해치지 않는지 브라우저 상 확인.
- [ ] **오토 커밋 및 푸시**
    - 구현 및 검증 완료 후, 원격 레포지토리(`main` 브랜치)로 자동 커밋 & 푸시 진행.

## Phase 4: 번역 및 주해 섹션 UI 레이아웃 개편
- [x] **섹션 순서 재배치 (`TranslationSection.tsx`)**
    - 앨리스 A. 베일리 -> 니콜라스 서튼 -> 배철현 -> Commentary (빈 칸) 순서로 렌더링 순서 변경.
- [x] **니콜라스 서튼 섹션 내 언어 배치 변경**
    - 기존 한글 번역 단일 노출에서, 영어(기존 Commentary 내용)를 먼저 상단에 배치하고, 그 아래에 한글 번역을 배치하도록 내부 마크업 수정.
- [x] **폰트 색상(Color) 통일 및 조정**
    - 배철현 타이틀의 색상을 니콜라스 서튼과 동일하게(`text-gold-primary dark:text-gold-light`) 변경.
    - 직역, 의역 소제목의 색상을 기존 배철현 타이틀 색상이었던 `text-gold-muted` 계열로 변경하여 계층 구조 시각화.
- [x] **Commentary 섹션 비우기**
    - 기존 데이터를 출력하던 부분을 제거하고 빈 템플릿(타이틀과 여백만 존재하는 형태)으로 유지.

## Phase 5: 번역 텍스트 가독성 및 디자인 완전 통일
- [x] **가독성 높은 폰트로 변경 (`TranslationSection.tsx`)**
    - 기존의 장식적인 `font-noto-kr`(명조체 계열) 및 얇은 `font-inter`를 제거.
    - 장문 읽기에 최적화된 기본 `font-sans` (기본값 설정된 Pretendard/system-ui 등 고딕 계열) 폰트로 클래스 일괄 변경.
- [x] **영어 번역 텍스트 스타일 통일**
    - 앨리스 A. 베일리와 니콜라스 서튼의 영어 본문 폰트 크기 및 색상을 완전 통일.
    - 적용 클래스: `text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary font-sans text-center`
- [x] **한글 번역 텍스트 스타일 통일**
    - 앨리스 A. 베일리, 니콜라스 서튼, 배철현(직역/의역)의 모든 한글 본문 폰트 크기 및 색상을 완전 통일.
    - 적용 클래스: `text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary font-sans text-center break-keep`
- [x] **배철현 직역/의역 소제목 크기 확대**
    - 기존 `text-[10px]` 였던 "직역", "의역" 소제목을 1포인트(1px) 키워 가독성 향상.
    - 적용 클래스: `text-[11px]`

## Phase 6: 추가 UI 디테일 정제 (가독성 최적화)
- [x] **배철현 소제목 폰트 변경 (`TranslationSection.tsx`)**
    - "직역", "의역" 소제목에 가독성이 높은 기본 고딕 폰트 (`font-sans`) 클래스 추가.
- [x] **앨리스 A. 베일리 번역 구분선 제거 (`TranslationSection.tsx`)**
    - 영어 본문과 한글 본문 사이에 있던 상단 테두리 선 제거.
    - 한글 번역(`korean1`) 문단의 `border-t`, `border-gold-primary/10`, `pt-6` 클래스 속성 삭제 (여백 자연스럽게 연결).

## Phase 7: 산스크리트어 색상 디자인 정제 (진중한 톤)
- [x] **산스크리트어 텍스트 색상 변경 (`SutraContent.tsx`)**
    - 기존의 갈색톤(`text-[#8C3A3A] dark:text-[#E8A586]`) 요소 식별.
    - 앨리스 A. 베일리 등 메인 골드(`text-gold-primary`)를 바탕으로 하되, 경전의 무게감을 위해 "더 깊고 진중한" 톤으로 디자인 조정.
    - 라이트 모드: `text-[#8B6508]` (Deep Gold/Primary Dark 계열)
    - 다크 모드: `dark:text-[#B8860B]` (시인성을 고려한 Gold Primary 계열)

## Phase 8: 레이아웃 토글 제어 및 코멘터리 동적 확장
- [x] **전역 상태 개편 (`UIContext.tsx`)**
    - 우측 패널의 상태를 관리하기 위해 기존의 boolean 기반 상태(`isReflectionsOpen`)를 `'reflections' | 'commentary' | null` 형태의 Union 상태(`activeRightPanel`, `activeDesktopRightPanel`)로 확장 및 전환.
- [x] **헤더(Header) 토글 버튼 배치 (`Header.tsx`, `App.tsx`)**
    - 좌측 상단: 기존 `Menu` 버튼을 활성화(`showSidebarToggle={true}`)하여 Chapter 패널 토글 기능 연동.
    - 우측 상단: `Edit3`(통찰 기록), `MessageSquare`(코멘터리) 아이콘 2개를 배치하여 우측 패널 모드 스위칭 연동.
- [x] **코멘터리 패널 컴포넌트 생성 및 반영 (`CommentarySidebar.tsx`, `App.tsx`)**
    - `Reflections.tsx`와 유사한 틀의 `CommentarySidebar.tsx` 가짜(Placeholder) 컴포넌트 생성.
    - `App.tsx`의 `rightPanel` 영역에서 현재 활성화된 상태(`activeDesktopRightPanel`)에 따라 `Reflections` 또는 `CommentarySidebar`를 조건부 렌더링하도록 래퍼 스크립트 적용.
- [x] **코멘터리 동적 확장 로직 구현 (`CommentarySidebar.tsx`)**
    - Context에서 `isDesktopSidebarOpen` 값을 읽어와, **좌측 Chapter 패널이 닫혀 있을 때** 자신의 너비(`className`)를 `lg:w-[400px]`에서 `lg:w-[720px]`로 동적으로 넓히는 레이아웃 로직 구현.

## Phase 9: 구절 이동 시 스크롤 상단(스크롤 초기화) 자동 복귀 기능
- [x] **스크롤 컨테이너 식별자 추가 (`AppShell.tsx`)**
    - `AppShell.tsx` 안의 실제 스크롤을 담당하는 `<main>` 엘리먼트에 `id="main-scroll-container"` 속성 부여.
- [x] **페이지/구절 이동 시 스크롤 초기화 타겟 변경 (`VerseView.tsx`)**
    - 기존의 동작불가 코드인 `window.scrollTo(0,0);`를 삭제.
    - 컴포넌트 마운트 및 라우팅 파라미터(`chapterNum`, `verseNum`) 변경 시, `document.getElementById('main-scroll-container')`를 찾아 하위 콘텐츠 스크롤을 `0`으로 올려주는 로직 적용.

## Phase 10: 구절 뷰어 하단 잔재(Commentary Placeholder) 제거 및 Lexicon 데이터 복구
- [x] **구절 페이지 통번역 섹션 정리 (`TranslationSection.tsx`)**
    - 파일 하단의 `<section className="mb-12 opacity-20">` 에 해당하는 `{/* Empty Commentary Section */}` UI 블록과 하단 구분선(`<div className="h-px w-24..."/>`) 코드를 컴포넌트 렌더링에서 완전히 삭제.
- [x] **Lexicon 기능 정상화 (`public/lexicon.json`)**
    - 제공된 `11. Lexicon.txt` 데이터를 파싱하여 A-Z 알파벳 기준으로 그룹핑한 `lexicon.json` 파일을 `public` 디렉터리에 성공적으로 컴파일 및 배치 완료.

## Phase 11: 웹 및 모바일 UI/UX 반응형 종합 최적화 (Web & Mobile Optimization)
- [x] **1단계: 터치 타겟(Tap Target) 및 모바일 간격 확보**
    - `ChapterList.tsx`: 대문 페이지의 "Compendium, Lexicon, Commentaries" 텍스트 링크에 상하좌우 패딩(padding)을 추가하여 모바일 오터치(Fat-finger) 방지 및 간격 확대.
    - `Header.tsx`: 모바일 너비(sm 미만)에서 타이틀과 좌우 버튼들이 겹치지 않도록 flex 레이아웃 비율 또는 폰트 크기 조정 (`text-lg` -> `text-base md:text-lg`).
- [x] **2단계: 반응형 타이포그래피 및 가독성 (VerseView 단위)**
    - `SutraContent.tsx`: 산스크리트어와 발음(English/Korean)의 모바일-데스크탑 스케일링 간극 완화. (예: `text-xl sm:text-2xl md:text-3xl`).
    - `TranslationSection.tsx`: 텍스트 단락들의 좌우 여백(`px-4 sm:px-0`) 및 줄간격 배치를 모바일에서도 눈이 편안하도록 조정.
- [x] **3단계: AppShell 및 사이드바 화면 락킹 연동**
    - 좌/우측 사이드바(Sidebar, Reflections, Commentary)가 모바일(화면 폭 좁은 상태)에서 열렸을 때, 백그라운드의 본문이 같이 스크롤되지 않도록 `AppShell.tsx`의 `isMobilePanelOpen` 상태 제어를 `UIContext`와 연동하여 완벽한 모달식(Overlay) 처리 적용.
- [x] **4단계: 하단 네비게이션 패딩 최적화**
    - `SutraNavigation.tsx`: 하단 이전/다음 구절 버튼의 터치 편의성을 위해 버튼의 여백 확보 및 아이콘 정렬 개선.

---
**주의**: 사용자(Ray)의 명시적인 "구현 시작" 지시가 있기 전까지는 어떠한 코드도 수정하지 않습니다.
