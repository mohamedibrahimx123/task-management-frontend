'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { LeftColumn } from '@/components/LeftColumn';
import { TaskStream } from '@/components/TaskStream';
import { RightColumn } from '@/components/RightColumn';
import { TaskModal } from '@/components/TaskModal';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { CreateTaskInput, Task } from '@/lib/types';

// Fallback initial tasks matching the Lisso design
const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    title: 'Weekly Strategy Sync',
    description: 'Marketing & Growth team sync and roadmap planning',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Design Review',
    description: 'Check the design of the main page and mobile layout',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-03-22T10:00:00.000Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'VinteX Team Sync',
    description: 'Head of Sales & AI strategy alignment',
    status: 'completed',
    priority: 'low',
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultTaskTitle, setDefaultTaskTitle] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load real tasks from backend API
  const loadTasks = useCallback(async () => {
    if (!user) {
      setTasks(DEFAULT_TASKS);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.tasks.getAll({ limit: 50, sortBy: 'createdAt', sortOrder: 'desc' });
      if (res.success && res.data) {
        setTasks(res.data.length > 0 ? res.data : DEFAULT_TASKS);
      } else {
        setError(res.message || 'Failed to fetch tasks.');
      }
    } catch {
      setError('Could not connect to backend server.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Handle Create or Update
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

  // Handle Delete
  const handleDeleteTask = async (id: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (confirm('Are you sure you want to delete this task?')) {
      const res = await api.tasks.delete(id);
      if (res.success) {
        await loadTasks();
      } else {
        alert(res.message || 'Failed to delete task.');
      }
    }
  };

  // Cycle Status: pending -> in_progress -> completed -> pending
  const handleToggleStatus = async (task: Task) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const nextStatusMap: Record<string, 'pending' | 'in_progress' | 'completed'> = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'pending',
    };
    const nextStatus = nextStatusMap[task.status] || 'pending';

    const res = await api.tasks.update(task.id, { status: nextStatus });
    if (res.success) {
      await loadTasks();
    } else {
      alert(res.message || 'Failed to update task status.');
    }
  };

  const handleOpenCreateTask = (title = '') => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setEditingTask(null);
    setDefaultTaskTitle(title);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const displayName = user?.name ? user.name.split(' ')[0] : 'Marco';

  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* 1. Header */}
      <Header onOpenAuth={() => setIsAuthModalOpen(true)} />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-6 flex flex-col gap-6">
        {/* 2. Top Greeting Row (Authentic Lisso Design) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
          {/* Left: User Avatar + Greeting */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full ring-2 ring-stone-900/10 overflow-hidden bg-gradient-to-tr from-amber-400 to-rose-400 p-0.5 shadow-sm">
              <div className="w-full h-full rounded-full bg-stone-900 text-amber-200 font-bold flex items-center justify-center text-base">
                {displayName.charAt(0)}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight font-sans">
                Hi, {displayName}!
              </h1>
            </div>
          </div>

          {/* Center: Page Title */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-stone-800 tracking-tight">
              Today&apos;s Tasks
            </h2>
          </div>

          {/* Right: Team Stack (Authentic Lisso Design) */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs font-semibold text-stone-500">Team:</span>
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-7 w-7 rounded-full ring-2 ring-[#F4EFEA] bg-rose-400 text-white font-bold text-xs flex items-center justify-center">
                S
              </div>
              <div className="inline-block h-7 w-7 rounded-full ring-2 ring-[#F4EFEA] bg-amber-400 text-stone-900 font-bold text-xs flex items-center justify-center">
                A
              </div>
              <div className="inline-block h-7 w-7 rounded-full ring-2 ring-[#F4EFEA] bg-sky-400 text-white font-bold text-xs flex items-center justify-center">
                R
              </div>
              <div className="inline-block h-7 w-7 rounded-full ring-2 ring-[#F4EFEA] bg-stone-900 text-stone-200 font-bold text-[10px] flex items-center justify-center">
                +9
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bento 3-Column Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Column */}
          <LeftColumn
            tasks={tasks}
            onOpenCreateTask={() => handleOpenCreateTask()}
          />

          {/* Center Column: Live Task Stream */}
          <TaskStream
            tasks={tasks}
            loading={loading}
            error={error}
            onRefresh={loadTasks}
            onOpenCreateTask={() => handleOpenCreateTask()}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleStatus={handleToggleStatus}
          />

          {/* Right Column */}
          <RightColumn onOpenCreateTask={handleOpenCreateTask} />
        </div>
      </main>

      {/* Task Modal (Create & Edit) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleSaveTask}
        editingTask={editingTask}
        defaultTitle={defaultTaskTitle}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          loadTasks();
        }}
      />
    </div>
  );
}
