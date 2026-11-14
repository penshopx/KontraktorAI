import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSceneTimer } from '@/lib/video';
import { easeOut, SceneExit } from '../FilmKit';

export function Scene01() {
  const [revealed, setRevealed] = useState(false);
  const [supportShown, setSupportShown] = useState(false);
  const [push, setPush] = useState(false);
  useSceneTimer([
    { time: 1120, callback: () => setRevealed(true) },
    { time: 3200, callback: () => setSupportShown(true) },
    { time: 4700, callback: () => setPush(true) },
  ]);
  return (
    <SceneExit>
      <div className="film-grid" />
      <div className="film-grain" />
      <div style={{ position: 'absolute', inset: '0 0 0 6%', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '67%', zIndex: 2 }}>
          <motion.div className="film-eyebrow" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .4 }}>
            AI UNTUK DUNIA KERJA INDUSTRI
          </motion.div>
          <motion.h1 className="film-headline" style={{ marginTop: '2.8vmin' }} initial={{ opacity: 0, x: -65, skewX: -7 }} animate={{ opacity: 1, x: 0, skewX: 0 }} transition={{ delay: .27, duration: .55, ease: easeOut }}>
            PEKERJAAN
          </motion.h1>
          <motion.h1 className="film-headline" style={{ marginTop: '.55vmin', color: '#8bdcff' }} initial={{ opacity: 0, scale: .86, transformOrigin: 'left center' }} animate={{ opacity: revealed ? 1 : .15, scale: revealed ? 1 : .86 }} transition={{ duration: .38, ease: easeOut }}>
            NYATA.
          </motion.h1>
          <motion.p className="film-copy" style={{ color: '#aab9c0', marginTop: '3vmin', maxWidth: '53vmin' }} initial={{ opacity: 0, y: 18 }} animate={{ opacity: supportShown ? 1 : 0, y: supportShown ? 0 : 18 }} transition={{ duration: .4 }}>
            Mulai dari kebutuhan di lapangan.
          </motion.p>
        </div>
      </div>
      <motion.svg viewBox="0 0 1920 1080" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <motion.path d="M1320 220H1598V812H1225" fill="none" stroke="#8bdcff" strokeWidth="3" initial={{ pathLength: 0, opacity: .3 }} animate={{ pathLength: 1, opacity: .83 }} transition={{ duration: 1.35, ease: 'easeInOut' }} />
        <motion.circle cx="1598" cy="220" r="9" fill="#8bdcff" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ delay: .92, duration: .36, ease: easeOut }} />
        <motion.path d="M1598 220V540H1260" fill="none" stroke="#8bdcff" strokeWidth="1.5" strokeDasharray="8 12" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: .44 }} transition={{ delay: 1.35, duration: .7 }} />
      </motion.svg>
      <motion.div style={{ position: 'absolute', left: '83.2%', top: '20.4%', width: '2.5vmin', height: '2.5vmin', border: '1px solid #8bdcff', borderRadius: '50%', zIndex: 1 }} animate={{ scale: push ? 4 : 1, opacity: push ? 0 : .75 }} transition={{ duration: 1.1, ease: easeOut }} />
      <motion.div className="film-footer" animate={{ opacity: [.45, .8, .55] }} transition={{ duration: 3, repeat: Infinity }}>GUSTAFTA / KONTRAKTORAI — ARAH STRATEGIS</motion.div>
    </SceneExit>
  );
}
