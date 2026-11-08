import { useMemo, useRef, useState } from 'react';
import { formatTime, MIN_CLIP_DURATION, normalizeRange } from './range.js';

const DEMO_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const ASPECT_RATIOS = ['9:16', '1:1', '16:9'];

export default function App() {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [range, setRange] = useState({ start: 0, end: 10 });
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('9:16');

  const safeRange = useMemo(
    () => normalizeRange(range.start, range.end, duration || 10),
    [range, duration],
  );
  const selectionLeft = duration ? (safeRange.start / duration) * 100 : 0;
  const selectionWidth = duration ? ((safeRange.end - safeRange.start) / duration) * 100 : 100;

  function setStart(nextStart) {
    const next = normalizeRange(nextStart, safeRange.end, duration || 10);
    setRange(next);
    seek(next.start);
  }

  function setEnd(nextEnd) {
    const next = normalizeRange(safeRange.start, nextEnd, duration || 10);
    setRange(next);
    if (currentTime > next.end) seek(next.start);
  }

  function seek(time) {
    const nextTime = Math.min(Math.max(time, safeRange.start), safeRange.end);
    setCurrentTime(nextTime);
    if (videoRef.current) videoRef.current.currentTime = nextTime;
  }

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      return;
    }
    if (video.currentTime < safeRange.start || video.currentTime >= safeRange.end) {
      video.currentTime = safeRange.start;
    }
    await video.play();
  }

  function handleTimeUpdate(event) {
    const video = event.currentTarget;
    if (video.currentTime >= safeRange.end) {
      video.currentTime = safeRange.start;
      setCurrentTime(safeRange.start);
      video.play().catch(() => setIsPlaying(false));
      return;
    }
    setCurrentTime(video.currentTime);
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">React video utility</p>
        <h1>Clip Range Editor</h1>
        <p className="lede">A small, accessible editor for selecting and previewing a precise video range.</p>
      </section>

      <section className="editor" aria-label="Video range editor">
        <div className={`video-frame ratio-${aspectRatio.replace(':', '-')}`}>
          <video
            ref={videoRef}
            src={DEMO_VIDEO}
            preload="metadata"
            onLoadedMetadata={(event) => {
              const nextDuration = event.currentTarget.duration;
              setDuration(nextDuration);
              setRange(normalizeRange(0, Math.min(10, nextDuration), nextDuration));
            }}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>

        <div className="toolbar">
          <button className="primary" type="button" onClick={togglePlayback}>
            {isPlaying ? 'Pause selection' : 'Play selection'}
          </button>
          <output aria-live="polite">{formatTime(currentTime)} <span>of {formatTime(safeRange.end)}</span></output>
          <div className="ratio-picker" aria-label="Output aspect ratio">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                className={ratio === aspectRatio ? 'selected' : ''}
                type="button"
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <div className="timeline" aria-label="Clip selection timeline">
          <div className="filmstrip" aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => <span key={index} />)}
          </div>
          <div className="selection" style={{ left: `${selectionLeft}%`, width: `${selectionWidth}%` }} />
          <input
            aria-label="Clip start"
            type="range"
            min="0"
            max={Math.max(duration - MIN_CLIP_DURATION, 0)}
            step="0.1"
            value={safeRange.start}
            onChange={(event) => setStart(event.target.value)}
          />
          <input
            aria-label="Clip end"
            type="range"
            min={MIN_CLIP_DURATION}
            max={duration || 10}
            step="0.1"
            value={safeRange.end}
            onChange={(event) => setEnd(event.target.value)}
          />
        </div>

        <div className="inputs">
          <label>Start <strong>{formatTime(safeRange.start)}</strong></label>
          <label>End <strong>{formatTime(safeRange.end)}</strong></label>
          <label>Duration <strong>{(safeRange.end - safeRange.start).toFixed(1)}s</strong></label>
        </div>
      </section>
    </main>
  );
}
