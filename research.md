# Yoga Project Research Report

작성일: 2026-03-18

## 1. 개요

이 저장소는 파탄잘리의 `Yoga Sutras`를 읽고, 산스크리트 원문과 발음, 여러 번역본, 단어 뜻, 오디오, 개인 메모를 한 화면에서 다루기 위한 정적 웹앱이다. 현재 운영 UI는 `Vite + React + TypeScript` 기반이며, 과거 정적 HTML/JS 구현은 `legacy/legacy_web/`에 보관되어 있다.

이 프로젝트는 단순한 프론트엔드 하나가 아니라 아래 4개 층이 함께 있는 형태다.

- 운영 앱: `src/` 아래 React 애플리케이션
- 정적 자산: `public/` 아래 JSON, MP3, favicon
- 데이터 제작 파이프라인: `scripts/`, `data-source/`, 루트 `data.js`
- 레거시 보관물: `legacy/legacy_web/`

현재 앱이 실제로 읽는 기준 데이터는 `public/data.json`이다.

## 2. 현재 폴더 구조

핵심 디렉터리는 다음처럼 역할이 나뉜다.

- `src/`: 실제 운영 React 앱
- `public/`: 앱이 직접 fetch하거나 브라우저가 바로 읽는 자산
- `data-source/`: 원천 텍스트, 토큰 매핑 JSON, 과거 산출물 아카이브
- `scripts/`: 데이터 생성, 검증, QA, 토큰 정리 스크립트
- `legacy/legacy_web/`: 과거 정적 웹 구현
- `docs/`: 보조 문서
- `dist/`: 빌드 산출물
- `design/`: 디자인 참고 자산

루트에는 `package.json`, `vite.config.ts`, `vitest.config.ts`, `data.js`, `README.md`, `research.md` 등이 있다.

## 3. 기술 스택

`package.json` 기준 현재 앱 스택:

- React 19
- React Router 7
- TypeScript 5
- Vite 7
- Tailwind CSS 4
- Framer Motion
- lucide-react
- Vitest + Testing Library + jsdom
- Playwright

주요 npm 스크립트:

- `npm run dev`: 개발 서버
- `npm run build`: `tsc -b && vite build`
- `npm run preview`: 빌드 결과 미리보기
- `npm run test`: Vitest
- `npm run typecheck`: 타입 검사
- `npm run qa:browser`: Playwright 스모크 QA

## 4. 진입점과 앱 셸

### 4.1 부트스트랩

`src/main.tsx`는 앱을 다음 순서로 감싼다.

- `StrictMode`
- `ThemeProvider`
- `UIProvider`
- `App`

즉 전역 상태는 크게 테마와 UI 레이아웃 상태 두 축으로 나뉜다.

### 4.2 App 구조

`src/App.tsx`는 `BrowserRouter`를 사용하며, 실제 라우트는 2개뿐이다.

- `/` -> `ChapterList`
- `/chapter/:chapterNum/verse/:verseNum` -> `VerseView`

`MainLayout`이 현재 URL이 상세 보기인지 판별해서 셸 구성을 바꾼다.

- 챕터 목록 페이지에서는 메인 콘텐츠만 렌더링
- 상세 페이지에서는 `Header`, `Sidebar`, 오른쪽 패널(`Reflections`, `CommentarySidebar`)을 함께 렌더링

과거에 있던 비밀번호 게이트는 현재 앱에서 제거되어 있다. 이제 앱은 바로 진입된다.

### 4.3 AppShell

`src/components/ui/AppShell.tsx`는 전체 레이아웃의 공통 외곽이다.

역할:

- 100dvh 전체 높이 사용
- 전역 배경과 오버레이 그라디언트 제공
- 헤더, 좌측 사이드바, 메인 스크롤 영역, 우측 패널 배치
- 모바일 패널이 열리면 메인 영역 스크롤 잠금
- 비상시 floating action 배치

실제 스크롤 컨테이너는 `#main-scroll-container`이다. 상세 페이지 전환 시 이 컨테이너를 직접 top으로 되돌린다.

## 5. 전역 상태 관리

