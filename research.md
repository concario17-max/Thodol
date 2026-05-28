# Repository Research
Updated: 2026-05-28
Workspace: `C:\Users\roadsea\Desktop\tibet-1`

## 1. 한줄 요약

이 저장소의 활성 앱은 React 19 + Vite 기반의 verse reader다. 지금 런타임은 요가 수트라/가르침 계열의 구조를 읽고 있고, 동시에 `public/book.json`, `public/prayers.json`, `public/albums.json` 같은 별도 데이터 자산이 같이 들어와 있다. 다만 이 복사된 데이터는 아직 React 앱에 연결되지 않았고, 앞으로는 `book.json`과 `prayers.json`을 하나의 데이터로 합치되 `부록:기도문`을 먼저 두는 방향이 가장 자연스럽다.

## 2. 레포 구조

- `src/`: 현재 동작하는 React 애플리케이션
- `public/`: 런타임 정적 자산
- `data-source/`: 데이터 생성용 원본 텍스트와 중간 산출물
- `scripts/`: 데이터 생성, 검증, 브라우저 QA 스크립트
- `legacy/`: 예전 정적 구현 참고본
- `docs/`: 보조 문서와 역사적 기록
- `dist/`: 빌드 산출물

이 저장소는 단일 제품이라기보다, 서로 다른 시기의 데이터 계열이 한 작업공간에 섞여 있는 상태에 가깝다.

## 3. 활성 앱의 실제 동작

### 3.1 진입점과 provider 체인

- `src/main.tsx`에서 앱이 시작된다.
- provider 순서는 `ThemeProvider -> UIProvider -> YogaDataProvider -> App`이다.
- `ThemeProvider`는 `theme`를 `localStorage`에 저장하고 `document.documentElement`의 class를 바꾼다.
- `UIProvider`는 사이드바, 데스크톱 rail, commentary 패널, verse/body 모드를 관리한다.
- `YogaDataProvider`는 원문 데이터를 fetch해서 앱 전체에 배포한다.

### 3.2 라우팅

- `src/App.tsx`는 `react-router-dom`을 써서 두 개의 주요 경로를 가진다.
- `/`는 첫 chapter/verse로 리다이렉트한다.
- `/chapter/:chapterNum/verse/:verseNum`가 실제 verse 화면이다.
- `MainLayout`이 header, left sidebar, optional right panel, main scroll container를 감싼다.

### 3.3 홈 화면

`src/pages/ChapterList.tsx`는 홈 랜딩이다.

- 큰 타이틀
- `Compendium` 모달
- `Lexicon` 모달
- chapter select / verse select
- chapter 카드 그리드

chapter 카드는 `GlassCard`를 통해 렌더링된다.

### 3.4 Verse 화면

`src/pages/VerseView.tsx`가 실제 독서 화면이다.

- body mode와 commentary mode를 `UIContext`로 전환한다.
- body mode에서는 `SutraContent`, `WordMeanings`, `AudioPlayer`, `TranslationSection`이 순서대로 보인다.
- commentary mode에서는 우측 콘텐츠 대신 commentary나 학습만화가 보인다.
- `useSutraNavigation`으로 이전/다음 verse 이동을 처리한다.
- canonical route와 실제 verse 범위가 다르면 `replace: true`로 보정한다.

## 4. 데이터 흐름

### 4.1 현재 런타임 데이터 소스

`src/utils/dataFetcher.ts`는 현재 `/gita.json`을 fetch한다.

- 응답 JSON을 chapter 단위로 묶는다.
- `YOGA_CHAPTERS_META`를 메타로 주입한다.
- verse를 숫자 순서로 정렬한다.
- `word_meanings`를 `{ word, meaning }[]` 형태로 정규화한다.
- `translation_en`, `translation_gil`, `translation_ham`, `translation_jimong`, `translation_suk` 같은 다중 번역 슬롯을 맞춰 넣는다.

즉, 앱의 활성 런타임 계약은 아직 `public/book.json`이나 `public/prayers.json`이 아니라 `/gita.json`이다.

### 4.2 현재 확인된 불일치

여기서 가장 중요한 점은 다음이다.

- `src/utils/dataFetcher.ts`는 `/gita.json`을 읽는다.
- 그런데 `public/`에는 `gita.json`이 없다.
- `dist/gita.json`은 존재한다.
- `dist/gita.json`은 BOM이 들어 있어 raw `JSON.parse`만으로는 바로 파싱되지 않았다.

이건 dev/runtime/build 사이에 데이터 경로 합의가 완전히 정리되지 않았다는 뜻이다.

### 4.3 생성 파이프라인

`scripts/generate_data.ps1`는 아직 다른 계약을 갖고 있다.

- 입력: `data-source/*.txt`
- 출력: `data.js`, `public/data.json`
- `1.sans.txt`, `2.english.txt`, `3.korean-1.txt`, `4.han bal.txt`, `5.bae_jik.txt`, `6.bae_uu.txt`, `7.dan.txt` 등을 읽는다.
- `word_meanings`는 1.sans의 단어 순서와 7.dan의 정의를 sequential mapping으로 붙인다.

