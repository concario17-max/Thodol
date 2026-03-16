# Yoga

Yoga Sutras를 읽고 탐색하기 위한 React 기반 정적 앱입니다. 산스크리트 원문, 발음, 단어별 뜻, 번역문, 오디오, 개인 메모를 한 화면에서 다룰 수 있도록 구성되어 있습니다.

## Structure

- `src/`: 현재 운영 중인 React 앱
- `public/`: 앱이 직접 읽는 정적 자산과 데이터
- `data-source/`: 원천 텍스트, 토큰 매칭 JSON, 이전 데이터 아카이브
- `scripts/`: 데이터 생성, 검증, 정리 스크립트
- `legacy/`: 이전 정적 웹 구현
- `docs/`: 조사 및 기획 문서

## Data

현재 React 앱의 기본 데이터 소스는 `public/data.json`입니다.

- 앱 로딩: `src/utils/dataFetcher.ts`
- 생성 스크립트: `scripts/generate_data.ps1`
- 이전 데이터 백업: `data-source/archive/data_updated_3_22_3_36.json`

## Development

```bash
npm install
npm run dev
```

기본 검증 명령:

```bash
npm run typecheck
npm run test -- --run
npm run build
```

## Notes

- 접근 게이트는 클라이언트 로컬 스토리지 기반이며, 보안 경계가 아니라 가벼운 접근 제어 수준입니다.
- 데이터 제작 파이프라인은 `scripts/README.md`에 따로 정리해두었습니다.
- 레거시 앱은 참고용 보관 상태이며, 현재 기준 구현은 `src/` 아래 React 앱입니다.
