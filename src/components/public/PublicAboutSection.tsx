import { CAPABILITIES } from '../../data/products';
import { FadeIn } from '../FadeIn';

interface PublicAboutSectionProps {
  aboutText: string;
}

export function PublicAboutSection({ aboutText }: PublicAboutSectionProps) {
  return (
    <section
      id="about"
      className="border-b border-white/10 bg-[#050505] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-5">
            <p className="text-sm font-medium text-[#D4AF37]">About AFRINODE</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#F5F5F7] sm:text-4xl [text-wrap:balance]">
              Built for real bandwidth, sovereign cloud custody, and zero downtime.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-zinc-300">
              {aboutText}
            </p>

            <div
              id="architecture"
              className="mt-10 border border-[#1E3A5F]/60 bg-[#0A192F] p-6 space-y-3"
            >
              <p className="text-xs font-medium text-[#D4AF37]">
                Primary Operating Corridors
              </p>
              <p className="text-sm leading-relaxed text-zinc-200">
                West Africa (Lagos · Accra) · East Africa (Nairobi · Kigali) · Southern
                Africa (Johannesburg · Cape Town)
              </p>
            </div>
          </FadeIn>

          <div className="lg:col-span-7 space-y-4">
            {CAPABILITIES.map((item, idx) => (
              <FadeIn key={item.number} delay={idx * 0.08}>
                <div className="border border-[#1E3A5F]/60 bg-[#0A192F] p-7 transition-colors hover:border-[#D4AF37]/60">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-12 sm:items-start">
                    <div className="sm:col-span-8">
                      <h3 className="font-display text-xl font-semibold tracking-tight text-[#F5F5F7]">
                        <span className="mr-2.5 font-mono text-base font-medium text-[#D4AF37] tabular-nums">
                          {item.number}
                        </span>
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                        {item.description}
                      </p>
                    </div>

                    <div className="sm:col-span-4 sm:border-l sm:border-[#1E3A5F] sm:pl-6">
                      <p className="font-display text-3xl font-semibold tracking-tight text-[#D4AF37] tabular-nums">
                        {item.metricValue}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
                        {item.metricContext}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
