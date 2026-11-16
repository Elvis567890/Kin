import {
  Box,
  Database,
  LayoutDashboard,
  Link2,
  LogOut,
  X,
} from 'lucide-react';

export type AdminTab = 'content' | 'products' | 'links' | 'sql';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  userEmail: string;
  onSignOut: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const ITEMS: Array<{
  id: AdminTab;
  label: string;
  subtitle: string;
  icon: typeof LayoutDashboard;
}> = [
  {
    id: 'content',
    label: 'Content Manager',
    subtitle: 'Hero, about & logo',
    icon: LayoutDashboard,
  },
  {
    id: 'products',
    label: 'Product Manager',
    subtitle: 'CRUD & media uploads',
    icon: Box,
  },
  {
    id: 'links',
    label: 'Link Forwarding',
    subtitle: 'Manage nav_links',
    icon: Link2,
  },
  {
    id: 'sql',
    label: 'Supabase SQL',
    subtitle: 'Schema & RLS policies',
    icon: Database,
  },
];

export function AdminSidebar({
  activeTab,
  onSelectTab,
  userEmail,
  onSignOut,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const sidebarBody = (
    <div className="flex h-full flex-col justify-between border-r border-white/10 bg-[#070E1A]">
      <div>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <div>
            <span className="font-display text-base font-bold tracking-[0.14em] text-[#F5F5F7]">
              AFRINODE
            </span>
            <span className="ml-2 text-xs font-medium text-[#D4AF37]">Admin</span>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="inline-flex h-9 w-9 items-center justify-center text-zinc-400 hover:text-white lg:hidden cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav aria-label="Admin sections" className="space-y-1 p-3">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`flex w-full items-start gap-3 px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                  active
                    ? 'border border-[#D4AF37]/45 bg-[#0A192F] text-[#F5F5F7]'
                    : 'border border-transparent text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200'
                }`}
              >
                <Icon
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    active ? 'text-[#D4AF37]' : 'text-zinc-400'
                  }`}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium leading-tight">
                    {item.label}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-zinc-500">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 px-1">
          <p className="text-xs text-zinc-500">Authenticated Admin</p>
          <p className="mt-0.5 truncate font-mono text-xs text-zinc-200">
            {userEmail}
          </p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="flex min-h-[40px] w-full items-center justify-center gap-2 border border-white/15 bg-[#050505] px-3 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-red-500/60 hover:text-red-300 cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 lg:block">{sidebarBody}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <aside className="relative z-10 w-72 max-w-[85vw]">{sidebarBody}</aside>
        </div>
      )}
    </>
  );
}
