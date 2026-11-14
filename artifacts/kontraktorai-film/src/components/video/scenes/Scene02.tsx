import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSceneTimer } from '@/lib/video';
import { easeOut, SceneExit } from '../FilmKit';

const sectors = [
  { label: 'KONSTRUKSI', x: 23, y: 55, phase: 'MASUK PERTAMA' },
  { label: 'ENERGI · KELISTRIKAN', x: 47, y: 34, phase: 'TAHAP BERIKUTNYA' },
  { label: 'PERTAMBANGAN', x: 68, y: 60, phase: 'BERTAHAP' },
  { label: 'LINGKUNGAN', x: 85, y: 39, phase: 'BERTAHAP' },
];

export function Scene02() {
  const [count, setCount] = useState(0);
  const [collapse, setCollapse] = useState(false);
  useSceneTimer([
    { time: 440, callback: () => setCount(1) },
    { time: 1580, callback: () => setCount(2) },
    { time: 2780, callback: () => setCount(3) },
    { time: 3560, callback: () => setCount(4) },
    { time: 4350, callback: () => setCount(5) },
    { time: 5250, callback: () => setCollapse(true) },
  ]);
  return (
    <SceneExit>
      <div className="film-stage" style={{ background: '#14232c' }} />
      <div style={{ position: 'absolute', top: '10%', left: '7%', zIndex: 3 }}>
        <div className="film-eyebrow">FOKUS INDUSTRI · EKSPANSI BERTAHAP</div>
        <div style={{ marginTop: '1.6vmin', fontSize: '7.5vmin', letterSpacing: '-.06em', fontWeight: 700 }}>MASUK BERTAHAP.</div>
      </div>
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <motion.path d="M1598 220L470 470L745 650L1010 420L1280 615L1630 430" fill="none" stroke="#8bdcff" strokeWidth="2" strokeDasharray="10 13" initial={{ pathLength: 0, opacity: .2 }} animate={{ pathLength: .95, opacity: .6 }} transition={{ duration: 2.4, delay: .2 }} />
        <motion.path d="M250 595L470 470" fill="none" stroke="#8bdcff" strokeWidth="5" initial={{ pathLength: 0 }} animate={{ pathLength: count > 0 ? 1 : 0 }} transition={{ duration: .6 }} />
      </svg>
      <motion.div className="film-node" style={{ position: 'absolute', left: '83.2%', top: '20.4%', width: '4.4vmin', height: '4.4vmin', zIndex: 2, translate: '-50% -50%' }} initial={{ scale: .65, opacity: .5 }} animate={{ scale: [1.35, 1, .72], opacity: [.9, .7, .1] }} transition={{ duration: 1.15, ease: easeOut }} />
      {sectors.map((sector, index) => {
        const active = count > index;
        return (
          <div key={sector.label} style={{ position: 'absolute', left: `${sector.x}%`, top: `${sector.y}%`, zIndex: 2, transform: 'translate(-50%,-50%)', textAlign: index === 0 ? 'left' : 'center' }}>
            <motion.div className="film-node" style={{ width: index === 0 ? '17vmin' : '10vmin', height: index === 0 ? '17vmin' : '10vmin', margin: '0 auto', background: active ? 'rgba(139,220,255,.14)' : 'rgba(139,220,255,.035)', borderColor: active ? '#8bdcff' : 'rgba(139,220,255,.4)' }} initial={{ scale: .65, opacity: .2 }} animate={{ scale: active ? [1.16, 1] : 1, opacity: active ? 1 : .43 }} transition={{ duration: .55, ease: easeOut }}>
              <motion.div style={{ position: 'absolute', inset: '30%', border: '1px solid rgba(139,220,255,.55)', borderRadius: '50%' }} animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }} />
            </motion.div>
            <motion.div className="film-mono" style={{ marginTop: '1.4vmin', fontSize: index === 0 ? '2.5vmin' : '2.25vmin', color: active ? '#edf3f5' : '#82949e', whiteSpace: 'nowrap' }} animate={{ opacity: active ? 1 : .4, y: active ? 0 : 5 }}>{sector.label}</motion.div>
            {index === 0 && <div className="film-mono" style={{ marginTop: '.6vmin', color: '#8bdcff', fontSize: '1.95vmin' }}>{sector.phase}</div>}
          </div>
        );
      })}
      <motion.div style={{ position: 'absolute', left: '7%', bottom: '11%', width: '49%', fontSize: '2.8vmin', lineHeight: 1.35, color: '#afbec5' }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: count >= 5 ? 1 : 0, x: count >= 5 ? 0 : -20 }} transition={{ duration: .45 }}>
        Konstruksi lebih dulu.<br />Sektor lain menyusul bertahap.
      </motion.div>
      <motion.div className="film-mono" style={{ position: 'absolute', right: '7%', bottom: '8%', color: '#718791', fontSize: '1.4vmin' }} animate={{ opacity: [.35, .8, .35] }} transition={{ duration: 2.4, repeat: Infinity }}>01 / 05 — PRIORITAS PASAR</motion.div>
      <motion.div style={{ position: 'absolute', left: '50%', top: '48%', translate: '-50% -50%', width: '3vmin', height: '3vmin', borderRadius: '50%', background: '#8bdcff', zIndex: 4 }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: collapse ? [0, 4, 7] : 0, opacity: collapse ? [0, .75, 0] : 0 }} transition={{ duration: .85, ease: easeOut }} />
    </SceneExit>
  );
}
