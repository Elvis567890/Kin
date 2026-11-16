import { useState } from 'react';
import { ExternalLink, Menu } from 'lucide-react';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { ContentManager } from './ContentManager';
import { NavLinksManager } from './NavLinksManager';
import { ProductCrudManager } from './ProductCrudManager';
import { SqlSetupView } from './SqlSetupView';

interface AdminPanelProps {
  userEmail: string;
  onSignOut: () => void;
  onNavigatePublic: () => void;
}

const TAB_TITLES: Record<AdminTab, string> = {
  content: 'Content Manager',
  products: 'Product Manager',
  links: 'Link Forwarding',
  sql: 'Supabase SQL Schema',
};

export function AdminPanel({
  userEmail,
  onSignOut,
  onNavigatePublic,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('content');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#050505] text-[#F5F5F7]">
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        userEmail={userEmail}
        onSignOut={onSignOut}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-[#050505]/90 px-4 backdrop-blur-md sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center border border-[#1E3A5F] text-zinc-300 hover:border-[#D4AF37] hover:text-[#D4AF37] lg:hidden cursor-pointer"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="flex min-w-0 items-center gap-2 text-sm">
              <span className="hidden text-zinc-500 sm:inline whitespace-nowrap">
                AFRINODE Admin
              </span>
              <span aria-hidden="true" className="hidden text-zinc-600 sm:inline">
                /
              </span>
              <span className="truncate font-medium text-[#F5F5F7]">
                {TAB_TITLES[activeTab]}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigatePublic}
            className="inline-flex items-center gap-2 border border-[#1E3A5F] bg-[#0A192F] px-3.5 py-2 text-xs font-medium text-zinc-200 whitespace-nowrap shrink-0 transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37] cursor-pointer"
          >
            <span>Public Website</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </header>

        <main className="mx-auto w-full max-w-[1360px] flex-1 p-4 sm:p-8">
          {activeTab === 'content' && <ContentManager />}
          {activeTab === 'products' && <ProductCrudManager />}
          {activeTab === 'links' && <NavLinksManager />}
          {activeTab === 'sql' && <SqlSetupView />}
        </main>
      </div>
    </div>
  );
}
