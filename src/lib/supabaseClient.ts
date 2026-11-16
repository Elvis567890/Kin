import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined);

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined);

const hasValidUrl =
  typeof supabaseUrl === 'string' &&
  supabaseUrl.trim().length > 0 &&
  !supabaseUrl.includes('your-project-ref');

const hasValidKey =
  typeof supabaseAnonKey === 'string' &&
  supabaseAnonKey.trim().length > 0 &&
  !supabaseAnonKey.includes('your-supabase-anon-key');

export const isSupabaseConfigured = Boolean(hasValidUrl && hasValidKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!.trim(), supabaseAnonKey!.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export interface SiteContent {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  logo_url: string;
  about_text: string;
}

export interface ProductRow {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  image_url: string;
  download_link: string;
  is_active: boolean;
}

export interface NavLinkRow {
  id: string;
  label: string;
  url: string;
  order: number;
}

export const FALLBACK_SITE_CONTENT: SiteContent = {
  id: 1,
  hero_title: 'Connect. Intelligent. Transform Africa.',
  hero_subtitle:
    'AFRINODE engineers mission-critical mobile broadcasting, sovereign edge networks, and applied intelligence systems built for Africa’s builders, broadcasters, and institutions.',
  logo_url: '',
  about_text:
    'African digital infrastructure requires software engineered from first principles—resilient over congested cellular links, low-overhead on mobile silicon, and compliant with regional institutional governance across Lagos, Nairobi, Accra, and Johannesburg.',
};

export const FALLBACK_PRODUCTS: ProductRow[] = [
  {
    id: 'abrimax-studio',
    title: 'Abrimax Studio',
    description:
      'Turn any flagship smartphone into a multi-camera live broadcast desk. Engineered with adaptive bitrate encoding for resilient high-definition streaming across African mobile networks.',
    icon_name: 'Radio',
    image_url: '/src/assets/images/product_abrimax_studio_1794833072922.jpg',
    download_link: '#download-abrimax',
    is_active: true,
  },
  {
    id: 'afrinode-pulse',
    title: 'Afrinode Pulse',
    description:
      'Upcoming sovereign edge-routing and low-latency telemetry platform engineered for regional enterprise networks, logistics fleets, and telecom operators.',
    icon_name: 'Server',
    image_url: '/src/assets/images/product_future_cloud_1794833073036.jpg',
    download_link: '',
    is_active: true,
  },
  {
    id: 'afrinode-core-ai',
    title: 'Afrinode Core AI',
    description:
      'Upcoming applied intelligence suite enabling multilingual voice transcription, live broadcast captioning, and sovereign enterprise workflow automation.',
    icon_name: 'Cpu',
    image_url: '/src/assets/images/product_future_ai_1794833073308.jpg',
    download_link: '',
    is_active: true,
  },
];

export const FALLBACK_NAV_LINKS: NavLinkRow[] = [
  { id: 'nav-1', label: 'Products', url: '#products', order: 1 },
  { id: 'nav-2', label: 'About', url: '#about', order: 2 },
  { id: 'nav-3', label: 'Architecture', url: '#architecture', order: 3 },
  { id: 'nav-4', label: 'Contact', url: '#contact', order: 4 },
];

export async function uploadToMediaBucket(
  file: File,
  folder: 'logos' | 'products'
): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase is not configured in environment variables.');
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${folder}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    throw new Error(formatSupabaseError(uploadError, 'Media upload failed'));
  }

  const { data } = supabase.storage.from('media').getPublicUrl(filePath);
  return data.publicUrl;
}

export function formatSupabaseError(err: unknown, context?: string): string {
  const raw =
    err && typeof err === 'object' && 'message' in err
      ? String((err as { message: unknown }).message)
      : typeof err === 'string'
        ? err
        : 'An unexpected error occurred.';

  const lower = raw.toLowerCase();

  if (lower.includes('bucket not found')) {
    return `${context ? `${context}: ` : ''}Storage bucket "media" not found in Supabase. Run supabase/schema.sql in your SQL Editor.`;
  }
  if (lower.includes('row-level security') || lower.includes('rls')) {
    return `${context ? `${context}: ` : ''}Permission denied by Row Level Security. Ensure you are signed in and RLS policies are active.`;
  }
  if (lower.includes('relation') && lower.includes('does not exist')) {
    return `${context ? `${context}: ` : ''}Database table missing. Run the provided SQL schema in your Supabase SQL Editor.`;
  }

  return context ? `${context}: ${raw}` : raw;
}
