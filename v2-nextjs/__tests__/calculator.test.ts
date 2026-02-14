import { describe, expect, it } from 'vitest';

import { calculateStructuralSummary } from '@/lib/calculator';
import { SAMPLE_DATA } from '@/lib/sampleData';

describe('calculateStructuralSummary', () => {
  it('returns successful calculation result for sample data', () => {
    const result = calculateStructuralSummary(SAMPLE_DATA);

    expect(result.success).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
  });

  it('calculates required upper section fields', () => {
    const result = calculateStructuralSummary(SAMPLE_DATA);
    const upper = result.data?.upper_section;

    expect(upper).toBeDefined();

    expect(upper?.Zf).toBe(12);
    expect(upper?.ZSum).not.toBeNull();
    expect(upper?.ZSum).not.toBeUndefined();
    expect(upper?.ZEst).not.toBeNull();
    expect(upper?.ZEst).not.toBeUndefined();
    expect(upper?.Zd).not.toBeNull();
    expect(upper?.Zd).not.toBeUndefined();

    expect(upper?.W).toBe(10);
    expect(upper?.D).toBe(4);
    expect(upper?.Dd).toBe(1);
    expect(upper?.S).toBe(1);
  });

  it('calculates required lower section fields', () => {
    const result = calculateStructuralSummary(SAMPLE_DATA);
    const lower = result.data?.lower_section;

    expect(lower).toBeDefined();

    expect(lower?.R).toBe(15);
    expect(lower?.Lambda).not.toBeNull();
    expect(lower?.Lambda).not.toBeUndefined();
    expect(lower?.EB).not.toBeNull();
    expect(lower?.EB).not.toBeUndefined();
    expect(lower?.EA).not.toBeNull();
    expect(lower?.EA).not.toBeUndefined();
  });

  it('calculates required special indices fields', () => {
    const result = calculateStructuralSummary(SAMPLE_DATA);
    const specialIndices = result.data?.special_indices;

    expect(specialIndices).toBeDefined();

    expect(specialIndices?.PTI).not.toBeNull();
    expect(specialIndices?.PTI).not.toBeUndefined();
    expect(specialIndices?.DEPI).not.toBeNull();
    expect(specialIndices?.DEPI).not.toBeUndefined();
    expect(specialIndices?.CDI).not.toBeNull();
    expect(specialIndices?.CDI).not.toBeUndefined();
    expect(specialIndices?.SCON).not.toBeNull();
    expect(specialIndices?.SCON).not.toBeUndefined();
    expect(specialIndices?.HVI).not.toBeNull();
    expect(specialIndices?.HVI).not.toBeUndefined();
    expect(specialIndices?.OBS).not.toBeNull();
    expect(specialIndices?.OBS).not.toBeUndefined();
  });
});
