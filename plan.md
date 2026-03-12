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

---
**주의**: 사용자(Ray)의 명시적인 "구현 시작" 지시가 있기 전까지는 어떠한 코드도 수정하지 않습니다.