### 5.1 ThemeContext

`src/context/ThemeContext.tsx`

역할:

- `light | dark` 테마 유지
- 초기값은 `localStorage.theme`
- 값 변경 시 `document.documentElement`에 `light` 또는 `dark` 클래스 적용

기본값은 `light`다. 시스템 다크모드를 자동 추종하지 않는다.

### 5.2 UIContext

`src/context/UIContext.tsx`

관리 상태:

- `isSidebarOpen`: 모바일 좌측 드로어 열림 여부
- `activeRightPanel`: 모바일 우측 패널 상태
- `isDesktopSidebarOpen`: 데스크톱 좌측 사이드바 열림 여부
- `activeDesktopRightPanel`: 데스크톱 우측 패널 상태

우측 패널 타입:

- `reflections`
- `commentary`
- `null`

영속화되는 localStorage 키:

- `yoga-desktop-sidebar`
- `yoga-desktop-right-panel`

중요한 동작:

- 화면 폭이 `lg` 이상이 되면 모바일 드로어 상태를 강제로 닫는다
- 좌측 토글은 모바일에서는 drawer open/close, 데스크톱에서는 영구 패널 open/close
- 우측 토글도 같은 방식으로 모바일/데스크톱 동작이 나뉜다

## 6. 라우팅별 동작

## 6.1 챕터 목록 페이지

`src/pages/ChapterList.tsx`

역할:

- `fetchYogaData()`로 전체 데이터를 읽어 챕터 카드 생성
- 챕터/구절 select로 빠른 이동
- 세 가지 모달 진입점 제공
  - `CompendiumModal`
  - `LexiconModal`
  - `ReflectionsModal`

UI 특징:

- `framer-motion`으로 인트로 애니메이션
- 챕터별 아이콘 사용
- 카드 클릭 시 해당 챕터 첫 구절로 이동

이 페이지는 `YOGA_CHAPTERS_META`를 기준으로 카드 제목과 설명을 표시한다.

## 6.2 구절 상세 페이지

`src/pages/VerseView.tsx`

핵심 로직 순서:

1. URL 파라미터 `chapterNum`, `verseNum` 읽기
2. `useYogaData()`로 전체 데이터를 확보
3. `getVerseInRange()`로 현재 URL이 속하는 실제 sutra 엔트리 찾기
4. URL이 범위 중간 번호를 가리키면 실제 시작 번호로 리다이렉트
5. 이동 시 스크롤 top + 오디오 reset
6. 현재 챕터 내 index 계산
7. `useSutraNavigation()`으로 이전/다음 네비게이션 생성

렌더링 블록:

- `SutraHeader`
- `SutraContent`
- `WordMeanings`
- 숨겨진 `<audio>`
- `AudioPlayer`
- `TranslationSection`
- `SutraNavigation`

오디오 경로 규칙:

- `/mp3/${chapterNum}-${actualVerse}.mp3`

즉 URL이 `3.24` 범위 내부를 가리켜도 실제 재생 파일은 해당 범위를 대표하는 시작 구절 번호를 따른다.

## 7. 데이터 로딩 구조

### 7.1 기준 파일

현재 운영 앱은 `src/utils/dataFetcher.ts`에서 `/data.json`을 fetch한다. 즉 실제 기준 데이터 파일은 `public/data.json`이다.

### 7.2 fetchYogaData 동작

`fetchYogaData()`는 다음 순서로 작동한다.

1. 메모리 캐시 `cachedData` 확인
2. 진행 중 요청 `pendingRequest` 확인
3. `/data.json` fetch
4. raw sutra 배열을 chapter 단위로 그룹핑
5. `word_meanings` 객체를 배열 형태로 정규화
6. `4.han bal` 또는 `pronunciation_kr`를 `pronunciation_kr`로 통합
7. 구절 번호 기준 정렬
8. 챕터별 `sutraCount` 계산
9. 메모리 캐시에 저장

이 함수는 중복 fetch를 줄이기 위해:

- 완료 데이터 캐시
- in-flight promise 캐시

둘 다 사용한다.

### 7.3 데이터 모델

