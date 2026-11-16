import { FormEvent, useState } from 'react';
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient';

interface AdminLoginPageProps {
  onSuccess: () => void;
}

export function AdminLoginPage({ onSuccess }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSupabaseConfigured || !supabase) {
      setError(
        'Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not configured.'
      );
      return;
    }

    if (!email.trim() || !password) {
      setError('Enter both your administrator email and password.');
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to reach Supabase Auth.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#050505] px-4 py-12 text-[#F5F5F7]">
      <div className="mx-auto w-full max-w-[440px]">
        <div className="mb-8">
          <div className="flex items-center gap-2.5 text-sm font-semibold tracking-[0.12em] text-[#D4AF37]">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>AFRINODE Admin</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#F5F5F7]">
            Sign in to Control Panel
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Protected via Supabase Auth. Only provisioned administrators can access{' '}
            <code className="font-mono text-xs text-zinc-300">/admin</code>.
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-6 border border-[#D4AF37]/40 bg-[#0A192F] p-4 text-xs leading-relaxed text-zinc-200">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />
              <div className="space-y-1.5">
                <p className="font-semibold text-[#F5F5F7]">
                  Supabase environment variables required
                </p>
                <p className="text-zinc-300">
                  Set <code className="font-mono text-[#D4AF37]">VITE_SUPABASE_URL</code>{' '}
                  and{' '}
                  <code className="font-mono text-[#D4AF37]">VITE_SUPABASE_ANON_KEY</code>{' '}
                  in your project environment, and run the SQL schema in your Supabase
                  SQL Editor.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="border border-[#1E3A5F]/70 bg-[#0A192F] p-7 sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-medium text-zinc-200"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@afrinode.africa"
                required
                className="mt-2 block w-full border border-[#1E3A5F] bg-[#050505] px-3.5 py-2.5 text-sm text-[#F5F5F7] placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-medium text-zinc-200"
              >
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="block w-full border border-[#1E3A5F] bg-[#050505] px-3.5 py-2.5 pr-10 text-sm text-[#F5F5F7] placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="border border-red-500/40 bg-red-950/50 px-3.5 py-2.5 text-xs leading-relaxed text-red-200"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-[#050505] transition-colors hover:bg-[#E5C558] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              <Lock className="h-4 w-4" />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-6 border-t border-[#1E3A5F] pt-4 text-xs text-zinc-400">
            Public sign-ups disabled · Protected by Supabase Auth
          </div>
        </div>
      </div>
    </div>
  );
}
