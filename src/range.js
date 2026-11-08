export const MIN_CLIP_DURATION = 0.5;

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function normalizeRange(start, end, duration, minimumDuration = MIN_CLIP_DURATION) {
  const safeDuration = Math.max(0, Number(duration) || 0);
  const maxStart = Math.max(0, safeDuration - minimumDuration);
  const safeStart = clamp(Number(start) || 0, 0, maxStart);
  const safeEnd = clamp(Number(end) || safeDuration, safeStart + minimumDuration, safeDuration);
  return { start: safeStart, end: safeEnd };
}

export function formatTime(value) {
  const seconds = Math.max(0, Math.round(Number(value) || 0));
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
