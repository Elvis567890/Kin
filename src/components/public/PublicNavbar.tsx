import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { NavLinkRow } from '../../lib/supabaseClient';

interface PublicNavbarProps {
  logoUrl: string;
  links: NavLinkRow[];
  onDownloadClick: () => void;
}

export function PublicNavbar({
  logoUrl,
  links,
  onDownloadClick,
}: PublicNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sortedLinks = [...links].sort((a, b) => a.order - b.order).slice(0, 5);

  const handleNavClick = (url: string) => {
    setMobileOpen(false);
    if (url.startsWith('#')) {
      document.getElementById(url.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-8 px-6 lg:px-10">
        {/* Zone 1: Brand / Logo */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center font-display text-lg font-bold tracking-[0.14em] text-[#F5F5F7] whitespace-nowrap shrink-0 transition-colors hover:text-[#D4AF37]"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="AFRINODE"
              referrerPolicy="no-referrer"
              className="h-7 w-auto max-w-[150px] object-contain"
            />
          ) : (
            <span>AFRINODE</span>
          )}
        </a>

        {/* Zone 2: Dynamic nav_links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300"
        >
          {sortedLinks.map((link) => {
            const isExternal = /^https?:\/\//i.test(link.url);
            return (
              <a
                key={link.id}
                href={link.url}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                onClick={(e) => {
                  if (link.url.startsWith('#')) {
                    e.preventDefault();
                    handleNavClick(link.url);
                  }
                }}
                className="whitespace-nowrap shrink-0 py-1 text-zinc-300 transition-colors duration-150 hover:text-[#D4AF37] hover:underline hover:underline-offset-8 hover:decoration-[#D4AF37]/60"
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary Download App CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onDownloadClick}
            className="hidden sm:inline-flex items-center justify-center bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-[#050505] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#E5C558] cursor-pointer"
          >
            Download App
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-11 w-11 items-center justify-center border border-white/15 text-zinc-200 transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37] md:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0A192F] px-6 py-5 md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-3">
            {sortedLinks.map((link) => {
              const isExternal = /^https?:\/\//i.test(link.url);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  onClick={(e) => {
                    if (link.url.startsWith('#')) {
                      e.preventDefault();
                      handleNavClick(link.url);
                    } else {
                      setMobileOpen(false);
                    }
                  }}
                  className="py-2.5 text-base font-medium text-zinc-200 transition-colors hover:text-[#D4AF37]"
                >
                  {link.label}
                </a>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onDownloadClick();
              }}
              className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-[#050505] transition-colors hover:bg-[#E5C558] cursor-pointer"
            >
              Download App
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
