'use client';

import { useEffect, useCallback, useRef } from 'react';
import type { RorschachResponse } from '@/types';

const STORAGE_KEY = 'rorschach_autosave';
const DEBOUNCE_MS = 2000;

interface AutoSaveData {
  timestamp: string;
  responses: RorschachResponse[];
}

interface UseAutoSaveOptions {
  onSave?: () => void;
}

export function useAutoSave(responses: RorschachResponse[], options?: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  const lastSavedRef = useRef<string>('');

  // Save to localStorage with debounce
  const save = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Only save if there's actual content (at least one response with a card selected)
    const hasContent = responses.some(r => r.card);
    if (!hasContent) return;

    const dataString = JSON.stringify(responses);
    // Skip if data hasn't changed
    if (dataString === lastSavedRef.current) return;

    const data: AutoSaveData = {
      timestamp: new Date().toISOString(),
      responses
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      lastSavedRef.current = dataString;
      options?.onSave?.();
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [responses, options]);

  // Debounced save effect
  useEffect(() => {
    // Skip initial mount to avoid overwriting saved data
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(save, DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [responses, save]);

  // Load from localStorage
  const load = useCallback((): RorschachResponse[] | null => {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: AutoSaveData = JSON.parse(saved);
        return data.responses;
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return null;
  }, []);

  // Check if there's saved data
  const hasSavedData = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: AutoSaveData = JSON.parse(saved);
        return data.responses && data.responses.length > 0 && data.responses.some(r => r.card);
      }
    } catch {
      return false;
    }
    return false;
  }, []);

  // Get saved timestamp
  const getSavedTimestamp = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: AutoSaveData = JSON.parse(saved);
        return data.timestamp;
      }
    } catch {
      return null;
    }
    return null;
  }, []);

  // Clear saved data
  const clear = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }, []);

  return {
    save,
    load,
    clear,
    hasSavedData,
    getSavedTimestamp
  };
}
