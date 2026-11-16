import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Edit3,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { PRODUCT_ICON_OPTIONS, ProductIcon } from '../../lib/iconMap';
import {
  formatSupabaseError,
  ProductRow,
  supabase,
  uploadToMediaBucket,
} from '../../lib/supabaseClient';

export function ProductCrudManager() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState<string>('Radio');
  const [imageUrl, setImageUrl] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const loadProducts = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(
          'id, title, description, icon_name, image_url, download_link, is_active'
        )
        .order('created_at', { ascending: true });

      if (fetchError) {
        setError(formatSupabaseError(fetchError, 'Failed to load products'));
        return;
      }

      setProducts((data as ProductRow[]) || []);
    } catch (err) {
      setError(formatSupabaseError(err, 'Failed to load products'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setIconName('Radio');
    setImageUrl('');
    setDownloadLink('');
    setIsActive(true);
  };

  const handleEdit = (row: ProductRow) => {
    setEditingId(row.id);
    setTitle(row.title);
    setDescription(row.description);
    setIconName(row.icon_name || 'Radio');
    setImageUrl(row.image_url || '');
    setDownloadLink(row.download_link || '');
    setIsActive(Boolean(row.is_active));
    setError('');
    setStatusMessage('');
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setError('');
    setUploadingImage(true);
    try {
      const url = await uploadToMediaBucket(file, 'products');
      setImageUrl(url);
      setStatusMessage('Product image uploaded to "media" bucket.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Product image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setError('');
    setStatusMessage('');

    if (!title.trim()) {
      setError('Product title is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        icon_name: iconName,
        image_url: imageUrl.trim(),
        download_link: downloadLink.trim(),
        is_active: isActive,
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingId);

        if (updateError) {
          setError(formatSupabaseError(updateError, 'Failed to update product'));
          return;
        }
        setStatusMessage(`Updated "${payload.title}".`);
      } else {
        const { error: insertError } = await supabase.from('products').insert(payload);
        if (insertError) {
          setError(formatSupabaseError(insertError, 'Failed to create product'));
          return;
        }
        setStatusMessage(`Created "${payload.title}".`);
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(formatSupabaseError(err, 'Failed to save product'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: ProductRow) => {
    if (!supabase) return;
    setError('');
    setStatusMessage('');
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', row.id);

      if (deleteError) {
        setError(formatSupabaseError(deleteError, 'Failed to delete product'));
        return;
      }

      if (editingId === row.id) resetForm();
      setStatusMessage(`Deleted "${row.title}".`);
      await loadProducts();
    } catch (err) {
      setError(formatSupabaseError(err, 'Failed to delete product'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[#F5F5F7]">
          Product Manager
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Create, edit, toggle visibility, and upload product images to the{' '}
          <code className="font-mono text-xs text-[#D4AF37]">media</code> bucket.
        </p>
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
        {/* Product Create / Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 border border-[#1E3A5F]/70 bg-[#0A192F] p-6 xl:col-span-5 self-start"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-[#F5F5F7]">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h3>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-200">
              Product Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Abrimax Studio"
              required
              className="mt-2 block w-full border border-[#1E3A5F] bg-[#050505] px-3.5 py-2.5 text-sm text-[#F5F5F7] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-200">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mobile broadcasting app built for African networks..."
              className="mt-2 block w-full border border-[#1E3A5F] bg-[#050505] px-3.5 py-2.5 text-sm text-[#F5F5F7] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-zinc-200">
                Icon Name
              </label>
              <div className="mt-2 flex items-center gap-2 border border-[#1E3A5F] bg-[#050505] px-3 py-2">
                <ProductIcon name={iconName} className="h-4 w-4 text-[#D4AF37]" />
                <select
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#F5F5F7] focus:outline-none"
                >
                  {PRODUCT_ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon} className="bg-[#050505]">
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-200">
                Download Link
              </label>
              <input
                type="text"
                value={downloadLink}
                onChange={(e) => setDownloadLink(e.target.value)}
                placeholder="https://... or leave blank"
                className="mt-2 block w-full border border-[#1E3A5F] bg-[#050505] px-3 py-2.5 font-mono text-xs text-[#F5F5F7] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-zinc-200">
              Product Image (media bucket)
            </label>
            <div className="flex items-center gap-3">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Product preview"
                  referrerPolicy="no-referrer"
                  className="h-12 w-16 border border-[#1E3A5F] object-cover"
                />
              )}
              <label className="inline-flex min-h-[38px] cursor-pointer items-center gap-2 border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-3.5 py-2 text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050505]">
                <Upload className="h-3.5 w-3.5" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="sr-only"
                />
              </label>
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste image URL..."
              className="mt-1 block w-full border border-[#1E3A5F] bg-[#050505] px-3 py-2 font-mono text-xs text-[#F5F5F7] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-zinc-200 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 accent-[#D4AF37]"
            />
            <span>Active (visible on public website)</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="flex min-h-[42px] w-full items-center justify-center gap-2 bg-[#D4AF37] px-5 py-2.5 text-xs font-semibold text-[#050505] hover:bg-[#E5C558] disabled:opacity-50 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>
              {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
            </span>
          </button>
        </form>

        {/* Products List */}
        <div className="border border-[#1E3A5F]/70 bg-[#0A192F] xl:col-span-7">
          {loading ? (
            <div className="space-y-3 p-5">
              <div className="h-16 animate-pulse bg-white/5" />
              <div className="h-16 animate-pulse bg-white/5" />
            </div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-zinc-200">
                No products in Supabase yet
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                The public website displays hardcoded fallbacks until you add your first
                product on the left.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#1E3A5F]">
              {products.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    {row.image_url ? (
                      <img
                        src={row.image_url}
                        alt={row.title}
                        referrerPolicy="no-referrer"
                        className="h-14 w-20 shrink-0 border border-[#1E3A5F] object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-20 shrink-0 items-center justify-center border border-[#1E3A5F] bg-[#050505]">
                        <ProductIcon
                          name={row.icon_name}
                          className="h-5 w-5 text-[#D4AF37]"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-[#F5F5F7]">
                          {row.title}
                        </p>
                        <span aria-hidden="true" className="text-zinc-500">
                          ·
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            row.is_active ? 'text-emerald-400' : 'text-zinc-400'
                          }`}
                        >
                          {row.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-zinc-300">
                        {row.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(row)}
                      aria-label={`Edit ${row.title}`}
                      className="inline-flex h-9 w-9 items-center justify-center border border-[#1E3A5F] text-zinc-300 hover:border-[#D4AF37] hover:text-[#D4AF37] cursor-pointer"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row)}
                      aria-label={`Delete ${row.title}`}
                      className="inline-flex h-9 w-9 items-center justify-center border border-[#1E3A5F] text-zinc-300 hover:border-red-500 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
