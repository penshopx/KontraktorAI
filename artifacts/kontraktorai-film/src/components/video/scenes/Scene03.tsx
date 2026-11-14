import { motion } from 'framer-motion';
import { easeOut, LogoLockup, SceneExit } from '../FilmKit';

export function Scene03() {
  return (
    <SceneExit>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 48%, rgba(68,117,139,.2), transparent 54%)' }} />
      <motion.div style={{ position: 'absolute', left: '50%', top: '48%', translate: '-50% -50%', width: '55vmin', height: '55vmin', border: '1px solid rgba(139,220,255,.36)', borderRadius: '50%' }} initial={{ scale: .2, opacity: 0 }} animate={{ scale: 1, opacity: 1, rotate: 360 }} transition={{ scale: { duration: .8, ease: easeOut }, opacity: { duration: .6 }, rotate: { duration: 32, repeat: Infinity, ease: 'linear' } }}>
        <span style={{ position: 'absolute', left: '50%', top: '-.8vmin', width: '1.6vmin', height: '1.6vmin', borderRadius: '50%', background: '#8bdcff', boxShadow: '0 0 2vmin rgba(139,220,255,.55)' }} />
      </motion.div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: -24, letterSpacing: '.25em' }} animate={{ opacity: 1, y: 0, letterSpacing: '-.07em' }} transition={{ delay: .45, duration: .62, ease: easeOut }}>
          <div style={{ fontSize: '11vmin', lineHeight: .95, fontWeight: 700 }}>Gustafta</div>
        </motion.div>
        <motion.div className="film-eyebrow" style={{ marginTop: '1.2vmin', color: '#9aabb4' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.16 }}>BRAND INDUK</motion.div>
        <motion.div className="film-hairline" style={{ width: '25vmin', margin: '2.8vmin 0 2.4vmin' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.45, duration: .55 }} />
        <motion.div initial={{ opacity: 0, scale: .8, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 2, duration: .56, ease: easeOut }}>
          <LogoLockup width="30vmin" />
        </motion.div>
        <motion.div className="film-eyebrow" style={{ marginTop: '2vmin', color: '#8bdcff', fontSize: '1.95vmin' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.75 }}>BRAND INDUSTRI TERENDORSE</motion.div>
        <motion.p className="film-copy" style={{ color: '#a7b6be', marginTop: '2.2vmin' }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.01, duration: .45 }}>
          Untuk UMKM kontraktor &amp; profesional industri.
        </motion.p>
      </div>
      <motion.div style={{ position: 'absolute', left: '39%', top: '52%', translate: '-50% -50%', width: '4.4vmin', height: '4.4vmin', borderRadius: '50%', background: '#8bdcff' }} initial={{ scale: 0 }} animate={{ scale: [0, 1, 0] }} transition={{ delay: 5.1, duration: .6 }} />
    </SceneExit>
  );
}
