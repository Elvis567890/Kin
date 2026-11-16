import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Edit3,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  formatSupabaseError,
  NavLinkRow,
  supabase,
} from '../../lib/supabaseClient';

export function NavLinksManager() {
  const [links, setLinks] = useState<NavLinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [order, setOrder] = useState<number>(1);

  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const loadLinks = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('nav_links')
        .select('id, label, url, order')
        .order('order', { ascending: true });

      if (fetchError) {
        setError(formatSupabaseError(fetchError, 'Failed to load nav_links'));
        return;
      }

      const rows = (data as NavLinkRow[]) || [];
      setLinks(rows);
      if (!editingId) {
        const maxOrder = rows.reduce((m, r) => Math.max(m, r.order), 0);
        setOrder(maxOrder + 1);
      }
    } catch (err) {
      setError(formatSupabaseError(err, 'Failed to load nav_links'));
    } finally {
      setLoading(false);
    }
  }, [editingId]);

  useEffect(() => {
    void loadLinks();
  }, [loadLinks]);

  const resetForm = (nextRows = links) => {
    setEditingId(null);
    setLabel('');
    setUrl('');
    const maxOrder = nextRows.reduce((m, r) => Math.max(m, r.order), 0);
    setOrder(maxOrder + 1);
  };

  const handleEdit = (row: NavLinkRow) => {
    setEditingId(row.id);
    setLabel(row.label);
    setUrl(row.url);
    setOrder(row.order);
    setError('');
    setStatusMessage('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setError('');
    setStatusMessage('');

    if (!label.trim() || !url.trim()) {
      setError('Both Link Label and URL are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        label: label.trim(),
        url: url.trim(),
        order: Number(order) || 1,
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from('nav_links')
          .update(payload)
          .eq('id', editingId);

        if (updateError) {
          setError(formatSupabaseError(updateError, 'Failed to update nav_links'));
          return;
        }
        setStatusMessage(`Updated "${payload.label}".`);
      } else {
        const { error: insertError } = await supabase
          .from('nav_links')
          .insert(payload);

        if (insertError) {
          setError(formatSupabaseError(insertError, 'Failed to add link'));
          return;
        }
        setStatusMessage(`Added "${payload.label}".`);
      }

      resetForm();
      await loadLinks();
    } catch (err) {
      setError(formatSupabaseError(err, 'Failed to save link'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: NavLinkRow) => {
    if (!supabase) return;
    setError('');
    setStatusMessage('');
    try {
      const { error: deleteError } = await supabase
        .from('nav_links')
        .delete()
        .eq('id', row.id);

      if (deleteError) {
        setError(formatSupabaseError(deleteError, 'Failed to delete link'));
        return;
      }
      if (editingId === row.id) resetForm();
      setStatusMessage(`Removed "${row.label}".`);
      await loadLinks();
    } catch (err) {
      setError(formatSupabaseError(err, 'Failed to delete link'));
    }
  };

  const handleAdjustOrder = async (row: NavLinkRow, delta: number) => {
    if (!supabase) return;
    const nextOrder = Math.max(1, row.order + delta);
    try {
      const { error: updateError } = await supabase
        .from('nav_links')
        .update({ order: nextOrder })
        .eq('id', row.id);
      if (updateError) {
        setError(formatSupabaseError(updateError, 'Failed to reorder link'));
        return;
      }
      await loadLinks();
    } catch (err) {
      setError(formatSupabaseError(err, 'Failed to reorder link'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[#F5F5F7]">
          Link Forwarding (nav_links)
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Add, edit, reorder, and remove public Navbar &amp; Footer navigation links.
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
        <form
          onSubmit={handleSubmit}
          className="space-y-4 border border-[#1E3A5F]/70 bg-[#0A192F] p-6 xl:col-span-4 self-start"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-[#F5F5F7]">
              {editingId ? 'Edit Link' : 'Add Navigation Link'}
            </h3>
            {editingId && (
              <button
                type="button"
                onClick={() => resetForm()}
                className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-200">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Pricing"
              required
              className="mt-2 block w-full border border-[#1E3A5F] bg-[#050505] px-3.5 py-2.5 text-sm text-[#F5F5F7] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-200">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="#products or https://..."
              required
              className="mt-2 block w-full border border-[#1E3A5F] bg-[#050505] px-3.5 py-2.5 font-mono text-sm text-[#F5F5F7] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-200">Order</label>
            <input
              type="number"
              min={1}
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="mt-2 block w-full border border-[#1E3A5F] bg-[#050505] px-3.5 py-2.5 font-mono text-sm text-[#F5F5F7] tabular-nums focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex min-h-[42px] w-full items-center justify-center gap-2 bg-[#D4AF37] px-5 py-2.5 text-xs font-semibold text-[#050505] hover:bg-[#E5C558] disabled:opacity-50 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{saving ? 'Saving...' : editingId ? 'Update Link' : 'Add Link'}</span>
          </button>
        </form>

        <div className="border border-[#1E3A5F]/70 bg-[#0A192F] xl:col-span-8 overflow-x-auto">
          {loading ? (
            <div className="space-y-3 p-5">
              <div className="h-10 animate-pulse bg-white/5" />
              <div className="h-10 animate-pulse bg-white/5" />
            </div>
          ) : links.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-zinc-200">
                No links in nav_links table
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                The public website displays hardcoded fallback links until you add
                entries here.
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#1E3A5F] text-xs font-medium text-zinc-300">
                  <th className="px-5 py-3.5">Label</th>
                  <th className="px-5 py-3.5">Destination URL</th>
                  <th className="px-5 py-3.5 text-right">Order</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3A5F]">
                {links.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-medium text-[#F5F5F7]">
                      {row.label}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-zinc-300">
                      {row.url}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-xs text-zinc-200 tabular-nums">
                      {row.order}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleAdjustOrder(row, -1)}
                          aria-label={`Move ${row.label} up`}
                          className="inline-flex h-8 w-8 items-center justify-center text-zinc-300 hover:text-white cursor-pointer"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdjustOrder(row, 1)}
                          aria-label={`Move ${row.label} down`}
                          className="inline-flex h-8 w-8 items-center justify-center text-zinc-300 hover:text-white cursor-pointer"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(row)}
                          aria-label={`Edit ${row.label}`}
                          className="inline-flex h-8 w-8 items-center justify-center text-zinc-300 hover:text-[#D4AF37] cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row)}
                          aria-label={`Delete ${row.label}`}
                          className="inline-flex h-8 w-8 items-center justify-center text-zinc-300 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
