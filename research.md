# Yoga Project Research Report

작성일: 2026-03-16

## 1. 프로젝트 정체성

이 저장소는 `Yoga Sutras` 텍스트를 읽고, 각 수트라의 산스크리트 원문, 발음, 단어별 뜻, 여러 번역문, 오디오, 개인 메모를 함께 탐색할 수 있게 만든 정적 웹 앱이다.

현재 저장소 안에는 성격이 다른 세 층이 공존한다.

1. 현재 메인 앱: `src/` 기반의 `Vite + React + TypeScript` 앱
2. 이전 구현: `legacy/legacy_web/` 아래의 정적 HTML/JS 버전
3. 데이터 제작 파이프라인: 루트의 `.txt`, `.ps1`, `.cjs` 스크립트들과 `data.js`/`public/*.json`

즉, 이 프로젝트는 단순한 프론트엔드가 아니라, "콘텐츠 정제 + 정적 자산 보관 + 2세대 UI 구현"이 한 저장소에 같이 들어 있는 구조다.

## 2. 최상위 구조

- `src/`: 현재 운영 대상으로 보이는 React 앱
- `public/`: 배포되는 정적 데이터와 오디오
- `legacy/legacy_web/`: 이전 세대의 브라우저 직접 구동형 앱
- `design/`: 디자인 시안 산출물
- `data-source/han-json/`: 챕터별 토큰 매칭 산출물
- 루트 `.txt`: 원문/번역/발음/사전 원천 데이터
- 루트 `.ps1`, `.cjs`: 데이터 생성, 검증, 정리용 유틸리티

특이점:

- `node_modules/`가 커밋되어 있다.
- `research.md`와 `docs/` 아래의 조사/기획 문서가 함께 있다.
- `data.js`와 `public/data.json`이 현재 주 데이터 계층이고, 이전 버전 산출물은 `data-source/archive/data_updated_3_22_3_36.json`으로 이동해 보관 중이다.

## 3. 기술 스택

`package.json` 기준 핵심 스택은 다음과 같다.

- 런타임: `react 19`, `react-dom 19`
- 라우팅: `react-router-dom 7`
- 빌드: `vite 7`
- 언어: `typescript 5`
- 스타일: `tailwindcss 4`, `@tailwindcss/vite`
- 모션: `framer-motion`
- 아이콘: `lucide-react`
- 테스트: `vitest`, `@testing-library/react`, `jsdom`

스크립트:

- `npm run dev`: Vite 개발 서버
- `npm run build`: `tsc -b && vite build`
- `npm run preview`: 빌드 결과 미리보기
- `npm run test`: Vitest
- `npm run typecheck`: `tsc --noEmit`

TypeScript 설정 특징:

- `strict` 계열 옵션이 강하게 켜져 있다.
- `@/* -> src/*` alias가 있다.
- 번들러 해석 방식(`moduleResolution: bundler`)을 사용한다.

Vite 설정은 단순하다.

- React 플러그인
- Tailwind 플러그인
- `@` alias
- 출력 폴더 `dist`

## 4. 현재 앱의 런타임 흐름

### 4.1 부팅

진입점은 `src/main.tsx`다.

- `StrictMode`
- `ThemeProvider`
- `UIProvider`
- `App`

이 순서로 앱이 감싸진다.

### 4.2 인증 게이트

`src/App.tsx`는 앱 진입 직후 `localStorage`에서 `yoga_authenticated`를 읽는다.

- 값이 `true`면 앱 본문으로 진입
- 아니면 `PasswordGateway` 렌더

암호는 `src/components/PasswordGateway.tsx`에서 검사한다.

- 우선 `import.meta.env.VITE_GATEWAY_PASSWORD`
- 없으면 기본값 `0228`

성공 시:

- `localStorage.setItem('yoga_authenticated', 'true')`
- React 상태를 인증 완료로 전환

즉, 현재 React 앱은 서버 인증이 아니라 클라이언트 로컬 스토리지 게이트다.

