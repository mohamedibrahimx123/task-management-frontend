'use client';

import React, { useState, useEffect } from 'react';
import { CreateTaskInput, Task, TaskPriority, TaskStatus } from '@/lib/types';
import { useThemeLang } from '@/context/ThemeLanguageContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTaskInput) => Promise<boolean>;
  editingTask?: Task | null;
  defaultTitle?: string;
  defaultDescription?: string;
}

export function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  editingTask,
  defaultTitle = '',
  defaultDescription = '',
}: TaskModalProps) {
  const { t, language } = useThemeLang();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority || 'medium');
      setStatus(editingTask.status || 'pending');
      setDueDate(
        editingTask.dueDate ? editingTask.dueDate.substring(0, 10) : ''
      );
    } else {
      setTitle(defaultTitle);
      setDescription(defaultDescription);
      setPriority('medium');
      setStatus('pending');
      setDueDate(new Date().toISOString().substring(0, 10));
    }
    setError(null);
  }, [editingTask, defaultTitle, defaultDescription, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(language === 'ar' ? 'عنوان المهمة مطلوب' : 'Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    const success = await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    });

    setLoading(false);
    if (success) {
      onClose();
    } else {
      setError(language === 'ar' ? 'فشل حفظ المهمة. تأكد من تسجيل الدخول.' : 'Failed to save task. Please ensure you are logged in.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-100 flex flex-col gap-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            {editingTask ? t('editTask') : t('createTask')}
          </h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('title')} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: مراجعة التصميم والألوان' : 'e.g. Design Review & Alignment'}
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900/10 text-stone-900 text-sm placeholder:text-stone-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('description')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={language === 'ar' ? 'أضف تفاصيل المهمة أو متطلباتها...' : 'Provide context, deliverables, or checklist...'}
              rows={3}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900/10 text-stone-900 text-sm placeholder:text-stone-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('priority')}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900/10 text-stone-900 text-xs font-medium"
              >
                <option value="low">{t('lowPriority')}</option>
                <option value="medium">{t('mediumPriority')}</option>
                <option value="high">{t('highPriority')} (🔥)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('status')}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900/10 text-stone-900 text-xs font-medium"
              >
                <option value="pending">{t('todo')}</option>
                <option value="in_progress">{t('inProgress')}</option>
                <option value="completed">{t('completed')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('dueDate')}
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900/10 text-stone-900 text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md"
            >
              {loading ? t('saving') : editingTask ? t('save') : t('createTask')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
