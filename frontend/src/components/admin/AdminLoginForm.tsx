'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Prefetch admin dashboard bundle on mount for instant zero-delay navigation
  useEffect(() => {
    router.prefetch('/admin/dashboard');
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password;

    if (!cleanEmail || !cleanPass) {
      setErrorMsg('Please enter both work email and password.');
      return;
    }

    setIsLoading(true);

    const validEmail = cleanEmail === 'admin@officespacenoida.com';
    const validPass = cleanPass === 'Admin@Noida2026';

    if (validEmail && validPass) {
      // Store authenticated session instantly
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_token', 'authorized_admin_session_active');
        localStorage.setItem('admin_email', cleanEmail);
      }
      setSuccessMsg('Authentication verified! Redirecting...');
      // Instant transition
      router.push('/admin/dashboard');
    } else {
      setIsLoading(false);
      setErrorMsg('Invalid Credentials. Use admin@officespacenoida.com and Admin@Noida2026');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-[0_12px_40px_-8px_rgba(12,26,48,0.12)] border border-slate-150 overflow-hidden p-7 sm:p-9 relative">
        {/* Subtle top gold accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600" />

        {/* Portal Header & Brand Logo: Perfectly stacked & centered */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white border border-gold-200 shadow-sm p-2 flex items-center justify-center mb-3 ring-4 ring-gold-50/70">
            <div className="relative w-full h-full">
              <Image
                src="/brand-logo.png"
                alt="Noida Office Spaces"
                fill
                sizes="64px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-50 border border-navy-150/80 text-[10.5px] font-bold tracking-wider text-navy-800 uppercase mb-2.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-navy-700 animate-pulse" />
            <span>Internal Operations Portal</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-[26px] font-bold text-navy-950 tracking-tight">
            Admin Authentication
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Access internal commercial inventory & sector listings
          </p>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-900 mb-1.5">
              Work Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@officespacenoida.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 transition-all bg-slate-50/50 hover:bg-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-900">
                Password
              </label>
              <button
                type="button"
                className="text-[11px] font-medium text-gold-600 hover:text-gold-700 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 transition-all bg-slate-50/50 hover:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-navy-900 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-gold-600 focus:ring-gold-500"
              />
              <span>Remember this browser</span>
            </label>
            <span className="text-[11px] text-slate-400">256-Bit SSL Encrypted</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-gold py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-800 hover:text-gold-600 transition-colors"
          >
            <span>← Back to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
