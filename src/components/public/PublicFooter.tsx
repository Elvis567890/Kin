import type { NavLinkRow } from '../../lib/supabaseClient';

interface PublicFooterProps {
  links: NavLinkRow[];
}

export function PublicFooter({ links }: PublicFooterProps) {
  const year = new Date().getFullYear();
  const sortedLinks = [...links].sort((a, b) => a.order - b.order);

  return (
    <footer className="bg-[#050505] py-14">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="flex flex-col gap-10 border-b border-white/10 pb-10 md:flex-row md:items-start md:justify-between">
          <div>
            <a
              href="#top"
              className="font-display text-lg font-bold tracking-[0.14em] text-[#F5F5F7]"
            >
              AFRINODE
            </a>
            <p className="mt-2 text-sm text-[#D4AF37]">
              Connect. Intelligent. Transform Africa.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 text-sm">
            <div className="space-y-2.5">
              <p className="text-xs font-medium text-zinc-400">Navigation</p>
              <ul className="space-y-2 text-zinc-300">
                {sortedLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      className="hover:text-[#D4AF37] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-medium text-zinc-400">Contact</p>
              <p className="text-zinc-300">enterprise@afrinode.africa</p>
            </div>

            <div className="space-y-2.5 col-span-2 sm:col-span-1">
              <p className="text-xs font-medium text-zinc-400">Regional Hubs</p>
              <p className="text-zinc-300 leading-relaxed">
                Lagos · Nairobi · Accra · Johannesburg
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} AFRINODE Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#contact" className="hover:text-zinc-200 transition-colors">
              Privacy Governance
            </a>
            <a href="#contact" className="hover:text-zinc-200 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
