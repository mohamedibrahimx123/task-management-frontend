'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LissoLogo, BellIcon } from './Icons';
import { useAuth } from '@/context/AuthContext';
import { useThemeLang } from '@/context/ThemeLanguageContext';

interface HeaderProps {
  onOpenAuth?: () => void;
}

export function Header({ onOpenAuth }: HeaderProps) {
  const { user, logout } = useAuth();
  const { language, theme, toggleLanguage, toggleTheme, t } = useThemeLang();
  const pathname = usePathname();
  const [teamMode, setTeamMode] = useState<'Private' | 'Team'>('Team');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { label: t('dashboard'), href: '/' },
    { label: t('tasks'), href: '/tasks' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ label: t('admin'), href: '/admin' });
  }

  return (
    <header className="w-full pt-4 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="bg-white/85 backdrop-blur-md rounded-full px-5 py-2.5 border border-stone-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3">
        {/* Left: Lisso Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer select-none shrink-0">
          <div className="w-7 h-7 flex items-center justify-center text-stone-900">
            <LissoLogo className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-stone-900 font-sans">
            Lisso
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors py-1 ${
                  isActive
                    ? 'text-stone-950 font-semibold border-b-2 border-stone-950'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions, Language Toggle, Dark Mode & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle (AR / EN) */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 text-xs font-semibold rounded-full border border-stone-200/70 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors"
            title="تغيير اللغة / Switch Language"
          >
            {language === 'ar' ? 'English' : 'العربية'}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full border border-stone-200/60 bg-white flex items-center justify-center hover:bg-stone-50 text-stone-700 transition-colors text-sm"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Private / Team Pill Toggle */}
          <div className="hidden sm:flex items-center bg-stone-100/90 rounded-full p-0.5 border border-stone-200/40 text-xs font-medium">
            <button
              onClick={() => setTeamMode('Private')}
              className={`px-3 py-1 rounded-full transition-all ${
                teamMode === 'Private'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('private')}
            </button>
            <button
              onClick={() => setTeamMode('Team')}
              className={`px-3 py-1 rounded-full transition-all ${
                teamMode === 'Team'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('team')}
            </button>
          </div>

          {/* Notification Bell */}
          <button className="w-8 h-8 rounded-full border border-stone-200/60 bg-white flex items-center justify-center hover:bg-stone-50 text-stone-700 transition-colors">
            <BellIcon className="w-4 h-4" />
          </button>

          {/* User Profile / Auth Toggle */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-stone-100 transition-colors border border-stone-200/50"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-rose-400 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-stone-900 max-w-[90px] truncate">
                  {user.name}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute ltr:right-0 rtl:left-0 top-10 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 z-50 text-xs animate-in fade-in">
                  <div className="px-3 py-2 border-b border-stone-100 mb-1">
                    <p className="font-semibold text-stone-900 truncate">{user.name}</p>
                    <p className="text-stone-500 truncate text-[11px]">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold">
                      {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </div>

                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setShowProfileMenu(false)}
                      className="block px-3 py-1.5 text-stone-800 hover:bg-stone-50 rounded-xl transition-colors font-medium mb-1"
                    >
                      {t('adminPanel')}
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left rtl:text-right px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-semibold"
                  >
                    {t('signOut')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs font-semibold px-4 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white shadow-sm transition-all shrink-0"
            >
              {t('signIn')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
