# 요가 프로젝트 기술 심층 분석 보고서

본 보고서는 프로젝트의 아키텍처, 데이터 흐름, 빌드 시스템 및 주요 컴포넌트에 대한 상세 기술 분석 결과를 담고 있습니다.

## 1. 아키텍처 개요
본 프로젝트는 **React + Vite + TypeScript** 기반의 현대적인 웹 애플리케이션으로, 다음과 같은 핵심 기술 스택을 사용합니다:
- **Routing**: `react-router-dom` (SPA 내비게이션 및 파라미터 기반 구절 로드)
- **State Management**: Context API (`UIContext`, `ThemeContext`)를 통한 UI 상태 및 다크 모드 관리.
- **Styling**: Tailwind CSS (유틸리티 기반 스타일링 및 다크 모드 대응)
- **Data Fetching**: Custom Hook (`useYogaData`) 및 Utility (`dataFetcher`)를 통한 정적 JSON 데이터 로드 및 캐싱.

## 2. 데이터 파이프라인 분석
가장 특징적인 부분은 원천 텍스트 데이터를 정제하여 애플리케이션 데이터로 변환하는 자동화 파이프라인입니다.
- **원천 데이터**: `1.sans.txt` (산스크리트어), `4.han bal.txt` (한글 발음) 등 번호가 매겨진 텍스트 파일들.
- **변환 스크립트 (`generate_data.ps1`)**: PowerShell 스크립트가 각 텍스트 파일을 파싱하여 `6.bae_uu`, `8. ox` 등의 키를 가진 JSON 객체로 병합합니다.
- **데이터 로드**: `fetchYogaData`가 `/data.json`을 비동기로 호출하며, 챕터별로 그룹화 및 정렬을 수행합니다.

## 3. UI/UX 및 컴포넌트 구조
제공된 이미지와 코드 분석을 통해 확인된 레이아웃 구조는 다음과 같습니다:
- **AppShell (3단 레이아웃)**:
    - **Sidebar (좌)**: 챕터 및 구절 내비게이션. 아코디언 메뉴 시스템 (`SidebarMenu`).
    - **Main (중)**: 활성화된 구절의 수트라 본문(`SutraContent`), 오디오 플레이어(`AudioPlayer`), 번역 섹션(`TranslationSection`).
    - **Reflections (우)**: `localStorage` 기반의 소통/성찰 기록 공간. 텍스트 내보내기 기능 지원.
- **낭송 동기화 (Segmented Recitation)**: `|` 및 `｜` 기호를 파싱하여 산스크리트어와 발음을 시각적으로 일치시키는 고도화된 렌더링 로직이 핵심입니다.

## 4. 빌드 및 안정성 (최근 조치 사항)
- **빌드 오류 수정**: `src/hooks/useAudio.ts`에서 선언되었으나 사용되지 않던 `useEffect` 임포트로 인한 TypeScript 빌드 오류(TS6133)를 해결하였습니다.
- **타입 안정성**: `YogaSutra`, `YogaChapter` 등 명확한 인터페이스 정의를 통해 데이터 무결성을 보장하고 있습니다.

## 5. 핵심 데이터 매핑 요약
- `pronunciation`: 영어 발음 (IAST 기준)
- `pronunciation_kr`: 한국어 발음 (`4.han bal.txt`에서 추출)
- `2.english`: 앨리스 A. 베일리 등 영문 번역
- `3.korean-1`: 기본 한글 번역
- `5.bae_jik` / `6.bae_uu`: 배철현 교수의 직역 및 의역
- `8. ox` / `9. ox-en`: 니콜라스 서튼(옥스포드)의 한글/영어 번역 및 주해