### 4.3 라우팅

라우트는 2개뿐이다.

- `/` -> `ChapterList`
- `/chapter/:chapterNum/verse/:verseNum` -> `VerseView`

`MainLayout`은 현재 URL이 verse 화면인지 판별해서 레이아웃을 바꾼다.

- verse 화면이면 상단 헤더, 좌측 사이드바, 우측 패널을 붙임
- 홈 화면이면 메인 콘텐츠만 보여주고 우하단에 테마 토글 플로팅 버튼을 둠

## 5. 상태 관리 구조

### 5.1 ThemeContext

`src/context/ThemeContext.tsx`

- 테마는 `light | dark`
- 초기값은 `localStorage.theme`를 읽고, 없으면 `light`
- `document.documentElement`에 `light` 또는 `dark` 클래스를 붙인다

Tailwind 4 설정에서 `@custom-variant dark (&:where(.dark, .dark *));`를 쓰므로, 이 클래스가 다크모드 스위치의 핵심이다.

### 5.2 UIContext

`src/context/UIContext.tsx`

관리하는 상태:

- 모바일 왼쪽 사이드바 열림 여부
- 데스크탑 왼쪽 사이드바 열림 여부
- 모바일 오른쪽 패널 활성 상태
- 데스크탑 오른쪽 패널 활성 상태

오른쪽 패널 타입:

- `reflections`
- `commentary`
- `null`

데스크탑 상태는 `localStorage`에 저장된다.

- `yoga-desktop-sidebar`
- `yoga-desktop-right-panel`

즉, 이 앱은 레이아웃 상태를 전역 컨텍스트로만 관리하고, 서버 상태 관리 라이브러리는 쓰지 않는다.

## 6. 데이터 구조와 로딩 방식

### 6.1 핵심 데이터 파일

현재 React 앱은 `src/utils/dataFetcher.ts`에서 아래 파일을 읽는다.

- `/data.json`

즉, `public/data.json`이 현재 메인 데이터 소스다.

### 6.2 데이터 타입

`src/types.ts` 기준 수트라 데이터는 대략 다음 필드를 가진다.

- `id`
- `sanskrit`
- `pronunciation`
- `pronunciation_kr`
- `2.english`
- `3.korean-1`
- `5.bae_jik`
- `6.bae_uu`
- `8. ox`
- `9. ox-en`
- `word_meanings`
- `tokens`
- `compound_tokens_original`

이 네이밍은 "파일명 기반 키"가 그대로 데이터 모델에 섞여 들어온 형태다. 그래서 도메인 모델이 깔끔한 영문 키 체계로 정리되진 않았다.

### 6.3 fetchYogaData 동작

`fetchYogaData()`는 다음 일을 한다.

1. JSON fetch
2. 수트라 배열을 chapter별로 그룹화
3. `word_meanings`가 객체면 배열로 정규화
4. `4.han bal` 또는 `pronunciation_kr`를 `pronunciation_kr` 필드로 통합
5. 각 챕터 수트라를 번호순 정렬
6. 캐시 보관

캐시:

- 모듈 스코프 `cachedData`
- `resetCache()` 테스트용 제공

### 6.4 챕터 메타데이터

메타데이터는 두 군데에서 나온다.

1. `src/constants.ts`의 `YOGA_CHAPTERS_META`
2. `dataFetcher.ts` 안의 `getChapterName`, `getChapterNameEn`

이중화가 있다. 실제 홈 화면 카드 설명은 `constants.ts`를 더 우선해서 쓴다.

### 6.5 수트라 범위 처리

`useYogaData()`에는 특이한 로직이 있다.

- `getVerseInRange(chapterNum, verseNum)`
- `getVerseRangeText(chapter, sutra)`

이 로직은 "다음 수트라 번호가 건너뛰는 경우" 현재 수트라가 하나의 범위를 대표한다고 본다.

예:

- 현재 ID가 `3.22`
- 다음이 `3.37`

