# Yoga

요가 수트라를 장별로 읽고, 발음과 번역을 비교하며, 개인 메모를 남길 수 있는 React 기반 정적 앱입니다.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Framer Motion
- Vitest

## Project Layout

- `src/`: 현재 운영 중인 프론트엔드 앱
- `public/`: 앱이 직접 읽는 정적 자산과 데이터
- `data-source/`: 원천 텍스트, 토큰 매칭, 백업 데이터
- `scripts/`: 데이터 생성 및 검증 스크립트
- `legacy/`: 과거 정적 구현 보관본
- `docs/`: 조사 문서와 메모

## Data Flow

앱의 기준 데이터는 `public/data.json`입니다.

- 로딩 코드: `src/utils/dataFetcher.ts`
- 생성 스크립트: `scripts/generate_data.ps1`
- 이전 백업: `data-source/archive/data_updated_3_22_3_36.json`

`dataFetcher`는 메모리 캐시와 in-flight 요청 캐시를 사용하므로, 여러 컴포넌트가 동시에 데이터를 요청해도 중복 네트워크 요청을 줄입니다.

## Local Development

Node가 시스템 PATH에 없으면 로컬 툴 경로를 먼저 잡아야 할 수 있습니다.

```bash
npm install
npm run dev
```

검증 명령:

```bash
npm run typecheck
npm run test -- --run
npm run build
```

브라우저 스모크 QA:

```bash
npm run dev -- --host 127.0.0.1 --port 4174
BASE_URL=http://127.0.0.1:4174 npm run qa:browser
```

## QA Notes

최근 점검에서 아래 항목을 정리했습니다.

- 홈 화면, 챕터 화면, 사이드바, 오른쪽 패널의 깨진 문자열 복구
- 상단 패널 토글 UI 개선
- 모바일 드로어 상태 정리
- 챕터 메타 데이터 복구
- 노트 미리보기 텍스트 추출 로직 보정

남은 QA는 실제 배포 URL에서 최종 시각 검수 정도입니다.

## Deployment Prep

이 프로젝트는 정적 빌드 결과물 `dist/`를 배포하면 됩니다.

기본 배포 순서:

```bash
npm install
npm run build
```

배포 전 확인 항목:

- `public/data.json`이 최신인지 확인
- `npm run typecheck`
- `npm run test -- --run`
- `npm run build`
- 비밀번호 게이트용 `VITE_GATEWAY_PASSWORD` 설정 여부 확인

Cloudflare Pages 같은 정적 호스팅을 사용할 경우:

- Build command: `npm run build`
- Output directory: `dist`

## Notes

- 비밀번호 게이트는 `localStorage` 기반의 가벼운 접근 제어입니다.
- 레거시 구현은 참고용이며, 현재 기준 앱은 `src/` 아래 React 앱입니다.
- 데이터 파이프라인 상세는 `scripts/README.md`에 정리되어 있습니다.
