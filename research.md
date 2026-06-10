# Thodol 저장소 아키텍처 및 동작 상세 분석 보고서
마지막 업데이트: 2026-06-09
작업 환경: `c:\Users\roadsea\Desktop\thodol`

---

## 1. 개요 및 한줄 요약

본 프로젝트는 티베트 사자의 서(Bardo-Thödol, 바르도 퇴돌) 텍스트와 예비 기도문을 읽고 감상할 수 있는 React 19 + Vite + TypeScript 기반의 현대적인 Verse Reader 웹 애플리케이션이다. 
예비 기도문(`prayers.json`)을 제1장으로 배치하고, 본문 경전(`book.json`에 포함된 1~4부)을 제2장부터 제5장으로 런타임에 동적 병합하여 총 5개 장의 경전 가이드 시스템을 제공한다.

---

## 2. 프로젝트 폴더 및 모듈 구조

- **`src/`**: 애플리케이션의 핵심 소스 코드가 위치한 경로
  - `src/main.tsx`: React 앱의 진입점. Theme, UI, 데이터 상태 관리를 위한 Provider 체인 구성
  - `src/App.tsx`: `react-router-dom` 기반 라우터 및 상위 레이아웃 관리. `ContextPillPicker` 콤보박스 모달 제공
  - `src/types.ts`: `YogaSutra` 및 `YogaChapter` 등 도메인 데이터 모델 계약 선언
  - `src/context/`: 전역 상태 공급자 (`UIContext.tsx`, `YogaDataContext.tsx`)
  - `src/hooks/`: 데이터 조회, 라우트 이동, 오디오 재생 관련 커스텀 훅 정의
  - `src/components/`: 레이아웃 패널, 헤더, 오디오 플레이어, 마크다운 렌더러 등 단위 역할의 모듈화된 컴포넌트군
  - `src/pages/`: 홈 화면(`ChapterList.tsx`) 및 독서 본문 화면(`VerseView.tsx`)
  - `src/data/`: 1장 해설을 담은 정적 주석 데이터 블록 (`chapter1Commentary.ts`)
- **`public/`**: 런타임에 클라이언트가 fetch하는 JSON 데이터 자산 및 앨범 커버, 오디오 MP3 파일
  - `book.json`: 티베트 사자의 서 본문 1~4부 데이터
  - `prayers.json`: 예비 기도문 데이터
  - `albums.json`: 음악 음반 및 오디오 트랙 메타데이터
  - `lexicon.json`: 알파벳 jump가 가능한 보조 단어집 데이터
- **`학습만화/`**: 장별 비주얼 흐름을 돕는 학습만화 이미지 폴더 (`학습만화/{chapter}/{range}.png` 구조)
- **`scripts/`**: Playwright E2E 스모크 테스트 스크립트 및 검증 모듈 (`browser_smoke.mjs`)

---

## 3. 핵심 런타임 동작 메커니즘

### 3.1 정적 데이터 병합 및 정규화 (`dataFetcher.ts`)
1. 애플리케이션 시작 시 `fetchYogaData`가 `public/prayers.json`과 `public/book.json`을 `Promise.all`로 병합 fetch한다.
2. **제1장 (Appendix)**: `prayers.json` 구조를 `appendix` 타입의 `YogaChapter`로 빌드한다.
3. **제2장 ~ 제5장 (Book)**: `book.json` 내부의 1~4부 그룹 구조를 순차적으로 매핑하여 `book` 타입의 `YogaChapter`로 빌드한다.
4. 각 구절(`RawVerse`)은 `normalizeVerse`를 통해 `YogaSutra` 타입 계약에 맞도록 다음 항목을 정규화한다:
   - **번역**: 영문(`translation_en`) 및 한글 번역가(Ham, Gil, Jimong, Suk, Joongam, Ryu)별 번역문을 필드로 구분 적재
   - **해설 (`commentary_en`)**: 1장의 경우 `chapter1Commentary.ts` 데이터를 Markdown 문자열로 직렬화하여 매핑하고, 2~5장은 구절 제목/본문을 조합하여 폴백 해설 생성

### 3.2 화면 라우팅 및 뷰 구성
- 경로 계약은 `/chapter/:chapterNum/verse/:verseNum`을 따른다. 루트 `/` 진입 시 `DefaultVerseRedirect`가 동작해 `1장 1절`로 리다이렉트한다.
- **`VerseView.tsx`**:
  - `UIContext`의 `activeVerseContentMode`에 따라 '심화(Body)'와 '해설(Commentary)' 뷰 모드를 전환한다.
  - **심화(Body) 모드**: `SutraContent`(티베트 원문/IAST 발음), `WordMeanings`(단어별 아코디언 의미), `AudioPlayer`(실시간 싱크 재생 오디오), `TranslationSection`(다중 번역문 렌더링)을 세로 스크롤 레이아웃에 렌더링한다.
  - **해설(Commentary) 모드**: `CommentaryContent` 컴포넌트가 활성화되며, 마크다운 해설 텍스트(`CommentaryMarkdown`) 혹은 `학습만화` 이미지 패널을 탭 인터랙션으로 전환 노출한다.

### 3.3 전역 컨텍스트 구성
- `ThemeToggle`: 로컬 스토리지에 다크 모드/라이트 모드를 기록하고 최상위 HTML 클래스를 갱신하여 CSS 변수 기반 스타일 테마를 적용한다.
- `UIContext`: 데스크톱 양방향 패널 개폐 정보와 모바일 사이드바 토글 상태, 본문 모드 상태를 중앙 집중식으로 관리한다.

---

## 4. 테스트 및 검증 파이프라인

### 4.1 유닛 테스트 (Vitest)
- `npm run test` 명령을 실행해 아래의 핵심 알고리즘 및 유닛을 검증한다:
  - `dataFetcher.test.ts`: 런타임 API fetch 및 JSON 데이터 정상 구조화 검증
  - `yogaData.test.ts`: 범위 지정 구절(예: 1.3-1.4) 파싱 및 range 라벨 계산 검증
  - `sutraNavigation.test.ts`: 이전/다음 장벽 네비게이션 제어 경계 검증
  - `desktopVerseLayout.test.ts`: 레이아웃 그리드 스타일 연산 검증

### 4.2 E2E 브라우저 QA (Playwright)
- `scripts/browser_smoke.mjs` 파일은 실제 Vite Preview 서버(포트 4173) 환경에서 브라우저를 직접 띄워 스모크 테스트를 실행한다.
- **검증 항목**:
  1. 데스크톱 및 모바일 뷰포트에서 `ContextPillPicker` 팝업을 열어 장/절 선택 이동 확인
  2. 심화(Body) 및 해설(Commentary) 모드 전환 시 컴포넌트 마운트/언마운트 유효성 검증
  3. 사이드바 메타 정보('Chapter', 'Verse' 라벨 및 정보) 확인
  4. 다중 번역문 영역 레이블 정상 렌더링 확인
  5. 모드 복귀 시 오디오 플레이어 마운트 및 재생 지속 상태 정상 여부 확인