그러면 현재 화면은 `3.22-36` 범위로 표현될 수 있다.

즉, URL은 단일 수트라처럼 보여도, 실제 의미는 "시작 번호를 대표 키로 쓰는 범위형 묶음"을 지원한다.

## 7. 화면별 동작

### 7.1 홈 화면 `ChapterList`

역할:

- 데이터 로드 후 챕터 카드 렌더
- 챕터/수트라 선택 셀렉트 제공
- 3개 모달 열기
  - `CompendiumModal`
  - `LexiconModal`
  - `ReflectionsModal`

구성 특징:

- `framer-motion`으로 진입 애니메이션
- 챕터별 아이콘을 `lucide-react`로 분기
- 카드 클릭 시 해당 챕터 첫 수트라로 이동

### 7.2 수트라 화면 `VerseView`

핵심 화면이다.

동작 순서:

1. URL 파라미터 읽기
2. 데이터 로드
3. 범위형 수트라라면 대표 시작 번호로 URL 교정
4. 수트라 변경 시 스크롤 top, 오디오 reset
5. 현재 수트라/챕터/인덱스 계산
6. 이전/다음 탐색 훅 연결

렌더 블록:

- `SutraHeader`
- `SutraContent`
- `WordMeanings`
- 숨김 `<audio>`
- `AudioPlayer`
- `TranslationSection`
- `SutraNavigation`

오디오는 파일명 규칙이 고정이다.

- `/mp3/${chapterNum}-${actualVerse}.mp3`

예: `1-1.mp3`

## 8. 훅 분석

### 8.1 `useYogaData`

기능:

- 전체 데이터 로드
- 로딩 상태 제공
- 범위형 수트라 찾기
- 범위 텍스트 계산

특징:

- 데이터 조회는 편하지만 에러 상태를 별도로 반환하지 않는다.

### 8.2 `useSutraNavigation`

기능:

- 이전 수트라 이동
- 다음 수트라 이동
- 챕터 경계 넘어가기

로직:

- 현재 챕터 내부 이동 우선
- 첫 항목에서 이전 클릭 시 이전 챕터 마지막으로
- 마지막 항목에서 다음 클릭 시 다음 챕터 첫 수트라로

### 8.3 `useAudio`

기능:

- play/pause
- time update
- metadata 로딩
- ended 처리
- seek
- reset
- 시간 포맷

특징:

- 오디오 엘리먼트는 DOM ref 기반
- 별도 커스텀 플레이어 UI를 위해 상태를 React로 노출

제한:

- 재생 실패 에러 처리 없음
- `togglePlay`가 `setIsPlaying(!isPlaying)`를 직접 사용해서, 극단적 연타 시 stale state 가능성은 있다

## 9. 주요 컴포넌트 분석

### 9.1 레이아웃

`AppShell`

- 전체 앱 shell
- 배경 그라디언트 오버레이
- 헤더/사이드바/메인/오른쪽 패널 배치
- 모바일 패널 열릴 때 본문 스크롤 잠금

`SidebarLayout`

- 공용 drawer
- 왼쪽/오른쪽 위치 대응
- 모바일 오버레이 포함

`SidebarMenu`

- 챕터 그룹 목록
- 확장된 챕터의 수트라 목록
- 현재 항목 하이라이트

### 9.2 내비게이션

`Header`

- 좌측 햄버거 버튼
- 제목 링크
- 우측 reflections/commentary 토글
- 테마 토글

`Sidebar`

- 데이터를 다시 fetch해서 챕터 목록 생성
- 현재 챕터를 자동 확장
- 각 수트라 미리보기 텍스트는 산스크리트 첫 줄 일부

여기서는 `fetchYogaData()`를 별도 호출하므로, 화면별 중복 접근이 있지만 모듈 캐시로 실제 비용은 줄어든다.

### 9.3 수트라 콘텐츠

`SutraContent`

- 산스크리트 원문
- 영문 발음
- 한글 발음

발음 텍스트를 정리하는 간단한 문자열 정규화가 들어간다.

