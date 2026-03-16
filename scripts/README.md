# Scripts

이 폴더는 Yoga 프로젝트의 데이터 생성, 검증, 정리용 유틸리티를 모아둔 곳이다.

## 디렉터리 기준

- 원천 텍스트: `../data-source/`
- 토큰 매칭 JSON: `../data-source/han-json/`
- 생성 대상:
  - `../data.js`
  - `../public/data.json`

## 대표 스크립트

- `generate_data.ps1`: 원천 텍스트를 읽어 `data.js`와 `public/data.json` 생성
- `merge_tokens.ps1`: `han-json` 결과를 `data.js`에 병합
- `update_dictionary.ps1`, `update_dictionary.cjs`: 사전/원문 기준으로 `data.js` 갱신
- `check_audio_mismatch.cjs`: 데이터와 MP3 파일 매칭 검사
- `verify_data.cjs`, `verify_phase19.ps1`: 특정 데이터 구간 검증

## 주의

- 현재 React 앱은 `public/data.json`을 읽는다.
- 따라서 `generate_data.ps1`를 실행하면 React 앱이 소비하는 기본 데이터와 직접 연결된다.
- 과거 버전 백업은 `../data-source/archive/data_updated_3_22_3_36.json`에 보관했다.
