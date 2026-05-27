# Repository Research
Updated: 2026-05-27
Workspace: `C:\Users\roadsea\Desktop\gita-1`

## 한 줄 요약

이 저장소는 React 19 + Vite 기반의 요가 수트라 읽기 앱이다. 홈에서 장과 절을 고르고, 본문 페이지에서 산스크리트 원문, 발음, 번역, 단어 의미, 오디오, 해설, 그리고 학습만화 이미지를 함께 본다. 상태는 `ThemeContext`, `UIContext`, `YogaDataContext`로 나뉘고, 데이터는 `/data.json`을 기준으로 로드된다.

## 전체 구조

활성 코드의 중심은 `src/`다.

- `src/main.tsx`: provider 체인을 조립하는 시작점
- `src/App.tsx`: 라우팅과 공통 레이아웃을 정의하는 상위 컴포넌트
- `src/pages/ChapterList.tsx`: 홈/챕터 진입 페이지
- `src/pages/VerseView.tsx`: 실제 수트라 읽기 페이지
- `src/components/`: 헤더, 사이드바, 모달, verse 전용 서브컴포넌트
- `src/context/`: 테마, UI, 데이터 공유 상태
- `src/utils/`: 데이터 로딩, 범위 계산, 네비게이션 계산
- `src/data/`: 챕터별 해설 블록
- `src/assets/learning-comic/`: chapter 1~4 학습만화 PNG 묶음

루트 문서도 현재 앱 이해에 꽤 중요하다.

- `README.md`: 현재 사용자용 개요
- `plan.md`: 과거 리메디에이션 기록
- `research.md`: 지금 보고서
- `scripts/README.md`: 데이터 생성과 QA 스크립트 설명

## 부트스트랩과 provider 순서

`src/main.tsx`는 렌더링 전에 provider를 아래 순서로 감싼다.

1. `ThemeProvider`
2. `UIProvider`
3. `YogaDataProvider`
4. `App`

이 순서가 중요한 이유는 다음과 같다.

- 테마는 전역 클래스 토글과 `localStorage` 동기화가 필요하다.
- UI 상태는 모바일/데스크톱 패널 상태를 공통으로 관리해야 한다.
- 수트라 데이터는 앱 전체에서 재사용되므로 한 번만 fetch하고 공유하는 구조가 맞다.

## 라우팅과 공통 셸

`src/App.tsx`는 `react-router-dom`으로 두 개의 라우트만 둔다.

- `/`
- `/chapter/:chapterNum/verse/:verseNum`

둘 다 `MainLayout`을 공유하고, `MainLayout`이 현재 경로를 보고 verse 페이지인지 아닌지 판별한다.

### verse 페이지일 때

`MainLayout`은 다음을 함께 조립한다.

- `Header`
- 왼쪽 `Sidebar`
- 필요할 때만 오른쪽 `CommentarySidebar`
- `AppShell` 내부의 `main#main-scroll-container`

### 홈일 때

홈은 verse 셸을 쓰지 않고, `ThemeToggle`만 floating action으로 둔다.

### route 진입 보정

`DefaultVerseRedirect`는 데이터 로딩이 끝나면 첫 chapter 첫 sutra로 보낸다.

- 첫 chapter를 `chapters[0]`에서 찾는다.
- 첫 sutra는 `firstChapter.sutras[0]`에서 찾는다.
- route는 `/chapter/{chapter}/verse/{verse}` 형태로 만든다.

## 공통 셸과 사이드바 레이아웃

### `AppShell`

`src/components/ui/AppShell.tsx`는 화면 전체 프레임이다.

- `100dvh` 전체 높이를 잡는다.
- 배경 레이어와 중심 컨테이너를 구성한다.
- header slot, sidebar slot, rightPanel slot, main 콘텐츠 slot을 배치한다.
- 필요 시 floating action 버튼을 오른쪽 아래에 띄운다.

verse 화면에서는 desktop 그리드도 함께 지원한다.

### `SidebarLayout`

`src/components/ui/SidebarLayout.tsx`는 좌/우 drawer 공용 래퍼다.

- 모바일에서는 drawer처럼 보이게 한다.
- 데스크톱에서는 sticky panel처럼 보이게 한다.
- left/right 배치 차이를 `position`으로 나눈다.
- 닫힘 상태에서 translate 잔상이 남지 않도록 width/opacity 중심으로 접는다.

