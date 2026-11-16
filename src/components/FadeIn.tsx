import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export function FadeIn({
  children,
  className = '',
  delay = 0,
  yOffset = 22,
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
