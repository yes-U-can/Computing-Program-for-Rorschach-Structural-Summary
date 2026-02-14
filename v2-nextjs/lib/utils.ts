/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Rorschach Calculator v2.0.0
 * Utility Functions
 * 
 * Code.gs의 유틸리티 함수들을 TypeScript로 이전
 */

/**
 * 입력값을 안전한 문자열로 변환합니다 (null/undefined -> '', trim)
 */
export function val(x: any): string {
  if (x === null || x === undefined) return '';
  const t = String(x).trim();
  return t === '' ? '' : t;
}

/**
 * 숫자를 소수점 첫째 자리 문자열로 포맷합니다.
 */
export function fix1(n: number | string): string {
  return Number(n).toFixed(1);
}

/**
 * 숫자를 소수점 둘째 자리 문자열로 포맷합니다.
 */
export function fix2(n: number | string): string {
  return Number(n).toFixed(2);
}

/**
 * Zf 값에 해당하는 ZEst 값을 반환합니다.
 */
export function zestFromZf(zf: number, zestTable: readonly (number | null)[]): number | null {
  if (typeof zf !== 'number' || !Number.isFinite(zf)) return null;
  if (zf < 1 || zf >= zestTable.length) return null;
  return zestTable[zf - 1];
}

/**
 * (EA - es) 값에 해당하는 D 점수(-5 ~ 5)를 계산합니다.
 */
export function dTable(
  x: number,
  min: number = -15,
  max: number = 15,
  divisor: number = 2.5,
  offset: number = 0.25
): number | '-' {
  if (x < min) return -5;
  if (x > max) return 5;
  if (typeof x !== 'number' || !Number.isFinite(x)) return '-';
  if (x >= 0) return Math.trunc((x - offset) / divisor);
  return -Math.trunc(((-x) - offset) / divisor);
}

