import { ArrowDownToLine, ArrowUpRight, Bell } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { ProductIcon } from '../../lib/iconMap';
import type { ProductRow } from '../../lib/supabaseClient';
import { FadeIn } from '../FadeIn';
import { ResilientImage } from '../ResilientImage';

interface PublicProductsGridProps {
  products: ProductRow[];
  onDownloadApp: (product: ProductRow) => void;
  onJoinWaitlist: (product: ProductRow) => void;
}

export function PublicProductsGrid({
  products,
  onDownloadApp,
  onJoinWaitlist,
}: PublicProductsGridProps) {
  const prefersReducedMotion = useReducedMotion();
  const activeProducts = products.filter((p) => p.is_active);

  return (
    <section
      id="products"
      className="border-b border-white/10 bg-[#050505] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <FadeIn className="flex flex-col gap-4 border-b border-white/10 pb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#D4AF37]">Product Ecosystem</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#F5F5F7] sm:text-4xl [text-wrap:balance]">
              Built for broadcast reliability and continental scale.
            </h2>
          </div>
          <p className="text-sm text-zinc-400">
            {activeProducts.length} Active Solutions
          </p>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeProducts.map((product, index) => {
            const hasDownload = Boolean(product.download_link?.trim());
            return (
              <motion.div
                key={product.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                className="flex h-full"
              >
                <article className="group flex w-full flex-col justify-between border border-[#1E3A5F]/65 bg-[#0A192F] transition-colors duration-200 hover:border-[#D4AF37]/80">
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-[#1E3A5F]/60 bg-[#061020]">
                      <ResilientImage
                        src={product.image_url}
                        alt={product.title}
                        fallbackTitle={product.title}
                        className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      />
                    </div>

                    <div className="p-7">
                      <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                        <ProductIcon
                          name={product.icon_name}
                          className="h-4 w-4 text-[#D4AF37]"
                        />
                        <span className={hasDownload ? 'text-[#D4AF37]' : 'text-zinc-300'}>
                          {hasDownload ? 'Available Now' : 'Upcoming Release'}
                        </span>
                      </div>

                      <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-[#F5F5F7]">
                        {product.title}
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-[#1E3A5F]/60 px-7 py-5">
                    {hasDownload ? (
                      <button
                        type="button"
                        onClick={() => onDownloadApp(product)}
                        className="inline-flex min-h-[42px] items-center gap-2 bg-[#D4AF37] px-5 py-2.5 text-xs font-semibold text-[#050505] whitespace-nowrap shrink-0 transition-colors hover:bg-[#E5C558] cursor-pointer"
                      >
                        <ArrowDownToLine className="h-3.5 w-3.5" />
                        <span>Download App</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onJoinWaitlist(product)}
                        className="inline-flex min-h-[42px] items-center gap-2 border border-[#D4AF37]/50 bg-transparent px-5 py-2.5 text-xs font-semibold text-[#D4AF37] whitespace-nowrap shrink-0 transition-colors hover:bg-[#D4AF37] hover:text-[#050505] cursor-pointer"
                      >
                        <Bell className="h-3.5 w-3.5" />
                        <span>Notify Me</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        hasDownload ? onDownloadApp(product) : onJoinWaitlist(product)
                      }
                      className="inline-flex items-center gap-1 text-xs font-medium text-zinc-300 hover:text-[#D4AF37] cursor-pointer"
                    >
                      <span>{hasDownload ? 'Release Notes' : 'Roadmap'}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
