import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  RefreshCw,
  Save,
  Upload,
} from 'lucide-react';
import {
  FALLBACK_SITE_CONTENT,
  formatSupabaseError,
  SiteContent,
  supabase,
  uploadToMediaBucket,
} from '../../lib/supabaseClient';

export function ContentManager() {
  const [contentId, setContentId] = useState(1);
  const [heroTitle, setHeroTitle] = useState(FALLBACK_SITE_CONTENT.hero_title);
  const [heroSubtitle, setHeroSubtitle] = useState(FALLBACK_SITE_CONTENT.hero_subtitle);
  const [aboutText, setAboutText] = useState(FALLBACK_SITE_CONTENT.about_text);
  const [logoUrl, setLogoUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const loadContent = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('site_content')
        .select('id, hero_title, hero_subtitle, logo_url, about_text')
        .order('id', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        setError(formatSupabaseError(fetchError, 'Failed to fetch site_content'));
        return;
      }

      if (data) {
        const row = data as SiteContent;
        setContentId(row.id ?? 1);
        setHeroTitle(row.hero_title || '');
        setHeroSubtitle(row.hero_subtitle || '');
        setLogoUrl(row.logo_url || '');
        setAboutText(row.about_text || '');
      }
    } catch (err) {
      setError(formatSupabaseError(err, 'Failed to load site_content'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setError('');
    setStatusMessage('');

    if (!heroTitle.trim()) {
      setError('Hero Title is required.');
      return;
    }

    setSaving(true);
    try {
      const { error: upsertError } = await supabase.from('site_content').upsert(
        {
          id: contentId,
          hero_title: heroTitle.trim(),
          hero_subtitle: heroSubtitle.trim(),
          logo_url: logoUrl.trim(),
          about_text: aboutText.trim(),
        },
        { onConflict: 'id' }
      );

      if (upsertError) {
        setError(formatSupabaseError(upsertError, 'Could not update site_content'));
        return;
      }

      setStatusMessage(
        `Saved to site_content at ${new Date().toLocaleTimeString()}.`
      );
    } catch (err) {
      setError(formatSupabaseError(err, 'Could not save site_content'));
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !supabase) return;

    setError('');
    setStatusMessage('');
    setUploadingLogo(true);
    try {
      const publicUrl = await uploadToMediaBucket(file, 'logos');
      setLogoUrl(publicUrl);

      const { error: upsertError } = await supabase.from('site_content').upsert(
        {
          id: contentId,
          hero_title: heroTitle.trim(),
          hero_subtitle: heroSubtitle.trim(),
          logo_url: publicUrl,
          about_text: aboutText.trim(),
        },
        { onConflict: 'id' }
      );

      if (upsertError) {
        setError(
          formatSupabaseError(
            upsertError,
            'Logo uploaded to media bucket, but updating site_content failed'
          )
        );
        return;
      }

      setStatusMessage('Logo uploaded to Supabase "media" bucket and saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logo upload failed.');
    } finally {
      setUploadingLogo(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse border border-white/10 bg-[#0A192F]" />
        <div className="h-80 animate-pulse border border-white/10 bg-[#0A192F]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-[#F5F5F7]">
            Content Manager
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Update Hero Title, Subtitle, About text, and upload a logo to the{' '}
            <code className="font-mono text-xs text-[#D4AF37]">media</code> bucket.
          </p>
        </div>

        <button
          type="button"
          onClick={loadContent}
          className="inline-flex min-h-[40px] items-center gap-2 self-start border border-[#1E3A5F] bg-[#0A192F] px-4 py-2 text-xs font-medium text-zinc-200 hover:border-[#D4AF37] hover:text-[#D4AF37] cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 border border-red-500/40 bg-red-950/40 p-4 text-xs text-red-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {statusMessage && (
        <div className="flex items-start gap-2.5 border border-emerald-500/40 bg-emerald-950/30 p-4 text-xs text-emerald-200">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <form
          onSubmit={handleSave}
          className="space-y-5 border border-[#1E3A5F]/70 bg-[#0A192F] p-6 xl:col-span-8"
        >
          <div>
            <label
              htmlFor="hero-title"
              className="block text-xs font-medium text-zinc-200"
            >
              Hero Title
            </label>
            <input
              id="hero-title"
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              required
              className="mt-2 block w-full border border-[#1E3A5F] bg-[#050505] px-3.5 py-2.5 text-sm text-[#F5F5F7] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="hero-subtitle"
              className="block text-xs font-medium text-zinc-200"
            >
              Hero Subtitle
            </label>
            <textarea
              id="hero-subtitle"
              rows={3}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="mt-2 block w-full border border-[#1E3A5F] bg-[#050505] px-3.5 py-2.5 text-sm text-[#F5F5F7] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="about-text"
              className="block text-xs font-medium text-zinc-200"
            >
              About Text
            </label>
            <textarea
              id="about-text"
              rows={5}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className="mt-2 block w-full border border-[#1E3A5F] bg-[#050505] px-3.5 py-2.5 text-sm leading-relaxed text-[#F5F5F7] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="flex justify-end border-t border-[#1E3A5F] pt-5">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-[42px] items-center gap-2 bg-[#D4AF37] px-6 py-2.5 text-xs font-semibold text-[#050505] hover:bg-[#E5C558] disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Site Content'}</span>
            </button>
          </div>
        </form>

        <div className="space-y-4 border border-[#1E3A5F]/70 bg-[#0A192F] p-6 xl:col-span-4 self-start">
          <h3 className="font-display text-base font-semibold text-[#F5F5F7]">
            Brand Logo (media bucket)
          </h3>

          <div className="flex h-36 items-center justify-center border border-dashed border-[#1E3A5F] bg-[#050505] p-4">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Site logo preview"
                referrerPolicy="no-referrer"
                className="max-h-24 max-w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-zinc-500">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No custom logo uploaded</span>
              </div>
            )}
          </div>

          <label className="flex min-h-[42px] w-full cursor-pointer items-center justify-center gap-2 bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-[#050505] hover:bg-[#E5C558]">
            <Upload className="h-4 w-4" />
            <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo to media'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={uploadingLogo}
              className="sr-only"
            />
          </label>

          <div>
            <label
              htmlFor="logo-url-input"
              className="block text-xs font-medium text-zinc-300"
            >
              Logo URL
            </label>
            <input
              id="logo-url-input"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
              className="mt-2 block w-full border border-[#1E3A5F] bg-[#050505] px-3 py-2 font-mono text-xs text-[#F5F5F7] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
