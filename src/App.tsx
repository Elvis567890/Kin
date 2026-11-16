/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from './lib/supabaseClient';
import { PublicWebsite } from './components/public/PublicWebsite';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminPanel } from './components/admin/AdminPanel';

export default function App() {
  const [pathname, setPathname] = useState<string>(() => window.location.pathname);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const navigate = useCallback((targetPath: string, replace = false) => {
    if (window.location.pathname !== targetPath) {
      if (replace) {
        window.history.replaceState({}, '', targetPath);
      } else {
        window.history.pushState({}, '', targetPath);
      }
      setPathname(targetPath);
    }
  }, []);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthLoading(false);
      return;
    }

    let mounted = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (mounted) {
          setSession(data.session);
          setAuthLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setAuthLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Route protection redirects for /admin and /admin/login
  useEffect(() => {
    if (authLoading) return;
    if (pathname === '/admin' && !session) {
      navigate('/admin/login', true);
    } else if (pathname === '/admin/login' && session) {
      navigate('/admin', true);
    }
  }, [authLoading, pathname, session, navigate]);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    navigate('/admin/login', true);
  };

  if (pathname === '/admin/login') {
    if (authLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#050505] text-sm text-zinc-400">
          Checking authentication...
        </div>
      );
    }
    return (
      <AdminLoginPage
        onSuccess={() => {
          navigate('/admin', true);
        }}
      />
    );
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (authLoading || !session) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#050505] text-sm text-zinc-400">
          Redirecting to administrator login...
        </div>
      );
    }

    return (
      <AdminPanel
        userEmail={session.user.email || 'Administrator'}
        onSignOut={handleSignOut}
        onNavigatePublic={() => navigate('/')}
      />
    );
  }

  return <PublicWebsite />;
}
