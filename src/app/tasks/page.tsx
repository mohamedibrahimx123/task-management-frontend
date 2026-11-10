'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { TaskModal } from '@/components/TaskModal';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';
import { useThemeLang } from '@/context/ThemeLanguageContext';
import { api } from '@/lib/api';
import { CreateTaskInput, Task, TaskPriority, TaskStatus } from '@/lib/types';
import {
  CheckCircleIcon,
  CircleIcon,
  ClockIcon,
  FlameIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '@/components/Icons';

export default function TasksPage() {
  const { user } = useAuth();
  const { t, language } = useThemeLang();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'priority'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const loadTasks = useCallback(async () => {
    if (!user) {
      setError(
        language === 'ar'
          ? 'يرجى تسجيل الدخول لعرض وإدارة مهامك.'
          : 'Please sign in to view and manage your tasks.'
      );
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.tasks.getAll({
        limit: 100,
        status: filterStatus !== 'all' ? (filterStatus as TaskStatus) : undefined,
        priority: filterPriority !== 'all' ? (filterPriority as TaskPriority) : undefined,
        search: searchQuery.trim() || undefined,
        sortBy,
        sortOrder,
      });

      if (res.success && res.data) {
        setTasks(res.data);
      } else {
        setError(res.message || (language === 'ar' ? 'فشل تحميل المهام.' : 'Failed to fetch tasks.'));
      }
    } catch {
      setError(
        language === 'ar'
          ? 'تعذر الاتصال بخادم الـ Backend.'
          : 'Could not connect to backend server.'
      );
    } finally {
      setLoading(false);
    }
  }, [user, filterStatus, filterPriority, searchQuery, sortBy, sortOrder, language]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleSaveTask = async (input: CreateTaskInput): Promise<boolean> => {
    if (!user) {
      setIsAuthModalOpen(true);
      return false;
    }

    try {
      if (editingTask) {
        const res = await api.tasks.update(editingTask.id, input);
        if (res.success) {
          await loadTasks();
          return true;
        }
      } else {
        const res = await api.tasks.create(input);
        if (res.success) {
          await loadTasks();
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const confirmMsg =
      language === 'ar'
        ? 'هل أنت متأكد من رغبتك في حذف هذه المهمة؟'
        : 'Are you sure you want to delete this task?';

    if (confirm(confirmMsg)) {
      const res = await api.tasks.delete(id);
      if (res.success) {
        await loadTasks();
      } else {
        alert(res.message || (language === 'ar' ? 'فشل حذف المهمة' : 'Failed to delete task.'));
      }
    }
  };

  const handleToggleStatus = async (task: Task) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const nextStatusMap: Record<string, TaskStatus> = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'pending',
    };
    const nextStatus = nextStatusMap[task.status] || 'pending';

    const res = await api.tasks.update(task.id, { status: nextStatus });
    if (res.success) {
      await loadTasks();
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="bg-[#F87154] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-xs">
            <FlameIcon className="w-3 h-3 text-white" />
            <span>{t('high')}</span>
          </span>
        );
      case 'medium':
        return (
          <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            {t('medium')}
          </span>
        );
      case 'low':
        return (
          <span className="bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            {t('low')}
          </span>
        );
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'in_progress':
        return <ClockIcon className="w-5 h-5 text-amber-500" />;
      case 'pending':
      default:
        return (
          <CircleIcon className="w-5 h-5 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200" />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Header onOpenAuth={() => setIsAuthModalOpen(true)} />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-6 flex flex-col gap-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              {t('tasks')}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {t('tasksSubtitle')}
            </p>
          </div>

          <button
            onClick={() => {
              if (!user) {
                setIsAuthModalOpen(true);
                return;
              }
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 text-white text-xs font-semibold shadow-md transition-all self-start sm:self-auto cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            <span>{t('createTask')}</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-[24px] p-4 border border-stone-200/50 dark:border-stone-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-stone-100/80 dark:bg-stone-800 rounded-xl p-1 text-xs font-semibold text-stone-600 dark:text-stone-300">
            {[
              { id: 'all', label: t('all') },
              { id: 'pending', label: t('todo') },
              { id: 'in_progress', label: t('inProgress') },
              { id: 'completed', label: t('completed') },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterStatus === tab.id
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-bold'
                    : 'hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Priority & Search Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-medium focus:outline-none"
            >
              <option value="all">{t('allPriorities')}</option>
              <option value="high">{t('highPriority')} (🔥)</option>
              <option value="medium">{t('mediumPriority')}</option>
              <option value="low">{t('lowPriority')}</option>
            </select>

            {/* Sort Options */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb as 'createdAt' | 'dueDate' | 'priority');
                setSortOrder(so as 'asc' | 'desc');
              }}
              className="text-xs px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-medium focus:outline-none"
            >
              <option value="createdAt-desc">{t('newestFirst')}</option>
              <option value="createdAt-asc">{t('oldestFirst')}</option>
              <option value="dueDate-asc">{t('dueDateEarliest')}</option>
              <option value="priority-desc">{t('priorityHighToLow')}</option>
            </select>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchByTitle')}
              className="px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-900/10 dark:focus:ring-stone-100/20 text-stone-800 dark:text-stone-100 placeholder:text-stone-400 w-44"
            />
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-3">
            <span>{error}</span>
            <button
              onClick={loadTasks}
              className="underline font-semibold hover:text-amber-950 dark:hover:text-amber-100 shrink-0 cursor-pointer"
            >
              {t('retry')}
            </button>
          </div>
        )}

        {/* Tasks Table / List */}
        <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-[28px] border border-white/70 dark:border-stone-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-stone-500 dark:text-stone-400 animate-pulse">
              {t('loadingTasks')}
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
              <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
                {t('noTasksFound')}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {user
                  ? (language === 'ar'
                      ? 'أنشئ أول مهمة لك أو قم بتغيير معايير التصفية'
                      : 'Create your first task or change your filter criteria')
                  : (language === 'ar'
                      ? 'سجل الدخول لمزامنة مهامك'
                      : 'Sign in to sync your tasks')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right text-xs">
                <thead>
                  <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/70 text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-6">{t('status')}</th>
                    <th className="py-3.5 px-6">{t('taskTitleDescription')}</th>
                    <th className="py-3.5 px-6">{t('priority')}</th>
                    <th className="py-3.5 px-6">{t('dueDate')}</th>
                    <th className="py-3.5 px-6">{t('created')}</th>
                    <th className="py-3.5 px-6 text-right rtl:text-left">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {tasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-stone-50/70 dark:hover:bg-stone-800/50 transition-colors group"
                    >
                      {/* Status Icon */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(task)}
                          className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                          title="Click to change status"
                        >
                          {getStatusIcon(task.status)}
                        </button>
                      </td>

                      {/* Title & Description */}
                      <td className="py-4 px-6 max-w-sm">
                        <p
                          className={`font-bold text-stone-900 dark:text-stone-100 ${
                            task.status === 'completed'
                              ? 'line-through text-stone-400 dark:text-stone-500'
                              : ''
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                            {task.description}
                          </p>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {getPriorityBadge(task.priority)}
                      </td>

                      {/* Due Date */}
                      <td className="py-4 px-6 whitespace-nowrap text-stone-700 dark:text-stone-300 font-medium">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString(
                              language === 'ar' ? 'ar-EG' : 'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )
                          : '—'}
                      </td>

                      {/* Created At */}
                      <td className="py-4 px-6 whitespace-nowrap text-stone-400 dark:text-stone-500">
                        {new Date(task.createdAt).toLocaleDateString(
                          language === 'ar' ? 'ar-EG' : 'en-US'
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 whitespace-nowrap text-right rtl:text-left">
                        <div className="flex items-center justify-end rtl:justify-start gap-2">
                          <button
                            onClick={() => {
                              setEditingTask(task);
                              setIsTaskModalOpen(true);
                            }}
                            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
                            title={t('editTask')}
                          >
                            <PencilIcon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                            title={t('delete')}
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleSaveTask}
        editingTask={editingTask}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        isAdminOnly={false}
        onClose={() => {
          setIsAuthModalOpen(false);
          loadTasks();
        }}
      />
    </div>
  );
}