즉, 모바일 drawer와 데스크톱 패널을 하나의 컴포넌트로 묶되, 상태 표현은 분리한 셈이다.

## 전역 상태

### `ThemeContext`

`src/context/ThemeContext.tsx`는 `light` / `dark`만 다룬다.

- 초기값은 `localStorage.theme`
- 없으면 `light`
- theme가 바뀌면 `document.documentElement.classList`에 반영

### `UIContext`

`src/context/UIContext.tsx`는 앱의 패널 상태를 분리해서 관리한다.

- `isSidebarOpen`: 모바일 왼쪽 drawer
- `isDesktopSidebarOpen`: 데스크톱 왼쪽 rail
- `activeRightPanel`: 모바일 오른쪽 drawer
- `activeDesktopRightPanel`: 데스크톱 오른쪽 panel
- `activeVerseContentMode`: verse 본문 vs commentary 모드

여기서 중요한 건 모바일과 데스크톱 상태가 완전히 같은 상태값이 아니라는 점이다.

- 모바일은 route 이동 시 임시 drawer를 닫는 쪽에 가깝다.
- 데스크톱은 `localStorage`에 저장해서 유지한다.

저장 키는 다음이다.

- `yoga-verse-content-mode`
- `yoga-desktop-sidebar`
- `yoga-desktop-right-panel`

### `YogaDataContext`

`src/context/YogaDataContext.tsx`는 데이터 로딩 결과를 앱 전체에 퍼뜨린다.

노출 값:

- `allChapters`
- `chapters`
- `loading`
- `error`
- `getVerseInRange`
- `getVerseRangeLabel`

fetch가 실패하면 그냥 빈 객체로 숨기지 않고 `error`를 노출한다.

## 데이터 모델

`src/types.ts`가 기본 타입 정의다.

- `YogaSutra`
- `YogaChapter`
- `ChapterMeta`
- `WordMeaning`

핵심은 `YogaSutra`가 단순 원문만 갖는 게 아니라는 점이다.

- 산스크리트 원문
- 발음
- 한국어 발음 표기
- 영어/한국어 번역
- 배역/옥스퍼드 번역
- 단어별 의미
- 토큰/compound token 확장 필드

즉, 이 앱은 "한 줄 텍스트 뷰어"가 아니라 여러 연구 레이어를 얹는 구조다.

## 데이터 로딩과 정규화

`src/utils/dataFetcher.ts`가 런타임 데이터의 핵심이다.

동작 순서:

1. `/data.json` fetch
2. raw sutra row를 `RawSutra`로 읽음
3. chapter 번호로 그룹화
4. `YOGA_CHAPTERS_META`를 metadata로 주입
5. sutra를 숫자 기준으로 정렬
6. chapter별 `sutraCount` 계산
7. 성공 결과를 메모이제이션 캐시로 저장

정규화 시 하는 일도 중요하다.

- `word_meanings`는 `Record<string, string>`에서 배열 형태로 바꾼다.
- `4.han bal`이 있으면 `pronunciation_kr`에 우선 반영한다.
- 영어/한국어 번역 필드는 원본 키 이름을 유지한 채 전달한다.

실제 데이터는 빌드 산출물 기준으로 다음 규모다.

- chapter 1: 51개
- chapter 2: 55개
- chapter 3: 55개
- chapter 4: 34개
- 총 195개 sutra

### 중요한 불일치

소스 트리의 `public/` 목록에는 `data.json`이 보이지 않았지만, `dist/data.json`은 존재한다.

즉, 현재 상태에서는 다음을 구분해서 봐야 한다.

- source/dev 관점: `public/data.json`이 있어야 dev server가 `/data.json`을 서빙한다
- build 관점: `dist/data.json`은 생성되어 있다

이건 단순한 파일 한 개가 아니라, dev 루트와 배포 루트의 동기화 여부를 확인해야 한다는 뜻이다.

## 범위 계산과 내비게이션

### `yogaData.ts`

`src/utils/yogaData.ts`는 chapter 배열 정렬과 verse 범위 조회를 처리한다.

- `getChapterArray`: Record를 chapter 순으로 정렬한 배열로 바꾼다.
- `getVerseInRangeFromChapters`: `1.1`, `1.2`, `1.3-1.4` 같은 범위 표시를 실제 owner sutra로 매핑한다.
- `getVerseRangeText`: 화면에 보여줄 range label을 만든다.

