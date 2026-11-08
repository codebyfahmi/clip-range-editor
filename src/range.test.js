import { describe, expect, it } from 'vitest';
import { formatTime, normalizeRange } from './range.js';

describe('normalizeRange', () => {
  it('keeps a range inside the video duration', () => {
    expect(normalizeRange(-3, 99, 20)).toEqual({ start: 0, end: 20 });
  });

  it('maintains the minimum clip duration', () => {
    expect(normalizeRange(9.9, 10, 10)).toEqual({ start: 9.5, end: 10 });
  });
});

describe('formatTime', () => {
  it('formats seconds as minutes and seconds', () => {
    expect(formatTime(65)).toBe('01:05');
  });
});
