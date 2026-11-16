import { FormEvent, useEffect, useState } from 'react';
import { ArrowDownToLine, CheckCircle2, Smartphone, X } from 'lucide-react';
import type { ProductItem } from '../types/site';

export type ActiveModal =
  | { type: 'download' }
  | { type: 'specs'; product: ProductItem }
  | { type: 'waitlist'; product: ProductItem }
  | null;

interface ActionModalProps {
  modal: ActiveModal;
  onClose: () => void;
  onSwitchToDownload: () => void;
}

const PLATFORMS = [
  {
    id: 'ios',
    name: 'Abrimax Studio for iOS',
    meta: 'iOS 17.0+ · Universal Build · 84 MB',
    action: 'Download via App Store',
  },
  {
    id: 'android',
    name: 'Abrimax Studio for Android',
    meta: 'Android 13+ · ARM64 Signed APK · 78 MB',
    action: 'Download Android Package',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Newsroom MDM',
    meta: 'Managed Fleet Provisioning · Volume Keys',
    action: 'Request Fleet Installer',
  },
];

export function ActionModal({
  modal,
  onClose,
  onSwitchToDownload,
}: ActionModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistError, setWaitlistError] = useState('');

  useEffect(() => {
    setSelectedPlatform(null);
    setWaitlistEmail('');
    setWaitlistSubmitted(false);
    setWaitlistError('');
  }, [modal]);

  useEffect(() => {
    if (!modal) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [modal, onClose]);

  if (!modal) return null;

  const handleWaitlistSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(waitlistEmail.trim())) {
      setWaitlistError('Please enter a valid email address.');
      return;
    }
    setWaitlistError('');
    setWaitlistSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg border border-white/15 bg-[#0D0D11] p-7 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="text-xs font-medium text-[#D4AF37]">
              {modal.type === 'download' && 'AFRINODE Mobile Suite'}
              {modal.type === 'specs' && 'Technical Specifications'}
              {modal.type === 'waitlist' && 'Future Release Notification'}
            </p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-[#F5F5F7]">
              {modal.type === 'download' && 'Download Abrimax Studio'}
              {modal.type === 'specs' && modal.product.name}
              {modal.type === 'waitlist' && modal.product.name}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-10 w-10 items-center justify-center border border-white/10 text-zinc-400 transition-colors hover:border-[#D4AF37] hover:text-[#F5F5F7] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Download App Modal Body */}
        {modal.type === 'download' && (
          <div className="mt-6 space-y-4">
            <p className="text-sm leading-relaxed text-zinc-300">
              Select your target platform to download Abrimax Studio—our flagship
              mobile broadcasting application built for low-latency live production.
            </p>

            <div className="space-y-3 pt-2">
              {PLATFORMS.map((plat) => {
                const isSelected = selectedPlatform === plat.id;
                return (
                  <div
                    key={plat.id}
                    className={`flex flex-col gap-3 border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                      isSelected
                        ? 'border-[#D4AF37] bg-[#14141A]'
                        : 'border-white/10 bg-[#050507]'
                    }`}
                  >
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-[#F5F5F7]">
                        <Smartphone className="h-4 w-4 text-[#D4AF37]" />
                        <span>{plat.name}</span>
                      </p>
                      <p className="mt-1 text-xs text-zinc-400 font-mono">
                        {plat.meta}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedPlatform(plat.id)}
                      className={`inline-flex min-h-[40px] items-center justify-center gap-2 px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4AF37] text-[#050507]'
                          : 'border border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050507]'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Package Ready</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownToLine className="h-3.5 w-3.5" />
                          <span>{plat.action}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {selectedPlatform && (
              <div className="border border-[#D4AF37]/40 bg-[#D4AF37]/10 p-4 text-xs leading-relaxed text-zinc-200">
                Installer verified with SHA-256 checksum. Your download package for{' '}
                <span className="font-semibold text-[#D4AF37]">
                  {PLATFORMS.find((p) => p.id === selectedPlatform)?.name}
                </span>{' '}
                is prepared and ready for device installation.
              </div>
            )}
          </div>
        )}

        {/* Abrimax Studio Specs Modal Body */}
        {modal.type === 'specs' && modal.product.specs && (
          <div className="mt-6 space-y-5">
            <p className="text-sm leading-relaxed text-zinc-300">
              {modal.product.summary}
            </p>

            <dl className="divide-y divide-white/10 border-t border-b border-white/10 text-sm">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-zinc-400">Supported OS</dt>
                <dd className="font-medium text-[#F5F5F7] text-right">
                  {modal.product.specs.platforms}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-zinc-400">Transport Latency</dt>
                <dd className="font-medium text-[#D4AF37] text-right tabular-nums">
                  {modal.product.specs.latency}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-zinc-400">Audio Pipeline</dt>
                <dd className="font-medium text-[#F5F5F7] text-right">
                  {modal.product.specs.audioEngine}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-zinc-400">Network Resilience</dt>
                <dd className="font-medium text-[#F5F5F7] text-right">
                  {modal.product.specs.bitrateControl}
                </dd>
              </div>
            </dl>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={onSwitchToDownload}
                className="inline-flex min-h-[44px] items-center gap-2 bg-[#D4AF37] px-6 py-2.5 text-xs font-semibold text-[#050507] transition-colors hover:bg-[#E5C558] cursor-pointer"
              >
                <ArrowDownToLine className="h-3.5 w-3.5" />
                <span>Download Abrimax Studio</span>
              </button>
            </div>
          </div>
        )}

        {/* Future App Placeholder Waitlist Modal Body */}
        {modal.type === 'waitlist' && (
          <div className="mt-6 space-y-5">
            <p className="text-sm leading-relaxed text-zinc-300">
              {modal.product.name} is currently an upcoming release in the AFRINODE
              product roadmap ({modal.product.availability}). Register below to receive
              architecture previews and early-access invitations.
            </p>

            {waitlistSubmitted ? (
              <div className="border border-[#D4AF37]/40 bg-[#D4AF37]/10 p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#D4AF37]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Added to {modal.product.name} preview list</span>
                </p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                  We will notify <span className="text-[#F5F5F7]">{waitlistEmail}</span>{' '}
                  when early builds open for testing.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="waitlist-email"
                    className="block text-xs font-medium text-zinc-300"
                  >
                    Email Address
                  </label>
                  <input
                    id="waitlist-email"
                    type="email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="you@organization.africa"
                    required
                    className="mt-2 block w-full border border-white/15 bg-[#050507] px-4 py-3 text-sm text-[#F5F5F7] placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                {waitlistError && (
                  <p role="alert" className="text-xs font-medium text-[#E5C558]">
                    {waitlistError}
                  </p>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="min-h-[42px] border border-white/15 px-5 py-2 text-xs font-medium text-zinc-300 hover:text-[#F5F5F7] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="min-h-[42px] bg-[#D4AF37] px-6 py-2 text-xs font-semibold text-[#050507] transition-colors hover:bg-[#E5C558] cursor-pointer"
                  >
                    Notify Me
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
