import { describe, expect, it } from 'vitest';
import {
  VaquinhaHistoryTimeline,
  YearFilter,
  VaquinhaHistoryFormDialog,
} from './index';

describe('vaquinha-history exports', () => {
  it('should export components', () => {
    expect(VaquinhaHistoryTimeline).toBeDefined();
    expect(YearFilter).toBeDefined();
    expect(VaquinhaHistoryFormDialog).toBeDefined();
  });
});