`WordMeanings`

- 접이식 아코디언
- 배열화된 `word_meanings` 렌더

`TranslationSection`

- 번역 섹션을 출처 그룹별로 분리
- Bailey, Oxford, Bae 계열을 노출

### 9.4 메모와 코멘터리

`Reflections`

- 수트라별 메모 저장
- 키 형식: `yoga-note-${chapter}-${verse}`
- 현재 노트 export
- 전체 노트 export

`CommentarySidebar`

- 현재는 사실상 플레이스홀더
- "commentary" 패널 UI만 있고 내용은 비어 있음

`ReflectionsModal`

- 로컬스토리지 전체 노트 모아 보기
- 각 노트에 수트라 제목 일부 표시

### 9.5 참고 자료 모달

`CompendiumModal`

- 앱 내 설명 텍스트 모달
- 긴 설명문이 하드코딩되어 있다

`LexiconModal`

- `/lexicon.json` fetch
- 알파벳 인덱스 제공
- 단어 뜻 사전 표시

## 10. 스타일 시스템

`src/index.css` 기준:

- Tailwind 4의 `@theme` 토큰 사용
- 금색/양피지/어두운 배경 중심 색 체계
- `glass-panel` 유틸리티 제공
- fluid typography와 spacing 토큰 정의
- 다크모드 selector 전략 적용

디자인 방향:

- 종교/경전/고전 문헌 아카이브 톤
- 금색 강조
- 글래스모피즘
- 부드러운 reveal 모션

## 11. 정적 자산

### 11.1 오디오

`public/mp3/`

- 챕터-수트라 규칙의 MP3 파일 다수 포함
- 예: `1-1.mp3`, `2-55.mp3`, `4-34.mp3`

### 11.2 데이터

- `public/data.json`
- `data-source/archive/data_updated_3_22_3_36.json`
- `public/lexicon.json`

현재 앱은 `data.json`을 읽고, 레거시 앱은 `data.js` 또는 `public/data.json` 계열에 의존한 흔적이 있다.

## 12. 레거시 앱 분석

`legacy/legacy_web/`는 React 이전 세대 구현이다.

구성:

- `index.html`: 랜딩/챕터 진입
- `chapter.html`: 수트라 뷰어
- `styles.css`
- `js/app.js`
- `js/auth.js`
- `js/navigation.js`
- `js/ui.js`
- `js/audio.js`
- `js/modals.js`

특징:

- 브라우저 전역 함수에 기능을 바인딩
- `data.js`를 `<script>`로 로드
- DOM 직접 조작 중심
- 라우터 대신 query string 사용
- 메모 키는 `note-${sutraId}` 형식

즉, 현재 React 앱의 기능 상당수는 이 레거시 앱을 재구현한 결과다.

대응 관계:

- 레거시 `auth.js` -> React `PasswordGateway` + `App.tsx`
- 레거시 `ui.js` -> React `VerseView`와 verse 컴포넌트들
- 레거시 `modals.js` -> React 모달 컴포넌트들
- 레거시 `navigation.js` -> `Sidebar`, `useSutraNavigation`
- 레거시 `audio.js` -> `useAudio` + `AudioPlayer`

차이점:

- 레거시는 DOM imperative
- 현재 앱은 컴포넌트/훅/컨텍스트 구조
- 레거시는 query string
- 현재 앱은 path params

## 13. 데이터 제작 파이프라인

루트의 여러 파일은 콘텐츠 소스와 제작 도구다.

### 13.1 원천 텍스트 파일

- `data-source/1.sans.txt`: 산스크리트 원문 + 발음
- `data-source/2.english.txt`
- `data-source/3.korean-1.txt`
- `data-source/4.han bal.txt`
- `data-source/5.bae_jik.txt`
- `data-source/6.bae_uu.txt`
- `data-source/7.dan.txt`
- `data-source/8. ox.txt`
- `data-source/9. ox-en.txt`
- `data-source/10.sogae.txt`
- `data-source/11. Lexicon.txt`