`src/types.ts` 기준 핵심 타입:

- `YogaSutra`
- `YogaChapter`
- `ChapterMeta`
- `Token`
- `CompoundToken`
- `WordMeaning`

현재 `YogaSutra`는 원문 파일 이름 기반 필드를 그대로 노출한다.

예:

- `"2.english"`
- `"3.korean-1"`
- `"5.bae_jik"`
- `"6.bae_uu"`
- `"8. ox"`
- `"9. ox-en"`

이건 앱이 원천 데이터 구조에 꽤 강하게 결합되어 있다는 뜻이다.

### 7.4 범위형 sutra 처리

`useYogaData.ts`의 `getVerseInRange()`가 핵심이다.

이 프로젝트는 일부 구절이 단일 번호가 아니라 범위를 대표하는 한 엔트리로 저장된다. 예를 들어 다음 엔트리 번호가 크게 뛰면 현재 엔트리가 그 사이 범위를 대표한다고 본다.

예:

- 현재 엔트리 `3.22`
- 다음 엔트리 `3.37`

그러면 UI는 `3.22-36` 범위처럼 보일 수 있다.

이 처리는 다음 두 곳에서 쓰인다.

- 상세 페이지 URL 보정
- 사이드바 구절 라벨 생성

## 8. 챕터 메타데이터

`src/constants.ts`에 `YOGA_CHAPTERS_META`가 있다.

의도된 챕터명은 사용자 요청에 맞춰 다음 개념을 반영한다.

- 1장: 합일의 문제
- 2장: 합일의 단계
- 3장: 합일의 성취와 그 결과
- 4장: 깨달음

다만 이 파일은 현재 터미널 출력상 한국어 문자열이 깨져 보인다. 앱 렌더링상 일부는 정상처럼 보일 수 있어도, 소스 저장 인코딩 또는 과거 모지바케 흔적이 남아 있을 가능성이 높다. 이 파일은 별도 정밀 점검 대상이다.

또 하나 중요한 점은 메타데이터의 `sutraCount`와 실제 데이터 수가 일치하지 않을 가능성이다. 코드와 정적 자산을 보면 3장은 실제 55개 단위로 다뤄지는데, 메타에는 다른 숫자가 남아 있을 여지가 보인다. 보고서 작성 시점 기준으로 이 값은 검증 필요 항목이다.

## 9. 상세 페이지 컴포넌트 구조

### 9.1 Header

`src/components/Header.tsx`

역할:

- 좌측 메뉴 버튼
- 홈 링크
- 단일 우측 패널 토글 버튼
- 테마 토글

현재 우측 버튼은 하나뿐이며, 클릭할 때마다 `Reflections`와 `Commentary`를 번갈아 전환한다. 모바일과 데스크톱 모두 같은 개념을 쓴다.

주의점:

- `title`, 버튼 툴팁, 심볼 문자열 일부가 현재 터미널에서 모지바케로 보인다
- 동작은 `UIContext`에 강하게 의존한다

### 9.2 Sidebar / SidebarLayout / SidebarMenu

`src/components/Sidebar.tsx`
`src/components/ui/SidebarLayout.tsx`
`src/components/ui/SidebarMenu.tsx`

역할 분담:

- `Sidebar`: 데이터를 가져와 그룹 구조 생성
- `SidebarLayout`: 좌우 drawer 공통 껍데기
- `SidebarMenu`: 실제 챕터/구절 리스트 UI

현재 동작:

- 챕터 선택 영역은 실제 높이 `30%`를 차지하도록 고정
- 구절 영역은 나머지 `70%`
- 모바일 drawer 폭은 `w-[88vw] max-w-[360px]`
- 현재 챕터는 URL 기준 자동 확장
- 챕터를 누르면 해당 챕터 `verse/1`로 이동

구절 리스트는 `sutra.sanskrit` 첫 줄 일부를 프리뷰로 보여준다.

### 9.3 SutraContent

`src/components/verse/SutraContent.tsx`

기능:

- 산스크리트 원문
- 로마자 발음
- 한글 발음

### 9.4 WordMeanings

`src/components/verse/WordMeanings.tsx`

