'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';
import { useThemeLang } from '@/context/ThemeLanguageContext';
import { api } from '@/lib/api';
import { AdminStats, AdminUser } from '@/lib/types';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { t, language } = useThemeLang();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const loadAdminData = useCallback(async () => {
    if (!user || user.role !== 'admin') {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getUsers(),
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
      if (usersRes.success && usersRes.data) {
        setUsers(usersRes.data);
      } else if (!usersRes.success) {
        setError(usersRes.message || (language === 'ar' ? 'فشل تحميل بيانات المستخدمين.' : 'Failed to fetch admin users data.'));
      }
    } catch {
      setError(language === 'ar' ? 'تعذر الاتصال بخادم الإدارة.' : 'Could not connect to admin endpoint.');
    } finally {
      setLoading(false);
    }
  }, [user, language]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleToggleRole = async (targetUser: AdminUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const confirmPrompt =
      language === 'ar'
        ? `هل أنت متأكد من تغيير صلاحية "${targetUser.name}" إلى ${newRole === 'admin' ? 'أدمن' : 'مستخدم'}؟`
        : `Are you sure you want to change role for "${targetUser.name}" to ${newRole}?`;

    if (confirm(confirmPrompt)) {
      try {
        const res = await api.admin.updateRole(targetUser.id, newRole);
        if (res.success) {
          setActionNotice(
            language === 'ar'
              ? `تم تحديث صلاحية ${targetUser.name} إلى ${newRole === 'admin' ? 'أدمن' : 'مستخدم'}`
              : `Updated ${targetUser.name}'s role to ${newRole}`
          );
          setTimeout(() => setActionNotice(null), 3000);
          await loadAdminData();
        } else {
          alert(res.message || (language === 'ar' ? 'فشل تحديث الصلاحية' : 'Failed to update role'));
        }
      } catch {
        alert(language === 'ar' ? 'حدث خطأ في الشبكة أثناء تحديث الصلاحية' : 'Network error updating role');
      }
    }
  };

  // If user is not logged in or not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col pb-16">
        <Header onOpenAuth={() => setIsAuthModalOpen(true)} />

        <main className="w-full max-w-4xl mx-auto px-4 sm:px-8 mt-16 text-center">
          <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-[32px] p-12 border border-stone-200/60 dark:border-stone-800 shadow-lg flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-2xl font-bold">
              🔒
            </div>
            <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
              {t('adminAccessRequired')}
            </h1>
            <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md">
              {language === 'ar'
                ? 'هذه المنطقة مخصصة للمسؤولين فقط. يجب تسجيل الدخول بحساب أدمن (مثل admin@example.com).'
                : 'This area is restricted to administrators only. You must be signed in with an admin account (such as admin@example.com).'}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <Link
                href="/"
                className="px-5 py-2.5 rounded-full border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                {t('backToDashboard')}
              </Link>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                {t('signInAsAdmin')}
              </button>
            </div>
          </div>
        </main>

        <AuthModal
          isOpen={isAuthModalOpen}
          isAdminOnly={true}
          onClose={() => {
            setIsAuthModalOpen(false);
            loadAdminData();
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Header onOpenAuth={() => setIsAuthModalOpen(true)} />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-6 flex flex-col gap-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
                {t('adminPanel')}
              </h1>
              <span className="bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                {language === 'ar' ? 'صلاحيات الأدمن' : 'Admin Privilege'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {language === 'ar'
                ? 'نظرة عامة على النظام وإحصائيات قاعدة البيانات وإدارة صلاحيات المستخدمين'
                : 'System overview, database statistics, and user permissions management'}
            </p>
          </div>

          <button
            onClick={loadAdminData}
            className="px-4 py-2 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors self-start sm:self-auto cursor-pointer"
          >
            ↻ {t('refreshData')}
          </button>
        </div>

        {/* Action Notice */}
        {actionNotice && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in">
            ✓ {actionNotice}
          </div>
        )}

        {/* Error Notice */}
        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={loadAdminData} className="underline font-semibold cursor-pointer">
              {t('retry')}
            </button>
          </div>
        )}

        {/* 4 Admin Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Users */}
          <div className="bg-white/85 dark:bg-stone-900/85 backdrop-blur-md rounded-[26px] p-5 border border-white/70 dark:border-stone-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {t('registeredUsers')}
            </span>
            <div className="text-3xl font-black text-stone-900 dark:text-stone-100 mt-2">
              {stats?.totalUsers ?? users.length}
            </div>
            <span className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">
              {language === 'ar' ? 'إجمالي الحسابات المسجلة' : 'Total database accounts'}
            </span>
          </div>

          {/* Card 2: Total Tasks */}
          <div className="bg-white/85 dark:bg-stone-900/85 backdrop-blur-md rounded-[26px] p-5 border border-white/70 dark:border-stone-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {t('totalSystemTasks')}
            </span>
            <div className="text-3xl font-black text-stone-900 dark:text-stone-100 mt-2">
              {stats?.totalTasks ?? 0}
            </div>
            <span className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">
              {language === 'ar' ? 'لكافة المستخدمين' : 'Across all users'}
            </span>
          </div>

          {/* Card 3: Completed Tasks */}
          <div className="bg-[#FDC858] rounded-[26px] p-5 shadow-sm text-stone-950 flex flex-col justify-between">
            <span className="text-xs font-semibold text-stone-900/80">
              {t('completed')}
            </span>
            <div className="text-3xl font-black text-stone-950 mt-2">
              {stats?.tasksByStatus.completed ?? 0}
            </div>
            <span className="text-[11px] text-stone-900/80 mt-1">
              {t('inProgress')}: {stats?.tasksByStatus.in_progress ?? 0}
            </span>
          </div>

          {/* Card 4: High Priority Tasks */}
          <div className="bg-white/85 dark:bg-stone-900/85 backdrop-blur-md rounded-[26px] p-5 border border-white/70 dark:border-stone-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <span>🔥 {t('highPriority')}</span>
            </span>
            <div className="text-3xl font-black text-stone-900 dark:text-stone-100 mt-2">
              {stats?.tasksByPriority.high ?? 0}
            </div>
            <span className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">
              {t('medium')}: {stats?.tasksByPriority.medium ?? 0} &bull; {t('low')}:{' '}
              {stats?.tasksByPriority.low ?? 0}
            </span>
          </div>
        </div>

        {/* Users Management Section */}
        <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-[28px] border border-white/70 dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                {t('userAccountsPermissions')}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {language === 'ar'
                  ? 'عرض المستخدمين وإدارة صلاحياتهم في النظام'
                  : 'View registered users and manage their role permissions'}
              </p>
            </div>
            <span className="text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-3 py-1 rounded-full">
              {users.length} {t('user')}
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-stone-500 dark:text-stone-400 animate-pulse">
              {language === 'ar' ? 'جاري تحميل بيانات المستخدمين...' : 'Loading users data...'}
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500 dark:text-stone-400">
              {language === 'ar' ? 'لا يوجد مستخدمون مسجلون بعد.' : 'No users registered yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right text-xs">
                <thead>
                  <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/70 text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-6">{t('user')}</th>
                    <th className="py-3.5 px-6">{t('emailAddress')}</th>
                    <th className="py-3.5 px-6">{t('role')}</th>
                    <th className="py-3.5 px-6">{t('tasksCreated')}</th>
                    <th className="py-3.5 px-6">{t('registered')}</th>
                    <th className="py-3.5 px-6 text-right rtl:text-left">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-stone-50/70 dark:hover:bg-stone-800/50 transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 text-white font-bold text-xs flex items-center justify-center">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-stone-900 dark:text-stone-100">
                            {u.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 whitespace-nowrap font-mono text-[11px] text-stone-600 dark:text-stone-400">
                        {u.email}
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            u.role === 'admin'
                              ? 'bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 shadow-xs'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>

                      {/* Tasks Created */}
                      <td className="py-4 px-6 whitespace-nowrap font-semibold text-stone-700 dark:text-stone-300">
                        {u.taskCount} {language === 'ar' ? 'مهام' : 'tasks'}
                      </td>

                      {/* Registered Date */}
                      <td className="py-4 px-6 whitespace-nowrap text-stone-400 dark:text-stone-500">
                        {new Date(u.createdAt).toLocaleDateString(
                          language === 'ar' ? 'ar-EG' : 'en-US'
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 whitespace-nowrap text-right rtl:text-left">
                        {u.id === user.id ? (
                          <span className="text-[11px] text-stone-400 dark:text-stone-500 italic">
                            {t('currentSession')}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleRole(u)}
                            className="text-xs font-semibold px-3 py-1 rounded-full border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-800 dark:text-stone-200 cursor-pointer"
                          >
                            {u.role === 'admin' ? t('demoteToUser') : t('makeAdmin')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        isAdminOnly={true}
        onClose={() => {
          setIsAuthModalOpen(false);
          loadAdminData();
        }}
      />
    </div>
  );
}
