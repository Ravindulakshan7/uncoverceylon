'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft, Check, Key, ExternalLink, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    login,
    register,
    refreshSession,
  } = useAuth();

  // 'main' (TripAdvisor screen), 'email' (Email sign in / create account), 'google_setup' (Google Cloud setup guide if Client ID not set)
  const [view, setView] = useState<'main' | 'email' | 'google_setup'>('main');
  const [emailTab, setEmailTab] = useState<'signin' | 'signup'>('signin');

  // Form fields for Email
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Google Setup Form fields (for adding real Google OAuth credentials)
  const [inputClientId, setInputClientId] = useState('');
  const [inputClientSecret, setInputClientSecret] = useState('');
  const [savingGoogleCreds, setSavingGoogleCreds] = useState(false);

  // Check URL parameters for OAuth redirect results
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const authSuccess = params.get('auth_success');
    const authError = params.get('auth_error');

    if (authSuccess === 'google') {
      toast.success('Successfully signed in with Google! Welcome to Uncover Ceylon. 🎉');
      refreshSession();
      // Clean query params
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    } else if (authError) {
      toast.error(`Google Sign-In: ${authError}`);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [refreshSession]);

  // Reset view when modal opens/closes
  useEffect(() => {
    if (isAuthModalOpen) {
      setView(authModalMode === 'signup' ? 'email' : 'main');
      setEmailTab(authModalMode === 'signup' ? 'signup' : 'signin');
      setName('');
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setSubmitting(false);
    }
  }, [isAuthModalOpen, authModalMode]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (emailTab === 'signup') {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRealGoogleClick = () => {
    const configuredClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (configuredClientId && configuredClientId.trim() !== '') {
      // Redirect to official Google OAuth 2.0 authorization dialog (accounts.google.com)
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
      window.location.href = `/api/auth/google/login?return_to=${encodeURIComponent(currentPath)}`;
    } else {
      // Show Google Cloud Credentials setup view
      setView('google_setup');
    }
  };

  const handleSaveGoogleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputClientId.trim()) {
      toast.error('Please enter your Google Client ID.');
      return;
    }

    setSavingGoogleCreds(true);
    try {
      const res = await fetch('/api/admin/google-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: inputClientId.trim(),
          clientSecret: inputClientSecret.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save Google credentials');

      toast.success('Google OAuth connected! Opening Google Sign-In...');
      // Launch Google OAuth immediately
      setTimeout(() => {
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
        window.location.href = `/api/auth/google/login?return_to=${encodeURIComponent(currentPath)}`;
      }, 500);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save credentials');
    } finally {
      setSavingGoogleCreds(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* ━━━ Backdrop Blur ━━━ */}
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* ━━━ Modal Card ━━━ */}
      <div className="relative w-full max-w-[460px] bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-700 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            VIEW 1: TRIPADVISOR VIBE (SCREENSHOT 1)
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {view === 'main' && (
          <div className="p-7 sm:p-10 flex flex-col items-center text-center">
            {/* Top Owl Logo Circle */}
            <div className="w-16 h-16 rounded-full bg-[#00aa6c] text-[#002b11] flex items-center justify-center shadow-lg mb-6 shadow-[#00aa6c]/20">
              <svg className="w-10 h-7" viewBox="0 0 36 24" fill="none">
                <circle cx="11" cy="12" r="8" stroke="#002b11" strokeWidth="2.5" fill="#fff" />
                <circle cx="25" cy="12" r="8" stroke="#002b11" strokeWidth="2.5" fill="#fff" />
                <circle cx="11" cy="12" r="3.5" fill="#002b11" />
                <circle cx="25" cy="12" r="3.5" fill="#002b11" />
                <path d="M18 10L18 14" stroke="#002b11" strokeWidth="2" strokeLinecap="round" />
                <circle cx="11" cy="12" r="1.5" fill="#fff" />
                <circle cx="25" cy="12" r="1.5" fill="#fff" />
              </svg>
            </div>

            {/* Headline */}
            <h3 className="text-2xl sm:text-[26px] font-black tracking-tight text-[#0f1b2d] leading-[1.2] max-w-[320px] mb-2">
              Sign in to unlock the best of Uncover Ceylon
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 mb-8 max-w-[320px]">
              Save hidden gems, write traveler reviews, and sync your favorite Sri Lanka destinations.
            </p>

            {/* Action Buttons */}
            <div className="w-full space-y-3 mb-6">
              {/* Button 1: Real Continue with Google */}
              <button
                type="button"
                onClick={handleRealGoogleClick}
                className="w-full h-12 rounded-full border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm flex items-center justify-center gap-3 transition-all duration-200 shadow-xs cursor-pointer active:scale-[0.98]"
              >
                {/* Official Google G Icon */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Button 2: Continue with Email */}
              <button
                type="button"
                onClick={() => setView('email')}
                className="w-full h-12 rounded-full border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm flex items-center justify-center gap-3 transition-all duration-200 shadow-xs cursor-pointer active:scale-[0.98]"
              >
                <Mail className="w-5 h-5 text-slate-600 shrink-0" />
                <span>Continue with email</span>
              </button>
            </div>

            {/* Legal Footer (Screenshot 1 Exact) */}
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-[340px]">
              By proceeding, you agree to our{' '}
              <a href="/terms" className="underline font-bold text-slate-700 hover:text-black">
                Terms of Use
              </a>{' '}
              and confirm you have read our{' '}
              <a href="/privacy" className="underline font-bold text-slate-700 hover:text-black">
                Privacy and Cookie Statement
              </a>
              .
            </p>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            VIEW 2: EMAIL SIGN IN & REGISTRATION FORM
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {view === 'email' && (
          <div className="p-7 sm:p-9 animate-in fade-in duration-150">
            {/* Top Back Nav */}
            <button
              type="button"
              onClick={() => setView('main')}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-black mb-5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All sign in options</span>
            </button>

            {/* Tabs: Sign In / Create Account */}
            <div className="flex rounded-full bg-slate-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => setEmailTab('signin')}
                className={`flex-1 py-2 text-xs sm:text-[13px] font-bold rounded-full transition-all cursor-pointer ${
                  emailTab === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setEmailTab('signup')}
                className={`flex-1 py-2 text-xs sm:text-[13px] font-bold rounded-full transition-all cursor-pointer ${
                  emailTab === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {emailTab === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Kasun Perera"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aa6c] text-slate-900"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="kasun@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aa6c] text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aa6c] text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-full bg-[#00aa6c] hover:bg-[#008f5a] text-[#002b11] font-bold text-sm shadow-md shadow-[#00aa6c]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50 mt-2"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{emailTab === 'signup' ? 'Create Account' : 'Sign In'}</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            VIEW 3: REAL GOOGLE OAUTH CREDENTIALS SETUP (ONE-TIME)
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {view === 'google_setup' && (
          <div className="p-7 sm:p-9 animate-in fade-in duration-150">
            {/* Top Back Nav */}
            <button
              type="button"
              onClick={() => setView('main')}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-black mb-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Key className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-black text-slate-900">Connect Real Google Sign-In</h4>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Customer ලාට YouTube හෝ TripAdvisor වල වගේ <b>Google හි real accounts</b> (accounts.google.com) හරහා log
              වෙන්න Google Cloud OAuth Client ID එකක් අවශ්‍යයි.
            </p>

            <form onSubmit={handleSaveGoogleCredentials} className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Client ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="xxxxx.apps.googleusercontent.com"
                  value={inputClientId}
                  onChange={(e) => setInputClientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Client Secret <span className="text-slate-400 font-normal">(Optional for GSI)</span>
                </label>
                <input
                  type="password"
                  placeholder="GOCSPX-xxxx..."
                  value={inputClientSecret}
                  onChange={(e) => setInputClientSecret(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={savingGoogleCreds}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {savingGoogleCreds ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Save & Launch Real Google Login</span>
              </button>
            </form>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>How to get Free Google Client ID:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                <li>
                  Go to{' '}
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline font-semibold inline-flex items-center gap-0.5"
                  >
                    Google Cloud Console <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li>Create <b>OAuth 2.0 Client ID</b> (Web application)</li>
                <li>
                  Add Authorized Redirect URI:{' '}
                  <code className="bg-slate-200/80 px-1 py-0.5 rounded text-[10px] text-slate-800 font-mono">
                    http://localhost:3000/api/auth/google/callback
                  </code>
                </li>
                <li>Copy the Client ID and paste it above!</li>
              </ol>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-center">
              <button
                type="button"
                onClick={() => setView('email')}
                className="text-xs font-bold text-slate-600 hover:text-black underline cursor-pointer"
              >
                Sign in with Email instead →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
