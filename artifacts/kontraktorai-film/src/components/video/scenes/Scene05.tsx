import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSceneTimer } from '@/lib/video';
import { easeOut, LogoLockup, SceneExit } from '../FilmKit';

export function Scene05() {
  const [beat, setBeat] = useState(0);
  useSceneTimer([
    { time: 200, callback: () => setBeat(1) },
    { time: 960, callback: () => setBeat(2) },
    { time: 1780, callback: () => setBeat(3) },
    { time: 2500, callback: () => setBeat(4) },
    { time: 3240, callback: () => setBeat(5) },
  ]);
  return (
    <SceneExit pale>
      <div className="film-grain" style={{ opacity: .04 }} />
      <motion.svg viewBox="0 0 1920 1080" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <motion.path d="M0 555H405L545 405H920L1068 555H1410" fill="none" stroke="#3b90b2" strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.45, ease: 'easeInOut' }} />
        <motion.circle cx="1410" cy="555" r="10" fill="#3b90b2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, duration: .28 }} />
      </motion.svg>
      <div style={{ position: 'absolute', left: '9%', top: '25%', width: '56%', zIndex: 2 }}>
        <motion.div style={{ fontSize: '7.6vmin', fontWeight: 700, letterSpacing: '-.07em', lineHeight: .95, color: '#243b47' }} initial={{ opacity: 0, x: -26 }} animate={{ opacity: beat >= 1 ? 1 : 0, x: beat >= 1 ? 0 : -26 }} transition={{ duration: .4, ease: easeOut }}>DARI GUSTAFTA.</motion.div>
        <motion.div style={{ fontSize: '7.6vmin', fontWeight: 700, letterSpacing: '-.07em', lineHeight: .95, color: '#3a7f99', marginTop: '1.2vmin' }} initial={{ opacity: 0, x: 25 }} animate={{ opacity: beat >= 2 ? 1 : 0, x: beat >= 2 ? 0 : 25 }} transition={{ duration: .4, ease: easeOut }}>UNTUK INDUSTRI.</motion.div>
        <motion.div className="film-copy" style={{ marginTop: '3.2vmin', color: '#516a75' }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: beat >= 5 ? 1 : 0, y: beat >= 5 ? 0 : 12 }}>Mulai dari konstruksi. Tumbuh bertahap.</motion.div>
      </div>
      <motion.div style={{ position: 'absolute', left: '67%', top: '39%', zIndex: 2, padding: '3vmin 3.5vmin', background: '#12232c', border: '1px solid rgba(44,93,113,.25)' }} initial={{ opacity: 0, scale: .8, y: 18 }} animate={{ opacity: beat >= 3 ? 1 : 0, scale: beat >= 3 ? 1 : .8, y: beat >= 3 ? 0 : 18 }} transition={{ duration: .55, ease: easeOut }}>
        <LogoLockup width="28vmin" />
        <motion.div style={{ color: '#516a75', marginTop: '1.8vmin', fontSize: '2.8vmin', letterSpacing: '.02em' }} initial={{ opacity: 0 }} animate={{ opacity: beat >= 4 ? 1 : 0 }} transition={{ duration: .35 }}>Didukung Gustafta.</motion.div>
      </motion.div>
      <motion.div className="film-mono" style={{ position: 'absolute', left: '9%', bottom: '12%', color: '#66808c', fontSize: '1.95vmin' }} initial={{ opacity: 0 }} animate={{ opacity: beat >= 5 ? .9 : 0 }} transition={{ duration: .35 }}>
        ARAH STRATEGIS · BUKAN KLAIM IMPLEMENTASI
      </motion.div>
      <motion.div style={{ position: 'absolute', left: '-3%', top: '20.4%', width: '2vmin', height: '2vmin', borderRadius: '50%', background: '#3a90b1' }} animate={{ x: ['0vw', '86vw'], opacity: [0, 1, 1] }} transition={{ delay: 4.55, duration: .95, ease: 'easeInOut' }} />
    </SceneExit>
  );
}
