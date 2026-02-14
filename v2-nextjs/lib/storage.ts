/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Rorschach Calculator v2.0.0
 * LocalStorage 유틸리티 함수
 * 
 * index.html의 자동 저장 로직을 순수 함수로 분리
 */

export const STORAGE_KEYS = {
  FORM_DATA: 'rorschach_calculator_data',
  LANGUAGE: 'app_language',
} as const;

export interface StoredFormData {
  [key: string]: any;
  _currentRowCount?: number;
  _timestamp?: string;
}

/**
 * LocalStorage에서 데이터 불러오기
 */
export function loadFromStorage<T = any>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Failed to load from localStorage (${key}):`, error);
    return null;
  }
}

/**
 * LocalStorage에 데이터 저장하기
 */
export function saveToStorage<T = any>(key: string, data: T): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Failed to save to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * LocalStorage에서 데이터 삭제하기
 */
export function removeFromStorage(key: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove from localStorage (${key}):`, error);
    return false;
  }
}

/**
 * 폼 데이터 자동 저장
 */
export function autoSaveFormData(data: StoredFormData): boolean {
  return saveToStorage(STORAGE_KEYS.FORM_DATA, {
    ...data,
    _timestamp: new Date().toISOString(),
  });
}

/**
 * 폼 데이터 불러오기
 */
export function loadFormData(): StoredFormData | null {
  return loadFromStorage<StoredFormData>(STORAGE_KEYS.FORM_DATA);
}

