'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register, loginWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Reset form when modal closes or mode changes
  useEffect(() => {
    if (!isAuthModalOpen) {
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

  const isSignUp = authModalMode === 'signup';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isSignUp) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleClick = async () => {
    setGoogleLoading(true);
    try {
      // Check if official Google Client ID is configured
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      if (googleClientId && typeof window !== 'undefined' && (window as unknown as { google?: { accounts?: { id: unknown } } }).google) {
        // GSI Flow if configured
        const google = (window as unknown as { google: { accounts: { id: { initialize: Function; prompt: Function } } } }).google;
        google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: { credential: string }) => {
            await loginWithGoogle(response.credential);
          },
        });
        google.accounts.id.prompt();
      } else {
        // Instant Google authentication simulation for seamless development / instant testing
        // Prompts user for Google display name / email or uses standard traveler profile
        const travelerName = prompt('Enter your Google Account Name:', 'Ceylon Explorer');
        if (!travelerName) {
          setGoogleLoading(false);
          return;
        }
        const travelerEmail = `${travelerName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`;
        await loginWithGoogle({
          name: travelerName,
          email: travelerEmail,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(travelerName)}&background=ea4335&color=fff&size=128`,
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      
      {/* ━━━ Backdrop Blur ━━━ */}
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* ━━━ Modal Card ━━━ */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Top Decorative Emerald Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00aa6c] via-[#3ddc9a] to-[#002b11]" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#00aa6c] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-[#0f1b2d] tracking-tight">
              {isSignUp ? 'Join Uncover Ceylon' : 'Welcome Back'}
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-1">
              {isSignUp
                ? 'Create an account to review places, save trips & more.'
                : 'Sign in to share traveler reviews and manage your favorites.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className={`flex-1 py-2 text-xs sm:text-[13px] font-bold rounded-lg transition-all cursor-pointer ${
                !isSignUp
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('signup')}
              className={`flex-1 py-2 text-xs sm:text-[13px] font-bold rounded-lg transition-all cursor-pointer ${
                isSignUp
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* ━━━ 1. CONTINUE WITH GOOGLE BUTTON ━━━ */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-60 active:scale-98"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#00aa6c]" />
            ) : (
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
            )}
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              or with email
            </span>
          </div>

          {/* ━━━ 2. EMAIL & PASSWORD FORM ━━━ */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Perera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#00aa6c] focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#00aa6c] focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#00aa6c] focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[#002b11] hover:bg-black text-white shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-98"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          {/* Switch Prompt */}
          <div className="mt-5 text-center text-xs text-slate-500">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="font-bold text-[#00aa6c] hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="font-bold text-[#00aa6c] hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
