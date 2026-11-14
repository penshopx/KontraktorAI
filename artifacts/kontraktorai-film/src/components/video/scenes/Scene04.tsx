import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSceneTimer } from '@/lib/video';
import { easeOut, SceneExit } from '../FilmKit';

const routes = ['PENGETAHUAN', 'TEMUKAN SOLUSI', 'KONSULTASI', 'KOLABORASI'];

export function Scene04() {
  const [count, setCount] = useState(0);
  const [qualified, setQualified] = useState(false);
  useSceneTimer([
    { time: 1700, callback: () => setCount(1) },
    { time: 2350, callback: () => setCount(2) },
    { time: 3000, callback: () => setCount(3) },
    { time: 3650, callback: () => setCount(4) },
    { time: 4300, callback: () => setQualified(true) },
  ]);
  return (
    <SceneExit>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 48% 54%, rgba(40,91,112,.25), transparent 53%)' }} />
      <div className="film-eyebrow" style={{ position: 'absolute', left: '7%', top: '10%' }}>ARAH STRATEGIS</div>
      <motion.div style={{ position: 'absolute', left: '39%', top: '52%', translate: '-50% -50%', width: '51vmin', height: '51vmin', borderRadius: '50%', border: '2px solid rgba(139,220,255,.78)' }} initial={{ scale: .15, opacity: .2 }} animate={{ scale: [1.04, 1, 2.5], opacity: [1, 1, 0] }} transition={{ duration: 5.9, times: [0, .76, 1], ease: easeOut }}>
        <motion.div style={{ position: 'absolute', inset: '8%', borderRadius: '50%', border: '1px solid rgba(139,220,255,.28)' }} animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.2, repeat: Infinity }} />
        <motion.div style={{ position: 'absolute', left: '50%', top: '-1.2vmin', width: '2.4vmin', height: '2.4vmin', borderRadius: '50%', background: '#8bdcff' }} animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} />
      </motion.div>
      <div style={{ position: 'absolute', left: '7%', top: '34%', zIndex: 2 }}>
        <motion.div style={{ fontWeight: 700, fontSize: '8vmin', lineHeight: .92, letterSpacing: '-.07em' }} initial={{ opacity: 0, x: -35 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .65, duration: .5 }}>AI<br />CONCIERGE</motion.div>
        <motion.div className="film-eyebrow" style={{ marginTop: '2vmin', fontSize: '1.95vmin', maxWidth: '36vmin', lineHeight: 1.6, color: '#a9bac2' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15 }}>GERBANG MENUJU EKOSISTEM GUSTAFTA</motion.div>
      </div>
      {routes.map((route, i) => (
        <motion.div key={route} className="film-mono" style={{ position: 'absolute', left: `${55 + (i % 2) * 10}%`, top: `${30 + i * 12}%`, color: i === count - 1 ? '#edf3f5' : '#8bdcff', fontSize: '2.5vmin', whiteSpace: 'nowrap' }} initial={{ opacity: 0, x: 30, scale: .94 }} animate={{ opacity: count > i ? 1 : .08, x: count > i ? 0 : 30, scale: 1 }} transition={{ duration: .36, ease: easeOut }}>
          <span style={{ display: 'inline-block', width: '1.1vmin', height: '1.1vmin', border: '1px solid #8bdcff', borderRadius: '50%', marginRight: '1.4vmin', verticalAlign: 'middle' }} />{route}
        </motion.div>
      ))}
      <motion.div className="film-copy" style={{ position: 'absolute', bottom: '12%', left: '7%', fontSize: '3.1vmin', color: '#aebdc4' }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: qualified ? 1 : 0, y: qualified ? 0 : 12 }} transition={{ duration: .4 }}>
        Arah yang dirancang. Dibangun bertahap.
      </motion.div>
      <motion.div className="film-mono" style={{ position: 'absolute', bottom: '7%', left: '7%', fontSize: '1.95vmin', color: '#8296a0' }} initial={{ opacity: 0 }} animate={{ opacity: qualified ? .8 : 0 }} transition={{ duration: .35 }}>
        USULAN · BELUM DIIMPLEMENTASIKAN
      </motion.div>
      <motion.div style={{ position: 'absolute', left: '39%', top: '52%', width: '4vmin', height: '4vmin', background: '#8bdcff', borderRadius: '50%', transform: 'translate(-50%,-50%)' }} initial={{ scale: 0 }} animate={{ scale: [0, .8, 0], x: '0%' }} transition={{ delay: 5.12, duration: .8 }} />
    </SceneExit>
  );
}
