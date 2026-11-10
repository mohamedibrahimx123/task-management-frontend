'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LissoLogo, BellIcon } from './Icons';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onOpenAuth?: () => void;
}

export function Header({ onOpenAuth }: HeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [teamMode, setTeamMode] = useState<'Private' | 'Team'>('Team');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Tasks', href: '/tasks' },
  ];

  // Show Admin link if user is admin
  if (user?.role === 'admin') {
    navItems.push({ label: 'Admin', href: '/admin' });
  }

  return (
    <header className="w-full pt-4 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="bg-white/85 backdrop-blur-md rounded-full px-5 py-2.5 border border-stone-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between gap-4">
        {/* Left: Lisso Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer select-none">
          <div className="w-7 h-7 flex items-center justify-center text-stone-900">
            <LissoLogo className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-stone-900 font-sans">
            Lisso
          </span>
        </Link>

        {/* Center: Navigation Links (Working pages) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
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

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Private / Team Pill Toggle */}
          <div className="flex items-center bg-stone-100/90 rounded-full p-0.5 border border-stone-200/40 text-xs font-medium">
            <button
              onClick={() => setTeamMode('Private')}
              className={`px-3 py-1 rounded-full transition-all ${
                teamMode === 'Private'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Private
            </button>
            <button
              onClick={() => setTeamMode('Team')}
              className={`px-3 py-1 rounded-full transition-all ${
                teamMode === 'Team'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Team
            </button>
          </div>

          {/* Clean Bell Icon Button */}
          <button className="w-8 h-8 rounded-full border border-stone-200/60 bg-white flex items-center justify-center hover:bg-stone-50 text-stone-700 transition-colors">
            <BellIcon className="w-4 h-4" />
          </button>

          {/* User Profile / Auth Toggle */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-stone-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-rose-400 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-stone-800 max-w-[80px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-10 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-stone-100 mb-1">
                    <p className="font-semibold text-stone-900 truncate">{user.name}</p>
                    <p className="text-stone-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium">
                      Role: {user.role}
                    </span>
                  </div>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setShowProfileMenu(false)}
                      className="block px-3 py-1.5 text-stone-800 hover:bg-stone-50 rounded-xl transition-colors font-medium mb-1"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs font-medium px-4 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white shadow-sm transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
