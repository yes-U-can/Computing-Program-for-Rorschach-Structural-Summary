/**
 * Rorschach Calculator v2.0.0
 * Input Validation Functions
 * 
 * index.html의 입력 검증 로직을 TypeScript로 이전
 */

import type { RorschachResponse, ValidationError } from '@/types';

/**
 * 단일 반응 행의 필수 필드 검증
 */
export function validateResponseRow(row: RorschachResponse, rowIndex: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!row.card || row.card.trim() === '') {
    errors.push({
      field: `card${rowIndex}`,
      message: `행 ${rowIndex}: 카드를 선택해주세요.`
    });
  }

  if (!row.location || row.location.trim() === '') {
    errors.push({
      field: `location${rowIndex}`,
      message: `행 ${rowIndex}: 위치(Location)를 선택해주세요.`
    });
  }

  if (!row.dq || row.dq.trim() === '') {
    errors.push({
      field: `dq${rowIndex}`,
      message: `행 ${rowIndex}: DQ를 선택해주세요.`
    });
  }

  if (!row.fq || row.fq.trim() === '') {
    errors.push({
      field: `fq${rowIndex}`,
      message: `행 ${rowIndex}: 형태질(Form Quality)을 선택해주세요.`
    });
  }

  // 최소 1개의 결정인(Determinant) 필요
  if (!row.determinants || row.determinants.length === 0) {
    errors.push({
      field: `det${rowIndex}_1`,
      message: `행 ${rowIndex}: 최소 1개의 결정인(Determinant)을 입력해주세요.`
    });
  }

  return errors;
}

/**
 * 모든 반응 행 검증
 */
export function validateAllResponses(responses: RorschachResponse[]): ValidationError[] {
  const errors: ValidationError[] = [];

  if (responses.length === 0) {
    errors.push({
      field: 'responses',
      message: '최소 1개 이상의 반응을 입력해주세요.'
    });
    return errors;
  }

  responses.forEach((row, index) => {
    const rowErrors = validateResponseRow(row, index + 1);
    errors.push(...rowErrors);
  });

  return errors;
}

/**
 * 반응 수(R) 검증
 * - 최소 14개 권장 (타당도)
 * - 최대 50개 제한
 */
export function validateResponseCount(R: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (R < 1) {
    errors.push({
      field: 'R',
      message: '반응 수가 0개입니다. 최소 1개 이상의 반응을 입력해주세요.'
    });
  } else if (R < 14) {
    errors.push({
      field: 'R',
      message: '⚠️ 타당도 주의: 반응 수가 14개 미만이면 프로파일의 타당도가 낮아져 해석의 신뢰도가 떨어질 수 있습니다.'
    });
  } else if (R >= 45) {
    errors.push({
      field: 'R',
      message: '💡 반응 과다 주의 (R ≥ 45): 반응 수가 너무 많습니다. 검사 실시 과정을 점검해 보세요.'
    });
  }

  return errors;
}

/**
 * 결정인(Determinant) 개수 검증
 * - 4개 이상은 드뭄 (과잉 채점 주의)
 */
export function validateDeterminantCount(determinants: string[], rowIndex: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (determinants.length >= 4) {
    errors.push({
      field: `det${rowIndex}`,
      message: `💡 과잉 채점 주의: 결정인이 ${determinants.length}개입니다. 1. 수검자가 직접 말한 내용인가요? 2. 혹시 형태(F)를 중복 채점하지 않았나요?`
    });
  }

  return errors;
}

/**
 * 내용(Content) 중복 검증
 * - 같은 범주는 한 번만 입력
 */
export function validateContentDuplication(contents: string[], rowIndex: number): ValidationError[] {
  const errors: ValidationError[] = [];

  // 같은 내용이 중복되어 있는지 확인
  const duplicates = contents.filter((item, index) => contents.indexOf(item) !== index);
  if (duplicates.length > 0) {
    errors.push({
      field: `con${rowIndex}`,
      message: `💡 범주 중복 확인: 같은 범주(예: 동물 A)는 한 번만 입력하세요.`
    });
  }

  return errors;
}