문제는 이 스크립트와 현재 앱 런타임이 서로 다른 파일명을 바라본다는 점이다.

- 스크립트 쪽은 `public/data.json`
- React 런타임 쪽은 `/gita.json`

이 상태는 문서만 보면 더 헷갈리고, 실제 데이터 소스의 우선순위도 모호해진다.

### 4.4 현재 데이터 수량

`dist/data.json` 기준으로 확인한 수량은 다음과 같다.

- 총 195 sutras
- chapter 1: 51
- chapter 2: 55
- chapter 3: 55
- chapter 4: 34

반면 `scripts/generate_data.ps1`는 여전히 196개를 기대하는 경고를 갖고 있다. 즉, 생성 스크립트의 기대치가 현 데이터와 어긋나 있다.

## 5. Verse 데이터 모델

### 5.1 타입 계약

`src/types.ts`는 현재 verse model의 핵심이다.

- `YogaSutra`
- `YogaChapter`
- `ChapterMeta`
- `WordMeaning`
- `VerseWord`

`YogaSutra`는 단일 번역 문자열이 아니라 여러 번역 슬롯과 단어 의미, 오디오, 발음, IAST를 함께 담는 넓은 스키마다.

### 5.2 범위 계산

`src/utils/yogaData.ts`는 chapter 배열과 verse 범위를 처리한다.

- chapter 객체를 정렬된 배열로 바꾼다.
- `verseNum`이 `1.3-1.4`처럼 범위일 때 실제 owner sutra를 찾는다.
- 화면에 표시할 range label도 계산한다.

`src/utils/sutraNavigation.ts`는 이전/다음 이동을 처리한다.

- 현재 chapter 안에서 앞뒤로 이동한다.
- chapter의 시작/끝이면 인접 chapter로 넘어간다.

## 6. 화면 레이아웃

### 6.1 공통 shell

`src/components/ui/AppShell.tsx`가 전체 뼈대를 만든다.

- viewport 전체 높이
- 상단 header
- 좌측 sidebar
- 우측 panel
- 본문 main scroll container

데스크톱 verse 화면에서는 `desktopGridColumns`가 CSS 변수로 들어가서 좌/중/우 비율을 제어한다.

### 6.2 사이드바와 패널

`src/components/ui/SidebarLayout.tsx`는 left/right 패널의 공통 래퍼다.

- 모바일에서는 drawer
- 데스크톱에서는 sticky rail
- open/closed 상태에 따라 width와 opacity를 바꾼다

`src/context/UIContext.tsx`는 다음 상태를 관리한다.

- `isSidebarOpen`
- `isDesktopSidebarOpen`
- `activeRightPanel`
- `activeDesktopRightPanel`
- `activeVerseContentMode`

이 값들 중 일부는 `localStorage`에 저장된다.

### 6.3 verse body 구성

`SutraContent`는 산스크리트 본문과 발음을 보여준다.

`WordMeanings`는 word-by-word 해설을 접었다 펼친다.

`AudioPlayer`는 오디오 재생/정지, seek, progress, error를 처리한다.

`TranslationSection`은 영어 번역과 여러 한국어 번역을 각각 블록으로 보여준다.

## 7. Commentary와 학습만화

### 7.1 commentary 패널

`src/components/CommentarySidebar.tsx`와 `VerseView.tsx` 내부의 `CommentaryContent`는 commentary를 다룬다.

- chapter/verse별 commentary를 표시한다.
- `CommentaryMarkdown`이 heading, paragraph, ordered/unordered list, table을 파싱한다.
- 우측 commentary 패널은 chapter 1~4에 대한 학습용 해설 구조로 연결되어 있다.

### 7.2 학습만화

`VerseView.tsx`는 `import.meta.glob('../../학습만화/*/*.png', { eager: true })`로 만화를 읽는다.

- chapter 1~4 폴더만 매핑된다.
- 파일명 범위를 읽어서 verse 범위와 연결한다.
- commentary mode에서 만화와 해설을 전환한다.

이건 별도 데이터 파일이 아니라 파일 시스템 경로 규칙에 의해 작동하는 자산 맵이다.

## 8. 홈 화면의 부가 모듈

### 8.1 Compendium

`src/components/CompendiumModal.tsx`는 읽기 안내용 모달이다.

- 현재 앱의 구조 설명
- 읽는 방식
- chapter/verse 구성 요약

### 8.2 Lexicon

`src/components/LexiconModal.tsx`는 `/lexicon.json`을 fetch한다.

- 알파벳 섹션으로 단어를 묶는다.
- section jump가 가능하다.
- 로딩 실패 시 별도 에러 메시지를 보여준다.

이 둘은 홈 화면에서만 열리는 보조 읽기 도구다.

## 9. 복사된 Bardo 데이터 자산

여기서부터가 이번 조사에서 가장 중요한 부분이다. `public/`에는 복사된 Bardo 계열 데이터가 들어 있다.

### 9.1 `public/book.json`