이 구현 덕분에 route가 `verse/2`라고 와도 실제 owner sutra가 `1.1`일 수 있다.

### `sutraNavigation.ts`

`src/utils/sutraNavigation.ts`는 이전/다음 sutra를 계산한다.

- 같은 chapter 안에서 앞/뒤로 움직인다.
- chapter 시작/끝에 도달하면 앞/뒤 chapter로 넘어간다.
- 더 이상 갈 곳이 없으면 `null`을 반환한다.

이 로직은 verse 페이지의 prev/next 버튼과 직접 연결된다.

## 홈 페이지

`src/pages/ChapterList.tsx`는 앱의 진입 페이지다.

주요 요소:

- 큰 타이틀 `YOGA SUTRAS`
- `Compendium` 모달 트리거
- `Lexicon` 모달 트리거
- chapter select
- verse select
- chapter cards

동작:

- chapter를 고르면 verse select가 활성화된다.
- verse를 고르면 `/chapter/{chapter}/verse/{verse}`로 이동한다.
- 각 chapter card는 `GlassCard`로 렌더링된다.

### `GlassCard`

`src/components/ui/GlassCard.tsx`는 홈의 카드 컴포넌트다.

- `href`가 있으면 `Link`
- 없으면 `button`
- icon, subtitle, title, description을 공통으로 처리
- 상단 spotlight gradient와 blur/opacity 효과를 넣는다

## Verse 페이지

`src/pages/VerseView.tsx`가 실제 본문 페이지의 중심이다.

### 의존 상태

- `useYogaData()`: 데이터
- `useAudio()`: 오디오 재생 상태
- `useSutraNavigation()`: prev/next
- `useUI()`: body/commentary 모드
- `useNavigate()`: route 보정

### route 보정

현재 route로 들어온 verse가 range owner와 다르면 다시 맞춘다.

예를 들면:

- user가 `verse/2`로 들어왔는데
- 실제 owner가 `1.1`이면
- `replace: true`로 canonical route로 이동한다

### 스크롤/오디오 리셋

chapter 또는 verse가 바뀌면:

- `main#main-scroll-container`를 맨 위로 스크롤
- 오디오를 `reset()`

### body vs commentary mode

전역 UI 상태인 `activeVerseContentMode`가 본문 레이아웃을 나눈다.

- `body`면 산스크리트, 단어 의미, 오디오, 번역을 렌더링
- `commentary`면 commentary/comic 전용 뷰를 렌더링

이 모드는 `Header`의 토글 버튼으로 바뀐다.

### 본문 구성

body mode에서 렌더되는 블록:

- `SutraContent`
- `WordMeanings`
- `AudioPlayer`
- `TranslationSection`

#### `SutraContent`

- 산스크리트 본문
- 발음
- 한국어 발음 표기

#### `WordMeanings`

- `meanings`가 있을 때만 보인다
- 접이식 accordion 형태
- 단어별 의미에서 etymology 구분자를 잘라 보여준다

#### `AudioPlayer`

`src/hooks/useAudio.ts`를 통해 아래를 관리한다.

- play/pause
- current time
- duration
- progress percent
- seek
- playback error

오디오 파일은 `/mp3/{chapter}-{sutra}.mp3` 패턴으로 붙는다.

#### `TranslationSection`

두 계열 번역을 함께 보여준다.

- Oxford translation
- Baejik / Baeuu

둘 다 없으면 섹션을 아예 렌더하지 않는다.

### commentary/comic 뷰

`VerseView.tsx` 안의 `CommentaryContent`는 두 모드를 가진다.

- `commentary`
- `comic`

기본값은 `comic`이고, chapter/verse가 바뀌면 다시 `comic`으로 돌아간다.

토글 버튼은 `Image` 아이콘을 쓴다.

이 뷰의 핵심은 다음이다.

- commentary 텍스트를 보여줄 수 있다
- 학습만화 PNG를 chapter/verse에 맞춰 보여줄 수 있다
- chapter 1~4만 이미지 맵이 잡혀 있다

학습만화 자산은 `import.meta.glob()`으로 정적 탐색된다.

- `src/assets/learning-comic/chapter-1/*.png`
- `src/assets/learning-comic/chapter-2/*.png`
- `src/assets/learning-comic/chapter-3/*.png`
- `src/assets/learning-comic/chapter-4/*.png`

