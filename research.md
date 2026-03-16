# 프로젝트 데이터 아키텍처 분석 및 Phase 19 미반영 원인 조사 보고서

## 1. 현상 분석
사용자가 3장 22절(Sutra 3.22)을 조회했을 때, 화면에는 3장 21절의 데이터(한글 발음: '에떼나 샤브다아디...', 단어 뜻: 'etena', 'sabda' 등)가 출력되고 있음. 

## 2. 근본 원인 (Root Causes)

### A. 데이터 누락 및 프론트엔드 폴백 (Frontend Fallback)
`src/hooks/useYogaData.ts`의 `getVerseInRange` 함수는 요청된 구절 번호가 데이터셋에 없을 경우, **이전 구절**을 반환하는 로직을 가지고 있음.
- 현재 `data.js` 또는 `public/data.json`에 3.22 데이터가 누락되어 있어, 앱이 3.21 데이터를 대신 보여주는 것임.

### B. 파이프라인 파싱 결함 (Pipeline Flaw)
`generate_data.ps1` 스크립트가 196개의 Sutra 중 195개만 생성하고 있음.
- `1.sans.txt`에 3.22 데이터가 존재함에도 불구하고, 파이프라인 가동 후 생성된 `data.js`에서 3.22가 누락됨. 
- 이는 특정 IAST 문자(예: `ś`, `ṃ` 등)가 인코딩 문제로 깨져서 정규표현식 매칭에 실패했거나, 파이프라인의 상태 기계(State Machine)가 빈 줄이나 특수 기호를 오판했기 때문으로 분석됨.

### C. 데이터 로딩 메커니즘 혼선
- 앱은 `/data.json` (Public 폴더)을 `fetch`하여 데이터를 로드함.
- 그러나 `generate_data.ps1`은 루트의 `data.js` 파일만 갱신하며, `public/data.json`은 자동으로 갱신하지 않음.
- 또한, 최근 작업에서 `public/data.json`을 `public/data_updated_3_22_3_36.json`으로 이름을 변경함으로써 앱이 최신 데이터를 참조하지 못하는 상태가 됨.

### D. 원천 데이터 인코딩 이슈
- `4.han bal.txt`, `7.dan.txt` 등 원천 파일들에서 한글이 `?`와 같이 깨져 있는 현상이 발견됨. (UTF-8 with BOM vs UTF-8 mismatch 추정)

## 3. 세부 기술 데이터
- **Sutra 3.21 발음**: `etena śabdādy-antardhānam uktam` (현재 3.22 페이지에 출력 중인 내용)
- **Sutra 3.22 발음**: `sopakramam nirupakramam ca karma...` (출력되어야 할 내용)
- **데이터 일치성**: 원천 `.txt` 파일들에는 데이터가 있으나, 빌드 산출물에는 누락됨.

## 4. 향후 대응 방향
- `generate_data.ps1`의 파싱 로직을 강화하여 Sutra 누락 방지.
- `data_updated_3_22_3_36.json`의 깨진 한글을 복구하고 이를 `public/data.json`으로 정식 통합.
- 원천 `.txt` 파일들의 인코딩을 UTF-8(BOM 없음)으로 통일하여 파이프라인 안정성 확보.