즉, 현재 앱 데이터는 여러 텍스트 파일을 조합해서 만들어진다.

### 13.2 `scripts/generate_data.ps1`

이 스크립트는 데이터 생성의 중심이다.

주요 동작:

1. 수트라 객체 맵 생성
2. `data-source/1.sans.txt`에서 `sanskrit`, `pronunciation` 파싱
3. 다른 `.txt` 파일을 언어 필드로 병합
4. `4.han bal.txt`, `5.bae_jik.txt`, `6.bae_uu.txt`는 블록 형식으로 처리
5. `7.dan.txt`를 `word_meanings`로 순차 매핑
6. 최종 결과를
   - `data.js`
   - `public/data.json`
   로 저장

즉, `data.js`와 `public/data.json`은 빌드 산출물에 가깝다.

### 13.3 보조 스크립트

`scripts/update_dictionary.cjs`

- `data-source/7.dan.txt`, `data-source/1.sans.txt`를 읽어 `data.js` 일부를 갱신

`scripts/check_audio_mismatch.cjs`

- 데이터 기준 기대 MP3와 실제 `public/mp3` 파일 매칭 검사

`scripts/verify_data.cjs`

- `public/data.json` 특정 범위를 검사하는 간단한 검증 스크립트

그 외 PowerShell 스크립트:

- `update_dictionary.ps1`
- `check_mismatches.ps1`
- `split_iast*.ps1`
- `merge_tokens.ps1`
- `reorder_tokens.ps1`
- `normalize_files.ts`

이들은 토큰 정렬, 사전 보정, 파일 정규화 등 "콘텐츠 편집 작업"을 위해 만든 도구들로 보인다.

### 13.4 `data-source/han-json/`

`data-source/han-json/yoga_sutra_ch*_tokens_MATCHED_TO_datajs.json`

이 파일들은 챕터별 토큰 매칭 결과로 보인다.

이는 `types.ts` 안의 `tokens`, `compound_tokens_original` 필드와 연결된다. 즉, 앱은 현재 단순 문자열 데이터만이 아니라, 향후 더 정교한 형태소/어휘 분석 UI로 확장될 여지도 가진다.

## 14. 설계 의도와 실제 구현의 간극

프로젝트는 명확히 "고급 독서 경험"을 지향한다.

보이는 의도:

- 고급스러운 디자인
- 다중 번역 비교
- 원문 + 발음 + 단어 뜻 + 오디오의 통합
- 개인 메모
- 사전/개론 제공

하지만 구현을 읽어보면 몇 가지 과도기 흔적이 있다.

1. 데이터 필드명이 파일명 기반이라 도메인 모델이 거칠다.
2. 메타데이터가 두 군데(`constants.ts`, `dataFetcher.ts`)에 중복된다.
3. 레거시 구현과 React 구현이 함께 남아 있어 저장소 응집도가 낮다.
4. 코멘터리 패널은 아직 비어 있다.
5. 데이터 파일이 복수 버전으로 공존한다.

즉, 기능은 많이 갖췄지만 "정리/통합 리팩터링" 전 단계의 저장소다.

## 15. 확인된 리스크와 주의점

### 15.1 문자열 인코딩/모지바케 흔적

터미널에서 확인한 다수의 TSX/상수 문자열에 깨진 한글이 보였다.

예:

- `src/constants.ts`
- `src/components/*`
- `legacy/legacy_web/*`

반면 `data.js` 일부는 정상 한글이 보였다.

가능성:

- 일부 소스 파일 인코딩이 UTF-8이 아닐 수 있음
- 혹은 저장소 안에서 이미 깨진 문자열이 커밋되었을 수 있음
- 혹은 PowerShell 출력 인코딩과 실제 파일 인코딩이 불일치할 수 있음

이 문제는 실제 앱 UI에서 한글이 깨져 보이는지 반드시 브라우저 기준으로 확인할 필요가 있다.