정리하면, verse 페이지는 단순 본문 화면이 아니라

1. 본문 읽기
2. 오디오
3. 번역 비교
4. 해설 보기
5. 학습만화 보기

를 한 화면 안에서 전환하는 구조다.

## 오른쪽 해설 패널

`src/components/CommentarySidebar.tsx`는 별도의 우측 drawer다.

### 상태 분기

- 모바일: `activeRightPanel === 'commentary'`
- 데스크톱: `activeDesktopRightPanel === 'commentary'`

### 콘텐츠 선택

chapter별 commentary map을 고른 다음, key를 계산한다.

- chapter 1, 4: `${chapterNum}.${verseNum}`
- chapter 2, 3: `verseNum`

이 차이는 소스 comment 구조가 chapter마다 다르다는 뜻이다.

### 렌더링 방식

해설 블록은 `CommentaryBlock` 구조를 따른다.

- `title`
- `paragraphs`
- `bullets`
- `table`

테이블은 grid로, 불릿은 숫자형 항목을 감지해서 `1.` 같은 marker를 붙여 렌더링한다.

비어 있으면 "No commentary" fallback이 나온다.

### 상단 아이콘

해설 패널 상단에는 `SquareArrowOutUpRight` 아이콘이 들어간다.

이건 패널 자체를 "외부로 빠지는 참고 패널"처럼 보이게 하는 장치다.

## 헤더와 좌측 사이드바

### `Header`

`src/components/Header.tsx`는 데스크톱/모바일에 따라 다른 레이아웃을 가진다.

- 모바일에서는 title/link + selection controls + verse mode toggle
- 데스크톱에서는 column grid에 맞춘 좌우 정렬

verse 페이지에서만 `showSidebarToggle`가 켜지고, 그때 `getDesktopVerseColumns()`를 써서 grid column을 맞춘다.

verse mode 토글의 라벨은 다음이다.

- 해설
- 심화

아이콘은 각각 `ScrollText`, `BookOpenText`다.

### `Sidebar`

`src/components/Sidebar.tsx`는 왼쪽 reading guide 패널이다.

- 현재 chapter / verse의 메타를 보여준다
- English/Korean 본문 일부를 보여준다
- chapter/verse의 시각적 마커를 크게 강조한다

데이터가 없거나 로딩 중이면 스피너가 나온다.

## 스타일 시스템

`src/index.css`가 전체 톤을 결정한다.

핵심 요소:

- Tailwind v4 `@theme` 사용
- gold / shell / dark 계열 색상 토큰
- `SUIT`, `Cormorant Garamond` 기반 폰트 토큰
- 부드러운 radial + linear gradient 배경
- 공통 custom scrollbar
- 전체 transition 기본값

이 앱의 시각 언어는 꽤 일관적이다.

- 따뜻한 베이지/골드 계열
- 블러와 글래스 재질
- 과한 평면 UI보다 종이/아카이브 느낌

## 테스트와 검증

코드베이스에는 다음 테스트가 있다.

- `src/utils/dataFetcher.test.ts`
- `src/utils/yogaData.test.ts`
- `src/utils/sutraNavigation.test.ts`
- `src/components/ui/desktopVerseLayout.test.ts`

검증 범위는 꽤 분명하다.

- loader가 데이터를 잘 묶는지
- 범위 계산이 맞는지
- prev/next 이동이 맞는지
- desktop verse columns가 상태별로 맞는지

`scripts/browser_smoke.mjs`도 있지만, 현재 소스와 selector/marker 기준이 완전히 맞물려 있는지는 의심스럽다.

내가 코드에서 찾은 바로는:

- 현재 source UI에는 `#chapter-picker`, `#verse-picker` id가 보이지 않는다
- 스모크는 여전히 그 selector를 찾는다
- 스모크는 `Word-by-word`, `3.9` 같은 마커를 기대하지만 현재 본문 UI의 텍스트 구조와는 어긋나 보인다

이건 실제 실행 검증을 다시 맞춰야 할 가능성이 높다는 뜻이다.

## 데이터/문서 자산

### `public/`

확인된 런타임 자산:

- `lexicon.json`
- `gita.json`
- `mp3/`

`lexicon.json`은 알파벳 섹션별 단어 목록이고, 현재 대략 21개 문자 섹션에 4119개 항목이 있다.