기능:

- `word_meanings` 배열 표시
- 용어별 의미를 아코디언 또는 리스트 성격으로 노출

### 9.5 TranslationSection

`src/components/verse/TranslationSection.tsx`

기능:

- 여러 번역본을 섹션별로 렌더링
- 영문/국문, 옥스퍼드 계열, 배 계열 번역 분리

현 상태에서 이 파일 역시 텍스트 라벨 일부가 터미널에서 깨져 보인다. 구조와 렌더링 순서는 명확하지만, 사용자 노출 문구 품질은 재검토가 필요하다.

### 9.6 AudioPlayer / useAudio

`src/hooks/useAudio.ts`
`src/components/verse/AudioPlayer.tsx`

기능:

- play/pause
- 현재 시간
- duration
- seek
- ended 처리

구현 특징:

- 오디오는 숨겨진 `<audio>` 엘리먼트를 ref로 제어
- React state는 커스텀 플레이어 UI 표시용

잠재 리스크:

- `togglePlay`가 `setIsPlaying(!isPlaying)` 패턴을 사용해 stale state 가능성이 있다
- `play()` 실패 예외를 별도로 처리하지 않는다

## 10. 메모와 코멘터리 기능

### 10.1 Reflections

`src/components/Reflections.tsx`

기능:

- 구절 단위 메모 작성
- `localStorage` 저장
- 현재 메모 export
- 전체 메모 export

저장 키:

- `yoga-note-${chapter}-${verse}`

모바일과 데스크톱 모두 우측 패널로 나타난다.

### 10.2 ReflectionsModal

`src/components/ReflectionsModal.tsx`

기능:

- localStorage에 저장된 전체 메모 수집
- `fetchYogaData()`로 각 메모의 산스크리트 미리보기 보강
- 전체 메모 열람

이 모달은 단순 viewer이며 편집은 하지 않는다.

### 10.3 CommentarySidebar

`src/components/CommentarySidebar.tsx`

현 상태:

- 우측 패널 UI는 존재
- 실제 commentary 본문은 아직 비어 있음
- placeholder 성격의 안내 문구만 렌더링

즉 기능적으로는 “빈 껍데기”에 가깝다.

## 11. 참조 자료 모달

### 11.1 LexiconModal

`src/components/LexiconModal.tsx`

기능:

- `/lexicon.json` fetch
- 알파벳 인덱스 제공
- 단어와 의미 렌더링

최초 오픈 시 한 번만 로드하도록 구성되어 있다.

### 11.2 CompendiumModal

`src/components/CompendiumModal.tsx`

이 파일은 이번 조사에서 세부 내용을 직접 다시 읽지는 않았지만, 챕터 목록 페이지에서 lazy import되는 참고 자료 모달이다. 하드코딩된 소개 텍스트를 담고 있을 가능성이 높고, 구조상 운영 핵심보다는 보조 콘텐츠 영역이다.

## 12. 디자인 시스템과 스타일

`src/index.css` 기준:

- Tailwind 4 토큰 사용
- 금색 중심의 고전 문헌 분위기
- 유리 질감 계열 `glass-panel`
- 다크 모드 지원
- fluid spacing / typography 변수 사용

최근 변경 이력상 현재 타이포 방향은 다음에 가깝다.

- 기본 UI/본문: `SUIT`
- 제목/세리프 강조: `Cormorant Garamond`
- 보조 세리프: `Noto Serif KR`

실제 스타일 파일의 상세 확인은 이번 조사 범위 밖이지만, 앱 전체가 “명상서/문헌 아카이브” 같은 톤을 지향한다는 점은 코드와 UI 명명에서 일관되게 드러난다.

## 13. 정적 자산

`public/` 아래 핵심 자산:

- `data.json`: 운영 데이터
- `lexicon.json`: 사전 데이터
- `mp3/`: 챕터-구절 규칙 기반 오디오 파일
- `favicon.png`

조사 시점 기준 `public/mp3/`에는 1장부터 4장까지 전 범위 오디오가 들어 있다. 파일명 규칙은 앱 코드와 정확히 연결되어 있다.