- array 길이: 4
- 구조: `group -> subchapters -> verses`
- 총 subchapter 수: 25개 전후
- 총 verse 수: 279

chapter 이름은 다음 계열이다.

- `1부. 저승 중간계에서 드리는 기도`
- `2부. 자애로운 모습의 붓다와 보살들이 나타나는 저승 중간계`
- `3부. 무서운 모습의 붓다와 보살들이 나타나는 저승 중간계`
- `4부. 탄생 중간계 길 안내`

이 파일은 본문용 메인 북 데이터에 가깝다.

### 9.2 `public/prayers.json`

- array 길이: 5
- 구조: `group -> verses`
- 총 verse 수: 52
- subchapter는 없다

chapter 이름은 다음 계열이다.

- `붓다의 세 몸에 대한 기도`
- `붓다와 보살에게 구원을 청하는 기도`
- `중간계의 공포에서 구원을 청하는 기도`
- `중간계 수행자를 위한 기도`
- `삶의 중간계에 들어가기 전에 드리는 기도`

이 파일은 독립된 부록형 기도문 데이터다.

### 9.3 `public/albums.json`

- album 수: 7
- tracks 수: 7 / 11 / 9 / 6 / 5 / 19 / 16
- 각 트랙은 `/mp3/...` 경로를 직접 가리킨다.

현재 React 코드에서는 이 파일을 읽지 않는다. 다만 데이터는 이미 정리돼 있어서, 나중에 별도 플레이어/음반 페이지를 붙일 때는 바로 사용할 수 있는 상태다.

### 9.4 `public/mp3/`와 `public/album-covers/`

- `public/mp3/` 아래에 앨범별 폴더가 있다.
- `public/album-covers/`에는 앨범 커버 이미지가 있다.
- `book.json`과 `prayers.json`의 일부 verse는 `/mp3/Prayer/...` 같은 직접 경로를 쓴다.

즉, 오디오는 이미 데이터와 자산 폴더가 함께 맞물려 있다.

## 10. book + prayers 통합 관찰

이번 작업에서 가장 중요한 연구 결론은 이거다.

`book.json`과 `prayers.json`은 단순 concat으로 끝나는 구조가 아니다.

- `book.json`은 `subchapters`를 가진 계층형 구조다.
- `prayers.json`은 `verses`만 가진 평면 구조다.

그래서 앞으로 하나로 묶으려면, 최소한 다음 둘 중 하나가 필요하다.

- 공통 상위 스키마를 새로 정의해서 두 데이터 세트를 동일한 wrapper 아래 넣기
- 로더에서 서로 다른 모양을 normalize해서 하나의 읽기 순서로 합치기

사용자 요청 기준으로는 `부록:기도문`을 `book`보다 먼저 배치하는 게 맞다. 그러려면 `prayers.json`을 선두 appendix로 넣고, 그 다음에 `book.json` 본문 그룹들이 이어지는 순서가 되어야 한다.

정리하면, 권장 읽기 순서는 다음이다.

1. `부록:기도문`
2. 본문 `book` 그룹들
3. 나중에 별도 업데이트할 `albums`와 `mp3`

## 11. 현재 문서와 코드의 불일치

조사하면서 확인한 어긋남은 아래와 같다.

- `README.md`와 `scripts/README.md`는 `public/data.json`을 런타임 소스로 설명하지만, 실제 React 코드는 `/gita.json`을 읽는다.
- `public/data.json`은 현재 없다.
- `public/gita.json`도 없다.
- `dist/gita.json`은 있지만 BOM이 끼어 있다.
- `scripts/generate_data.ps1`는 196개를 기대하지만 실제 산출물은 195개다.
- `public/book.json`, `public/prayers.json`, `public/albums.json`은 현재 React 코드에 연결되어 있지 않다.

이 불일치는 나중에 데이터 통합 작업을 할 때 반드시 먼저 정리해야 한다.

## 12. 테스트와 검증

관련 테스트는 다음과 같다.

- `src/utils/dataFetcher.test.ts`
- `src/utils/yogaData.test.ts`
- `src/utils/sutraNavigation.test.ts`
- `src/components/ui/desktopVerseLayout.test.ts`

브라우저 QA는 `scripts/browser_smoke.mjs`가 담당한다.

- home chapter/verse 선택
- verse route 로딩
- body/commentary mode 전환
- sidebar/panel persistence
- desktop/mobile selector 동작

## 13. 최종 판단

이 workspace의 본질은 “하나의 앱에 여러 데이터 세대가 섞여 있는 상태”다.

- 활성 앱은 여전히 `/gita.json` 중심의 verse reader
- 새로 복사된 `book.json`과 `prayers.json`은 Bardo Thodol 계열의 별도 데이터
- `albums.json`과 `mp3`는 음악 자산 계열

따라서 다음 구현 단계에서는 먼저 데이터 계약을 하나로 고정해야 한다. 특히 `book.json`과 `prayers.json`은 서로 다른 shape이므로, `부록:기도문`을 먼저 두는 통합 스키마를 명시적으로 정리한 뒤에만 코드 작업을 시작하는 편이 안전하다.