### `gita.json`

`public/gita.json`은 상당히 큰 JSON이고, 내부에 `commentary_en` 같은 필드가 들어간다.

하지만 활성 코드에서는 이 파일을 직접 읽지 않는다.

즉, 현재 상태에서는 legacy/alternate data blob에 가깝다.

### `data-source/`

여기에는 원문 텍스트와 중간 산출물이 있다.

- `1.sans.txt`
- `2.english.txt`
- `3.korean-1.txt`
- `4.han bal.txt`
- `5.bae_jik.txt`
- `6.bae_uu.txt`
- `7.dan.txt`
- `8. ox.txt`
- `9. ox-en.txt`
- `10.sogae.txt`
- `11. Lexicon.txt`
- `han-json/`

이 폴더는 사실상 생성 파이프라인의 원천이다.

### `scripts/`

문서와 스크립트가 말하는 파이프라인은 이렇다.

- `generate_data.ps1`: source text를 읽어 `data.js`와 `public/data.json` 생성
- `merge_tokens.ps1`: token mapping 병합
- `update_dictionary.ps1` / `.cjs`: dictionary update
- `check_audio_mismatch.cjs`: 데이터와 mp3 정합성 검사
- `verify_data.cjs`, `verify_phase19.ps1`: integrity 검사
- `browser_smoke.mjs`: Playwright smoke test

`scripts/README.md`는 이 흐름을 비교적 직접적으로 설명한다.

## 문서 상태

### `README.md`

현재 앱 설명과 배포/개발 방법을 비교적 잘 적어놨다.

특히 다음이 유용하다.

- app이 static build라는 점
- `YogaDataProvider`가 데이터 접근을 중앙화한다는 점
- verse 페이지에서 좌/우 패널이 분리된다는 점

### `plan.md`

전체적으로는 `completed`로 표시되어 있지만, 맨 아래에 chapter 4 commentary import checklist가 아직 남아 있다.

이건 코드와 문서가 완전히 같은 시점의 상태를 반영하지 않는다는 신호다.

### `research.md`

이 파일 자체가 현재의 심층 아키텍처 보고서가 된다.

## 내가 본 핵심 동작 정리

이 앱은 단순한 읽기 뷰어가 아니다. 내부적으로는 다음이 동시에 돌아간다.

- route 기반 canonical verse 정렬
- chapter/verse 범위 매핑
- 오디오 재생 상태
- body/commentary mode 전환
- 모바일 drawer와 데스크톱 rail의 상태 분리
- chapter select / verse select / quick nav
- 학습만화 이미지와 commentary 텍스트의 전환

즉, 핵심 UX는 "한 수트라를 읽는다"가 아니라

> 장을 고르고, 범위를 맞추고, 본문과 해설과 만화를 서로 전환하면서, 오디오와 번역까지 한 화면에서 엮어 읽는다

에 가깝다.

## 남는 리스크와 메모

- source tree 기준으로 `/data.json`의 존재 여부를 다시 맞춰봐야 한다. `dist/`에는 있지만 `public/` 목록에는 보이지 않았다.
- `scripts/browser_smoke.mjs`는 현재 UI와 selector 기준이 어긋난 흔적이 있다. 스모크 신뢰도를 높이려면 현재 DOM 구조에 맞춰 다시 묶는 게 좋다.
- `public/gita.json`은 크고 내용도 풍부하지만, 활성 경로에서 안 쓰이는 것 같다. 유지 비용만 남길 수 있다.
- `plan.md`의 chapter 4 commentary 섹션은 현재 코드와 완전히 동기화된 상태로 보이진 않는다.

## 결론

현재 저장소의 활성 앱은 구조적으로 꽤 잘 정리돼 있다.

- 데이터는 provider로 중앙화돼 있고
- 레이아웃은 `AppShell` / `SidebarLayout` / `desktopVerseLayout`으로 분리돼 있으며
- verse 페이지는 본문, 오디오, 번역, 해설, 학습만화를 모듈식으로 합쳐서 보여준다

다만 문서와 QA 스크립트, 그리고 runtime asset 배치는 완전히 같은 시점을 반영하지 않는 부분이 남아 있다.

그래서 이 레포는 "동작하는 앱"이기도 하지만, 동시에 "정리된 구현과 몇 개의 동기화 불일치가 공존하는 앱"으로 보는 게 정확하다.
