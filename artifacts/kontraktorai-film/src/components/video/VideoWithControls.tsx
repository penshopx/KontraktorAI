import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import VideoTemplate, { SCENE_DURATIONS } from './VideoTemplate';
import { useSceneControls } from './useSceneControls';

const SCENE_DETAILS = [
  { title: 'Pekerjaan nyata', filePath: 'src/components/video/scenes/Scene01.tsx' },
  { title: 'Masuk bertahap', filePath: 'src/components/video/scenes/Scene02.tsx' },
  { title: 'Satu ekosistem', filePath: 'src/components/video/scenes/Scene03.tsx' },
  { title: 'AI Concierge', filePath: 'src/components/video/scenes/Scene04.tsx' },
  { title: 'Langkah berikutnya', filePath: 'src/components/video/scenes/Scene05.tsx' },
];

function formatTime(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function VideoWithControls() {
  const isIframed = typeof window !== 'undefined' && window.self !== window.top;
  const {
    sceneKeys, activeIndex, locked, paused, mountKey, tick, durations,
    activeDuration, activeStartTime, totalDuration, onSceneChange, jumpTo,
    toggleLock, togglePause,
  } = useSceneControls(SCENE_DURATIONS);
  const [muted, setMuted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tapPinned, setTapPinned] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const elapsedBaseRef = useRef(0);
  const sensorRef = useRef<HTMLDivElement | null>(null);

  const handleJumpTo = useCallback((index: number) => {
    jumpTo(index);
    const detail = SCENE_DETAILS[index];
    if (!detail) return;
    window.parent.postMessage({
      type: 'REPLIT_VIDEO_SCENE_SELECTED',
      payload: {
        sceneIndex: index,
        sceneCount: sceneKeys.length,
        sceneTitle: detail.title,
        filePath: detail.filePath,
        lineNumber: 1,
      },
    }, '*');
  }, [jumpTo, sceneKeys.length]);

  useEffect(() => {
    if (!paused) return;
    const frozen = document.getAnimations().filter((animation) => animation.playState === 'running');
    frozen.forEach((animation) => animation.pause());
    return () => frozen.forEach((animation) => animation.play());
  }, [paused]);

  useEffect(() => {
    setElapsed(0);
    elapsedBaseRef.current = 0;
  }, [tick]);

  useEffect(() => {
    if (paused) return;
    const start = performance.now();
    const id = window.setInterval(() => setElapsed(elapsedBaseRef.current + performance.now() - start), 60);
    return () => {
      window.clearInterval(id);
      elapsedBaseRef.current += performance.now() - start;
    };
  }, [tick, paused]);

  useEffect(() => {
    if (!(collapsed && tapPinned)) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      if (sensorRef.current && !sensorRef.current.contains(event.target as Node)) setTapPinned(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [collapsed, tapPinned]);

  const visible = !collapsed || hovering || tapPinned;
  const totalElapsed = Math.min(totalDuration, activeStartTime + Math.min(elapsed, activeDuration));

  if (!isIframed) return <VideoTemplate />;
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#101c23' }}>
      <VideoTemplate
        key={mountKey}
        durations={durations}
        loop
        paused={paused}
        muted={muted}
        onSceneChange={onSceneChange}
      />
      <div
        ref={sensorRef}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50, height: '25%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
        onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovering(true); }}
        onPointerLeave={(event) => { if (event.pointerType === 'mouse') setHovering(false); }}
        onPointerDown={(event) => { if (event.pointerType !== 'mouse' && collapsed) setTapPinned(true); }}
      >
        <div style={{ flex: 1, width: '100%' }} aria-hidden="true" />
        <div aria-hidden={!visible} style={{
          display: 'flex', alignItems: 'center', gap: '1.1vmin', padding: '1.25vmin 1.5vmin',
          background: 'rgba(8,17,22,.78)', backdropFilter: 'blur(12px)',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none',
          transition: 'transform 200ms ease-out, opacity 200ms ease-out',
          color: '#edf3f5', font: '1.2vmin var(--font-mono)',
        }}>
          <button onClick={togglePause} aria-label={paused ? 'Putar' : 'Jeda'} style={controlButton}>{paused ? '▶' : 'Ⅱ'}</button>
          <button onClick={toggleLock} aria-label={locked ? 'Ulangi adegan: aktif' : 'Ulangi adegan'} aria-pressed={locked} style={{ ...controlButton, color: locked ? '#8bdcff' : '#9aabb4' }}>↻</button>
          <button onClick={() => setMuted((value) => !value)} aria-label={muted ? 'Aktifkan audio' : 'Bisukan audio'} style={{ ...controlButton, color: muted ? '#9aabb4' : '#8bdcff' }}>{muted ? 'MUTE' : 'AUDIO'}</button>
          <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,.18)' }} />
          <div style={{ display: 'flex', flex: 1, gap: 4, alignItems: 'center' }}>
            {sceneKeys.map((key, index) => {
              const fill = index === activeIndex && activeDuration > 0 ? Math.min(100, elapsed / activeDuration * 100) : 0;
              return <button key={key} onClick={() => handleJumpTo(index)} aria-label={`Lompat ke adegan ${index + 1}`} style={{ position: 'relative', height: 8, flex: 1, overflow: 'hidden', border: 0, borderRadius: 8, background: 'rgba(237,243,245,.22)', padding: 0, cursor: 'pointer' }}>
                <span style={{ position: 'absolute', inset: '0 auto 0 0', width: `${fill}%`, background: '#8bdcff', borderRadius: 8 }} />
              </button>;
            })}
          </div>
          <span>{activeIndex + 1}/{sceneKeys.length}</span>
          <span style={{ minWidth: '10ch', textAlign: 'right' }}>{formatTime(totalElapsed)} / {formatTime(totalDuration)}</span>
          <button onClick={() => { if (!collapsed) { setHovering(false); setTapPinned(false); } setCollapsed((value) => !value); }} aria-label={collapsed ? 'Tampilkan kontrol' : 'Sembunyikan kontrol'} style={controlButton}>{collapsed ? '⌃' : '⌄'}</button>
        </div>
      </div>
    </div>
  );
}

const controlButton: CSSProperties = {
  minWidth: '5.4vmin',
  height: '5.4vmin',
  border: '1px solid rgba(139,220,255,.18)',
  borderRadius: 8,
  background: 'rgba(255,255,255,.035)',
  color: '#edf3f5',
  font: '700 1.4vmin var(--font-mono)',
  cursor: 'pointer',
};