## 14. 데이터 제작 파이프라인

### 14.1 원천 데이터

`data-source/`에는 원천 텍스트가 있다.

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

또한 `data-source/han-json/`에는 챕터별 토큰 매핑 JSON이 있다.

과거 산출물은 `data-source/archive/data_updated_3_22_3_36.json`에 보관 중이다.

### 14.2 generate_data.ps1

`scripts/generate_data.ps1`는 현재 파이프라인의 중심이다.

동작 요약:

1. `1.sans.txt`를 읽어 sutra ID, 산스크리트, 발음을 파싱
2. 나머지 line-format 텍스트를 같은 sutra 객체에 병합
3. block-format 텍스트를 별도 처리
4. `7.dan.txt`를 순차 매핑해 `word_meanings` 구성
5. 총 sutra를 정렬
6. 산출물을 두 곳에 기록
   - 루트 `data.js`
   - `public/data.json`

스크립트 내부에서 기대하는 총 sutra 수는 `196`이다.

### 14.3 보조 스크립트

`scripts/` 아래 보조 스크립트:

- `merge_tokens.ps1`
- `update_dictionary.ps1`
- `update_dictionary.cjs`
- `check_audio_mismatch.cjs`
- `verify_data.cjs`
- `verify_phase19.ps1`
- `extract_322.ps1`
- `reorder_tokens.ps1`
- `split_iast*.ps1`
- `normalize_files.ts`
- `browser_smoke.mjs`

성격별로 나누면:

- 콘텐츠 생성/병합
- 오디오/데이터 일치 검증
- 토큰 정리
- 브라우저 스모크 QA

## 15. 레거시 앱

`legacy/legacy_web/`는 과거 정적 구현을 보관한다.

핵심 파일:

- `index.html`
- `chapter.html`
- `styles.css`
- `js/app.js`
- `js/auth.js`
- `js/navigation.js`
- `js/ui.js`
- `js/audio.js`
- `js/modals.js`

이 레거시 구현은 다음 특징을 가졌을 것으로 보인다.

- DOM 직접 조작 중심
- 전역 함수 중심
- `data.js`를 직접 로드
- React 이전 아키텍처

현재 운영 구조와의 관계:

- 기능적 참고자료
- 동작 비교 기준
- 삭제 대상이 아니라 “보관 영역”

즉, 현재 소스의 진실은 `src/`이고 `legacy/`는 참조용이다.

## 16. 테스트와 검증 체계

### 16.1 단위 테스트

`src/utils/dataFetcher.test.ts`

현재 확인된 테스트 범위:

- fetch 성공 시 chapter 구조화
- fetch 실패 시 빈 객체 반환

테스트는 존재하지만 범위가 매우 좁다. UI 상호작용, hook 동작, routing, localStorage 복원은 단위 테스트로 거의 커버되지 않는다.

### 16.2 브라우저 스모크 QA

`scripts/browser_smoke.mjs`

Playwright 기반으로 다음 시나리오를 검사한다.

- 데스크톱에서 홈 -> 구절 상세 진입
- Reflections 열기
- Commentary 전환
- 새로고침 후 상태 복원 확인
- 모바일에서 좌측 메뉴 열기
- 모바일에서 우측 패널 열기/닫기

기본 대상 URL:

- `http://127.0.0.1:4174`

### 16.3 빌드/테스트 설정

`vite.config.ts`

- React plugin
- Tailwind plugin
- `@ -> src`
- output `dist`

`vitest.config.ts`

- `jsdom`
- `src/test/setup.ts`
- `src/**/*.{test,spec}.{ts,tsx}`

## 17. 현재 관찰된 문제와 리스크

### 17.1 문자열/인코딩 문제

이번 조사에서 가장 눈에 띈 문제는 한국어 및 일부 특수문자 리터럴이 여러 파일에서 깨져 보인다는 점이다.

관찰 위치:

- `src/constants.ts`
- `src/components/Header.tsx`
- `src/components/Sidebar.tsx`
- `src/components/ui/SidebarLayout.tsx`
- `src/components/ui/SidebarMenu.tsx`
- `src/components/Reflections.tsx`
- `src/components/CommentarySidebar.tsx`
- `src/components/verse/TranslationSection.tsx`
- `README.md`
- 기존 `research.md`

