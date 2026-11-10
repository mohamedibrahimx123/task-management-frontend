'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useThemeLang } from '@/context/ThemeLanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminOnly?: boolean;
}

export function AuthModal({ isOpen, onClose, isAdminOnly = false }: AuthModalProps) {
  const { login, register } = useAuth();
  const { t, language } = useThemeLang();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let res;
    if (isRegister) {
      res = await register(name.trim(), email.trim(), password);
    } else {
      res = await login(email.trim(), password);
    }

    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || (language === 'ar' ? 'فشل تسجيل الدخول. تحقق من البيانات.' : 'Authentication failed. Please verify credentials.'));
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('Password123!');
    setLoading(true);
    setError(null);
    const res = await login(userEmail, 'Password123!');
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Quick login failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-100 flex flex-col gap-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              {isAdminOnly
                ? t('signInAsAdmin')
                : isRegister
                ? t('createAccount')
                : t('welcomeToLisso')}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {isAdminOnly
                ? t('adminRestrictedNotice')
                : isRegister
                ? (language === 'ar' ? 'انضم إلى فريق العمل في ثوانٍ' : 'Join the workspace team in seconds')
                : (language === 'ar' ? 'سجل الدخول لمزامنة مهامك ومساحة عملك' : 'Sign in to sync your tasks and workspace')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 text-xs rounded-2xl bg-rose-50 border border-rose-200 text-rose-700">
            {error}
          </div>
        )}

        {/* Quick Test Login Button:
            - If on normal page: ONLY show regular user demo (user@example.com)
            - If on admin page: ONLY show admin user demo (admin@example.com) */}
        <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100 flex flex-col gap-2">
          <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
            {language === 'ar' ? 'تسجيل دخول تجريبي فوري:' : 'Quick 1-Click Demo Login:'}
          </span>
          {isAdminOnly ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('admin@example.com')}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-2xs text-center"
            >
              {t('adminUserLogin')} (admin@example.com)
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('user@example.com')}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-800 hover:bg-stone-100 transition-colors shadow-2xs text-center"
            >
              {t('demoUserLogin')} (user@example.com)
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isAdminOnly && isRegister && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('fullName')} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'ar' ? 'محمد إبراهيم' : 'Mohamed Ibrahim'}
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900/10 text-stone-900 text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('email')} *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isAdminOnly ? 'admin@example.com' : 'user@example.com'}
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900/10 text-stone-900 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('password')} *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900/10 text-stone-900 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md"
          >
            {loading
              ? t('saving')
              : isRegister
              ? t('createAccount')
              : t('signIn')}
          </button>
        </form>

        {/* Toggle between Login and Register (Only for regular users) */}
        {!isAdminOnly && (
          <div className="text-center pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-xs text-stone-600 hover:text-stone-950 font-medium"
            >
              {isRegister
                ? t('alreadyHaveAccount')
                : t('dontHaveAccount')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