### 15.2 인증 보안은 사실상 약함

암호가 클라이언트에 있고 기본값이 `0228`이다.

현재 구조는 "비공개 콘텐츠에 대한 약한 접근 제어" 정도이며, 진짜 보안 경계로 쓰면 안 된다.

### 15.3 중복 데이터 소스

현재 앱은 `public/data.json`을 쓰고, 생성 스크립트도 `public/data.json`을 갱신한다.

즉:

- 제작 파이프라인의 최신 산출물이 앱에서 실제 사용되는지 보장되지 않는다.
- 다만 저장소 안에 이전 산출물 백업이 별도 보관되어 있으므로, 수정 시에는 현재 기준 파일과 아카이브 파일을 혼동하지 않도록 주의가 필요하다.

### 15.4 코멘터리 패널 미완성

`CommentarySidebar`는 UI 뼈대만 있고 실질 콘텐츠가 없다.

### 15.5 메모 키 체계가 버전별로 다름

- React 앱: `yoga-note-${chapter}-${verse}`
- 레거시 앱: `note-${sutraId}`

따라서 두 버전이 같은 사용자 브라우저에서 공존하면 메모 호환성이 없다.

## 16. 테스트 및 검증 현황

코드상 테스트 파일은 확인했다.

- `src/utils/dataFetcher.test.ts`

이 테스트는 아래만 검증한다.

- fetch 성공 시 chapter 그룹화
- fetch 실패 시 빈 객체 반환

즉, 핵심 UI 동작은 거의 테스트되지 않는다.

실행 검증 시도 결과:

- `npm run typecheck`
- `npm run test -- --run`
- `npm run build`

를 시도했으나, 이 환경에서는 기본 `npm`이 PATH에 없었다. 이후 로컬 Node 경로를 사용해 재시도했지만, 샌드박스 제약으로 `C:\Users\roadsea` 경로 `lstat` 단계에서 `EPERM`이 발생해 실행을 완료하지 못했다.

따라서 이번 조사에서는 "코드를 정적으로 읽은 분석"은 충분히 했지만, 타입체크/테스트/빌드의 성공 여부는 최종 확인하지 못했다.

## 17. 파일 기준 핵심 동작 요약

앱이 실제로 어떻게 움직이는지 가장 짧게 요약하면 아래 순서다.

1. `src/main.tsx`가 Theme/UI 컨텍스트와 함께 앱 부팅
2. `src/App.tsx`가 로컬 스토리지 인증 상태 확인
3. 홈이면 `ChapterList`, 상세면 `VerseView` 렌더
4. `src/utils/dataFetcher.ts`가 `public/data.json`을 읽음
5. `VerseView`가 현재 수트라를 찾고 MP3 경로를 계산
6. `useAudio`가 오디오 상태를 관리
7. `Reflections`가 로컬 스토리지에 사용자 메모 저장
8. `LexiconModal`은 `public/lexicon.json`을 따로 읽음

## 18. 종합 판단

이 프로젝트는 이미 사용자 경험 면에서 상당히 많은 요소를 갖춘 "콘텐츠 중심 정적 앱"이다. 특히 다음 점이 강하다.

- 본문/발음/번역/단어 뜻/오디오를 한 화면에 통합
- 레거시에서 React로 재구축하며 구조를 상당히 개선
- 디자인 일관성이 뚜렷함
- 데이터 제작용 스크립트가 별도로 존재해 콘텐츠를 계속 확장할 수 있음

반대로 지금 가장 큰 숙제는 다음 네 가지다.

1. 실제 사용 데이터 소스 통합
2. 인코딩/깨진 문자열 여부 확인
3. 레거시 폴더와 현대 앱의 역할 정리
4. 코멘터리/테스트 같은 미완성 영역 보강

즉, "작동하는 앱"을 이미 넘어섰지만, 이제는 "운영 가능한 단일 체계"로 정리할 시점에 들어선 저장소라고 보는 것이 가장 정확하다.
