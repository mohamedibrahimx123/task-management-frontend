'use client';

import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/lib/types';
import {
  CheckCircleIcon,
  CircleIcon,
  ClockIcon,
  FlameIcon,
  PhoneIcon,
  PlusIcon,
  TaskListIcon,
  TrashIcon,
  PencilIcon,
} from './Icons';

interface TaskStreamProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onOpenCreateTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleStatus: (task: Task) => void;
}

export function TaskStream({
  tasks,
  loading,
  error,
  onRefresh,
  onOpenCreateTask,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
}: TaskStreamProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks locally by status and search
  const filteredTasks = tasks.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (
      searchQuery &&
      !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(t.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="bg-[#F87154] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <FlameIcon className="w-3 h-3 text-white" />
            <span>High Priority</span>
          </span>
        );
      case 'medium':
        return (
          <span className="bg-amber-100 text-amber-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            Medium Priority
          </span>
        );
      case 'low':
        return (
          <span className="bg-stone-200 text-stone-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            Low Priority
          </span>
        );
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="bg-amber-100 text-amber-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            In Progress
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="bg-stone-100 text-stone-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            To Do
          </span>
        );
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-emerald-600" />;
      case 'in_progress':
        return <ClockIcon className="w-5 h-5 text-amber-500" />;
      case 'pending':
      default:
        return <CircleIcon className="w-5 h-5 text-stone-400 hover:text-stone-700" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-5 min-w-0">
      {/* Controls: Filter Pills & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/60 backdrop-blur-md rounded-2xl p-2.5 border border-stone-200/40">
        <div className="flex items-center gap-1 bg-stone-100/80 rounded-xl p-1 text-xs font-semibold text-stone-600">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'pending', label: 'To Do' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterStatus === tab.id
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Add */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="px-3 py-1 text-xs rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900/10 text-stone-800 placeholder:text-stone-400 w-36 sm:w-48"
          />
          <button
            onClick={onOpenCreateTask}
            className="flex items-center gap-1 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white transition-all shadow-sm"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            onClick={onRefresh}
            className="underline font-semibold hover:text-amber-950 shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white/60 rounded-[28px] p-6 border border-white/80 animate-pulse h-36"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTasks.length === 0 && (
        <div className="bg-white/80 backdrop-blur-md rounded-[28px] p-10 text-center border border-stone-200/50 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <TaskListIcon className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-stone-900">
            No tasks found
          </h4>
          <p className="text-xs text-stone-500 max-w-xs">
            {searchQuery
              ? 'No tasks match your search filter'
              : 'You have no tasks in this view. Click Add to create one!'}
          </p>
          <button
            onClick={onOpenCreateTask}
            className="mt-2 text-xs font-semibold px-5 py-2 rounded-full bg-stone-900 text-white shadow-sm hover:bg-stone-800 transition-all"
          >
            + Create Task
          </button>
        </div>
      )}

      {/* Task Cards Stream (Styled identically to Lisso screenshot) */}
      <div className="flex flex-col gap-4">
        {filteredTasks.map((task, index) => {
          const isMeeting =
            task.title.toLowerCase().includes('sync') ||
            task.title.toLowerCase().includes('meet') ||
            index === 0;

          const dateDisplay = task.dueDate
            ? new Date(task.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : isMeeting
            ? 'Today, 10:00 AM'
            : 'Mar 22';

          return (
            <div
              key={task.id}
              className="bg-white/90 backdrop-blur-md rounded-[28px] p-6 border border-white/70 shadow-[0_10px_30px_rgba(40,30,20,0.03)] hover:shadow-[0_14px_36px_rgba(40,30,20,0.06)] transition-all flex flex-col justify-between gap-4 group"
            >
              {/* Card Header: Icon + Title + Badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleStatus(task)}
                    className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    title={`Status: ${task.status}. Click to cycle.`}
                  >
                    {getStatusIcon(task.status)}
                  </button>

                  <div className="flex items-center gap-2">
                    {isMeeting ? (
                      <PhoneIcon className="w-4 h-4 text-stone-800" />
                    ) : (
                      <TaskListIcon className="w-4 h-4 text-stone-800" />
                    )}
                    <h3
                      className={`text-base font-bold text-stone-900 tracking-tight ${
                        task.status === 'completed'
                          ? 'line-through text-stone-400'
                          : ''
                      }`}
                    >
                      {task.title}
                    </h3>
                  </div>
                </div>

                {/* Priority & Status Badges */}
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {getPriorityBadge(task.priority)}

                  {isMeeting ? (
                    <span className="bg-[#50BFA5] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                      Meeting
                    </span>
                  ) : (
                    <span className="bg-[#FDBA74] text-stone-900 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                      Task
                    </span>
                  )}
                </div>
              </div>

              {/* Card Metadata Grid (Topic / Description / Deadline) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-t border-stone-100 pt-3">
                <div>
                  <span className="text-stone-400 font-medium block">
                    {isMeeting ? 'When:' : 'Topic:'}
                  </span>
                  <span className="text-stone-800 font-semibold block mt-0.5 truncate">
                    {isMeeting ? dateDisplay : 'VinteX Website'}
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 font-medium block">
                    {isMeeting ? 'Team:' : 'Description:'}
                  </span>
                  <span className="text-stone-800 font-medium block mt-0.5 truncate">
                    {task.description || (isMeeting ? 'Marketing & Growth' : 'Check the design of the main page')}
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 font-medium block">
                    {isMeeting ? 'Reminder:' : 'Deadline:'}
                  </span>
                  <span className="text-stone-800 font-semibold block mt-0.5">
                    {isMeeting ? '15 min' : dateDisplay}
                  </span>
                </div>
              </div>

              {/* Card Footer: Performers Stack & Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                {/* Performers Stack */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-amber-400 text-stone-900 font-bold text-[10px] flex items-center justify-center">
                      M
                    </div>
                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-rose-400 text-white font-bold text-[10px] flex items-center justify-center">
                      E
                    </div>
                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-sky-400 text-white font-bold text-[10px] flex items-center justify-center">
                      K
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-stone-500">
                    {isMeeting ? '+7 Ready to join?' : 'Performers'}
                  </span>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Status Toggle pill button */}
                  <button
                    onClick={() => onToggleStatus(task)}
                    className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                  >
                    {getStatusBadge(task.status)}
                  </button>

                  <button
                    onClick={() => onEditTask(task)}
                    className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                    title="Edit Task"
                  >
                    <PencilIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 rounded-full hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors"
                    title="Delete Task"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
