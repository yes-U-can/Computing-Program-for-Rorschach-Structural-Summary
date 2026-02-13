'use client';

import { useState, useCallback, useMemo } from 'react';
import type { RorschachResponse, CalculationResult } from '@/types';
import { calculateStructuralSummary } from '@/lib/calculator';
import { SAMPLE_DATA } from '@/lib/sampleData';

function createEmptyResponse(): RorschachResponse {
  return {
    card: '',
    response: '',
    location: '',
    dq: '',
    determinants: [],
    fq: '',
    pair: 'none',
    contents: [],
    popular: false,
    z: '',
    specialScores: []
  };
}

export function useRorschachForm(initialResponses?: RorschachResponse[]) {
  const [responses, setResponses] = useState<RorschachResponse[]>(
    initialResponses || [createEmptyResponse()]
  );
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Calculate structural summary
  const calculate = useCallback(() => {
    setIsCalculating(true);

    // Filter out empty responses
    const validResponses = responses.filter(r => r.card);

    if (validResponses.length === 0) {
      setResult({
        success: false,
        errors: [{ field: 'responses', message: 'No valid responses to calculate.' }]
      });
      setIsCalculating(false);
      return;
    }

    // Simulate brief calculation time for UX
    setTimeout(() => {
      const calcResult = calculateStructuralSummary(validResponses);
      setResult(calcResult);
      setIsCalculating(false);
      if (calcResult.success) {
        setShowResult(true);
      }
    }, 500);
  }, [responses]);

  // Reset form
  const reset = useCallback(() => {
    setResponses([createEmptyResponse()]);
    setResult(null);
    setShowResult(false);
  }, []);

  // Load sample data
  const loadSampleData = useCallback(() => {
    setResponses(SAMPLE_DATA);
    setResult(null);
    setShowResult(false);
  }, []);

  // Load custom data
  const loadData = useCallback((data: RorschachResponse[]) => {
    setResponses(data.length > 0 ? data : [createEmptyResponse()]);
    setResult(null);
    setShowResult(false);
  }, []);

  // Back to input
  const backToInput = useCallback(() => {
    setShowResult(false);
  }, []);

  // Get valid response count
  const validResponseCount = useMemo(() => {
    return responses.filter(r => r.card).length;
  }, [responses]);

  return {
    responses,
    setResponses,
    result,
    isCalculating,
    showResult,
    calculate,
    reset,
    loadSampleData,
    loadData,
    backToInput,
    validResponseCount
  };
}
