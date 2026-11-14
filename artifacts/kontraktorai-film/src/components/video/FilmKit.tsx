import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export const easeOut = [0.22, 1, 0.36, 1] as const;

export function LogoLockup({ width = '26vmin' }: { width?: string }) {
  return (
    <img
      className="film-logo"
      src={`${import.meta.env.BASE_URL}images/kontraktorai-logo.svg`}
      alt="KontraktorAI by Gustafta"
      style={{ width }}
    />
  );
}

export function SceneExit({ children, pale = false }: { children: ReactNode; pale?: boolean }) {
  return (
    <motion.section
      className={`film-stage${pale ? ' pale' : ''}`}
      initial={{ opacity: 0, scale: 1.025, filter: 'blur(5px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
      transition={{ duration: 0.48, ease: easeOut }}
    >
      {children}
    </motion.section>
  );
}
