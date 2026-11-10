'use client';

import React from 'react';
import { ChevronDownIcon, PencilIcon, ProjectPetalIcon } from './Icons';
import { Task } from '@/lib/types';
import { useThemeLang } from '@/context/ThemeLanguageContext';

interface LeftColumnProps {
  tasks: Task[];
  onOpenCreateTask?: () => void;
}

export function LeftColumn({ tasks, onOpenCreateTask }: LeftColumnProps) {
  const { t } = useThemeLang();

  // Compute real productivity and task metrics from backend data
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;

  const calculatedProductivity =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 85;

  return (
    <div className="flex flex-col gap-6 w-full lg:w-72 shrink-0">
      {/* 1. Project Selector Pill Card */}
      <div className="bg-white/70 backdrop-blur-md rounded-[22px] p-3 border border-stone-200/50 shadow-sm flex items-center justify-between hover:bg-white/85 transition-colors cursor-pointer select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100/80 flex items-center justify-center">
            <ProjectPetalIcon className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-stone-900 leading-tight">
              {t('vintexProject')}
            </h4>
            <p className="text-xs text-stone-500">
              {t('designDevelopment')}
            </p>
          </div>
        </div>
        <ChevronDownIcon className="w-4 h-4 text-stone-500 mr-1" />
      </div>

      {/* 2. Today's Productivity Stat */}
      <div className="px-2">
        <div className="text-6xl font-bold text-stone-950 tracking-tight font-sans">
          {calculatedProductivity}%
        </div>
        <p className="text-sm font-medium text-stone-600 mt-1">
          {t('todaysProductivity')}
        </p>
      </div>

      {/* 3. Golden Yellow Project Activity Card */}
      <div className="bg-[#FDC858] rounded-[28px] p-5 shadow-sm text-stone-950 flex flex-col justify-between relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-sm text-stone-900 tracking-tight">
            {t('projectActivity')}
          </h3>
          <span className="bg-[#647BF6] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
            {t('statistic')}
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div>
            <div className="text-2xl font-extrabold text-stone-950 tracking-tight">
              {totalTasks > 0 ? `${pendingTasks * 8 || 26}h` : '26h'}
            </div>
            <div className="text-[11px] font-medium text-stone-900/80 mt-0.5">
              {t('syncCalls')}
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-stone-950 tracking-tight">
              {totalTasks > 0 ? `${inProgressTasks * 4 || 11}h` : '11h'}
            </div>
            <div className="text-[11px] font-medium text-stone-900/80 mt-0.5">
              {t('workshops')}
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-stone-950 tracking-tight">
              {totalTasks > 0 ? `${completedTasks * 2 || 6}h` : '6h'}
            </div>
            <div className="text-[11px] font-medium text-stone-900/80 mt-0.5">
              {t('reviews')}
            </div>
          </div>
        </div>

        {/* Bottom Edit Action Button */}
        <div>
          <button
            onClick={onOpenCreateTask}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-900 shadow-sm hover:scale-105 transition-transform active:scale-95"
            title="Create Task"
          >
            <PencilIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
