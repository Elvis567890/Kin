import { ArrowDownToLine, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { SCALE_METRICS } from '../../data/products';
import { ResilientImage } from '../ResilientImage';
import { FadeIn } from '../FadeIn';

interface PublicHeroProps {
  heroTitle: string;
  heroSubtitle: string;
  onDownloadClick: () => void;
}

export function PublicHero({
  heroTitle,
  heroSubtitle,
  onDownloadClick,
}: PublicHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  const renderHighlightedTitle = (title: string) => {
    const marker = 'Transform Africa.';
    if (title.includes(marker)) {
      const idx = title.indexOf(marker);
      return (
        <>
          {title.slice(0, idx)}
          <span className="text-[#D4AF37]">{marker}</span>
          {title.slice(idx + marker.length)}
        </>
      );
    }
    return title;
  };

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-white/10 bg-[#050505]"
    >
      {/* Background Architectural Media with Measured Contrast Scrim */}
      <div className="absolute inset-0">
        <ResilientImage
          src="/src/assets/images/hero_afrinode_network_1794833073883.jpg"
          alt="AFRINODE architectural technology headquarters at dusk"
          className="h-full w-full object-cover object-center opacity-50"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-[#0A192F]/45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/65"
        />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 pt-20 pb-16 lg:px-10 lg:pt-28 lg:pb-24">
        <div className="max-w-3xl">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 flex flex-wrap items-center gap-3 text-sm font-medium text-[#D4AF37]"
          >
            <span>AFRINODE</span>
            <span aria-hidden="true" className="text-zinc-600">
              ·
            </span>
            <span className="text-zinc-300">Continental Digital Infrastructure</span>
          </motion.div>

          <motion.h1
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(2.5rem,5vw,4.25rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#F5F5F7] [text-wrap:balance]"
          >
            {renderHighlightedTitle(heroTitle)}
          </motion.h1>

          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg"
          >
            {heroSubtitle}
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <motion.button
              type="button"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              onClick={onDownloadClick}
              className="inline-flex min-h-[48px] items-center gap-2.5 bg-[#D4AF37] px-7 py-3.5 text-sm font-semibold tracking-wide text-[#050505] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#E5C558] cursor-pointer"
            >
              <ArrowDownToLine className="h-4 w-4" />
              <span>Download App</span>
            </motion.button>

            <a
              href="#products"
              className="inline-flex min-h-[48px] items-center gap-2 border border-[#1E3A5F] bg-[#0A192F]/70 px-6 py-3.5 text-sm font-medium text-[#F5F5F7] whitespace-nowrap shrink-0 backdrop-blur-sm transition-colors duration-150 hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              <span>Explore Products</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>

        {/* 4-Column Infrastructure Bar */}
        <FadeIn delay={0.18} className="mt-16 border-t border-white/15 pt-10 lg:mt-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SCALE_METRICS.map((metric) => (
              <div key={metric.label} className="space-y-1.5">
                <p className="text-xs font-medium text-zinc-400">{metric.label}</p>
                <p className="font-display text-2xl font-semibold tracking-tight text-[#D4AF37] tabular-nums">
                  {metric.value}
                </p>
                <p className="text-sm leading-snug text-zinc-400">{metric.detail}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
