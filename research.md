# 한글 발음 미출력 원인 분석 및 해결 보고서

## 1. 문제 현상
- 데이터 파이프라인 복구 후에도 프론트엔드 화면에서 한글 발음(KR Pronunciation)이 전혀 나타나지 않음.

## 2. 분석 결과 (Root Cause)
### A. 데이터-코드 필드명 불일치 (Property Name Mismatch)
- **파이프라인 (`generate_data.ps1`)**: `4.han bal.txt` 파일을 처리하여 JSON의 `pronunciation_kr` 필드에 저장함.
- **프론트엔드 (`VerseView.tsx`)**: 데이터 객체에서 `verseData['4.han bal']`이라는 과거의 비표준 필드명을 참조하고 있음.
- **결과**: `verseData['4.han bal']`은 `undefined`가 되어 `SutraContent` 컴포넌트에 빈 값이 전달됨.

### B. 타입 정의 중복
- `src/types.ts`에 `pronunciation_kr`과 `4.han bal`이 혼재되어 있어 개발 시 혼동을 초래함.

## 3. 해결 전략
1. **표준화**: 공백이 포함된 `4.han bal` 대신 `pronunciation_kr`을 프로젝트 전반의 표준 필드명으로 채택함 (Ray의 클린 코드 기준 준수).
2. **코드 수정**:
    - `VerseView.tsx`에서 한글 발음 참조 로직을 `verseData.pronunciation_kr`로 변경.
    - `types.ts`에서 불필요한 필드 정의 제거 및 최적화.
3. **무결성 검증**: `data.js`의 실제 데이터 구조와 프론트엔드가 정확히 맞물리는지 확인.

## 4. 최종 확인
- 수정 후 3장 22절(`3.22`) 및 기타 구절에서 한글 발음이 정상적으로 렌더링됨을 확인함.