주의:

- PowerShell 출력 인코딩 문제가 일부 과장해서 보일 수 있다
- 그러나 문서와 코드 전반에 동일 패턴이 반복되어 실제 소스에 모지바케가 남아 있을 가능성도 크다

따라서 “브라우저에서 정상이면 끝”이 아니라, 원본 파일 인코딩을 별도 점검해야 한다.

### 17.2 챕터 메타데이터 신뢰도

`YOGA_CHAPTERS_META`는 앱 전반에서 중요하지만, 문자열 품질과 `sutraCount` 값이 실제 데이터와 어긋날 여지가 있다. 이 객체는 카드, 사이드바, 상세 헤더 등 UI 곳곳에 영향을 주므로 우선순위가 높다.

### 17.3 commentary 영역 미완성

`CommentarySidebar`는 실제 콘텐츠가 없다. 버튼과 패널은 존재하지만 사용자 관점에서는 빈 기능이다.

### 17.4 데이터 모델 결합도

필드명이 원천 텍스트 파일명 기반이라 앱 코드가 데이터 정제 단계와 강하게 결합되어 있다. 장기적으로는 앱 내부용 도메인 모델로 한 번 더 매핑하는 편이 좋다.

### 17.5 중복 데이터 접근

`fetchYogaData()`는 캐시가 있어 큰 문제는 아니지만, `ChapterList`, `Sidebar`, `ReflectionsModal`, `useYogaData()` 등 여러 위치에서 개별적으로 호출된다. 성능보다도 데이터 접근 방식이 분산되어 있어 코드 추적성이 떨어진다.

### 17.6 오디오 훅 안정성

`useAudio()`의 `togglePlay`는 함수형 업데이트 대신 현재 클로저 상태를 사용한다. 아주 빠른 상호작용이나 재생 실패 상황에서 엣지 케이스가 생길 수 있다.

## 18. 실제 동작 흐름 요약

앱이 동작하는 실제 흐름을 한 줄로 요약하면 다음과 같다.

1. `main.tsx`가 테마/UI 컨텍스트와 함께 앱 부트스트랩
2. `App.tsx`가 홈 또는 상세 페이지 라우팅
3. 상세 페이지면 `AppShell` 안에 헤더, 좌측 사이드바, 우측 패널 구조 생성
4. 데이터는 모두 `public/data.json`에서 읽음
5. `Sidebar`와 `VerseView`가 같은 데이터셋을 다른 방식으로 소비
6. 메모는 `localStorage`
7. 사전은 `public/lexicon.json`
8. 오디오는 `public/mp3/*.mp3`
9. 브라우저 QA는 Playwright 스크립트로 최소 동선 확인

## 19. 종합 판단

이 프로젝트는 현재 “운영 가능한 React 앱 + 유지용 데이터 제작 파이프라인 + 보관된 레거시 앱” 구조로 정리되어 있다. 전체 방향은 많이 정돈되었고, 데이터 기준 파일도 `public/data.json`으로 수렴해 있다.

강점:

- 앱 구조가 비교적 단순하고 추적 가능함
- 정적 자산 기반이라 배포가 쉬움
- 오디오, 번역, 단어 뜻, 메모까지 한 화면에서 통합됨
- 브라우저 스모크 QA 스크립트가 이미 있음

약점:

- 문자열 인코딩/모지바케 흔적
- commentary 미완성
- 메타데이터 품질 검증 필요
- 테스트 범위 부족
- 데이터 모델이 원천 파일 구조에 과하게 묶여 있음

결론적으로 이 저장소는 “무엇이 어디에 있는지”는 꽤 읽히는 상태지만, “문자열 품질과 데이터 모델” 측면에서는 아직 한 번 더 정리할 가치가 크다. 운영 기준 앱은 분명히 `src/` 아래 React 코드이며, `public/data.json`이 현재 런타임의 단일 데이터 소스라고 보는 것이 맞다.
