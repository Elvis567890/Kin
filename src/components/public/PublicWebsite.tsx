import { useEffect, useState } from 'react';
import {
  FALLBACK_NAV_LINKS,
  FALLBACK_PRODUCTS,
  FALLBACK_SITE_CONTENT,
  isSupabaseConfigured,
  NavLinkRow,
  ProductRow,
  SiteContent,
  supabase,
} from '../../lib/supabaseClient';
import type { ProductItem } from '../../types/site';
import { ActionModal, ActiveModal } from '../ActionModal';
import { ContactSection } from '../ContactSection';
import { PublicAboutSection } from './PublicAboutSection';
import { PublicFooter } from './PublicFooter';
import { PublicHero } from './PublicHero';
import { PublicNavbar } from './PublicNavbar';
import { PublicProductsGrid } from './PublicProductsGrid';

function toActionProduct(row: ProductRow): ProductItem {
  return {
    id: row.id,
    name: row.title,
    category: row.download_link ? 'Mobile Application' : 'Upcoming Release',
    availability: row.download_link ? 'Available Now' : 'In Development',
    isAvailable: Boolean(row.download_link),
    summary: row.description,
    imageSrc: row.image_url,
    imageAlt: row.title,
    highlights: [],
    actionLabel: row.download_link ? 'Download App' : 'Notify Me',
  };
}

export function PublicWebsite() {
  const [content, setContent] = useState<SiteContent>(FALLBACK_SITE_CONTENT);
  const [products, setProducts] = useState<ProductRow[]>(FALLBACK_PRODUCTS);
  const [navLinks, setNavLinks] = useState<NavLinkRow[]>(FALLBACK_NAV_LINKS);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    let active = true;

    async function loadFromSupabase() {
      if (!supabase) return;
      try {
        const [contentRes, productsRes, navRes] = await Promise.all([
          supabase
            .from('site_content')
            .select('id, hero_title, hero_subtitle, logo_url, about_text')
            .order('id', { ascending: true })
            .limit(1)
            .maybeSingle(),
          supabase
            .from('products')
            .select(
              'id, title, description, icon_name, image_url, download_link, is_active'
            )
            .eq('is_active', true),
          supabase
            .from('nav_links')
            .select('id, label, url, order')
            .order('order', { ascending: true }),
        ]);

        if (!active) return;

        if (contentRes.data) {
          const row = contentRes.data as SiteContent;
          setContent({
            id: row.id ?? 1,
            hero_title: row.hero_title || FALLBACK_SITE_CONTENT.hero_title,
            hero_subtitle: row.hero_subtitle || FALLBACK_SITE_CONTENT.hero_subtitle,
            logo_url: row.logo_url || '',
            about_text: row.about_text || FALLBACK_SITE_CONTENT.about_text,
          });
        }

        if (productsRes.data && productsRes.data.length > 0) {
          setProducts(productsRes.data as ProductRow[]);
        }

        if (navRes.data && navRes.data.length > 0) {
          setNavLinks(navRes.data as NavLinkRow[]);
        }
      } catch {
        // Keep hardcoded fallbacks cleanly
      }
    }

    void loadFromSupabase();
    return () => {
      active = false;
    };
  }, []);

  const handleDownloadAction = (product?: ProductRow) => {
    const link = product?.download_link?.trim();
    if (link && /^https?:\/\//i.test(link)) {
      window.location.href = link;
      return;
    }
    setActiveModal({ type: 'download' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F7]">
      <PublicNavbar
        logoUrl={content.logo_url}
        links={navLinks}
        onDownloadClick={() => handleDownloadAction(products[0])}
      />

      <main>
        <PublicHero
          heroTitle={content.hero_title}
          heroSubtitle={content.hero_subtitle}
          onDownloadClick={() => handleDownloadAction(products[0])}
        />

        <PublicProductsGrid
          products={products}
          onDownloadApp={(p) => handleDownloadAction(p)}
          onJoinWaitlist={(p) =>
            setActiveModal({ type: 'waitlist', product: toActionProduct(p) })
          }
        />

        <PublicAboutSection aboutText={content.about_text} />

        <ContactSection
          contactEmail="enterprise@afrinode.africa"
          regionalHubs="Lagos · Nairobi · Accra · Johannesburg"
        />
      </main>

      <PublicFooter links={navLinks} />

      <ActionModal
        modal={activeModal}
        onClose={() => setActiveModal(null)}
        onSwitchToDownload={() => setActiveModal({ type: 'download' })}
      />
    </div>
  );
}
