'use client';

import React from 'react';
import { ChevronRightIcon, PlusIcon } from './Icons';

interface RightColumnProps {
  onOpenCreateTask: (defaultTitle?: string) => void;
}

export function RightColumn({ onOpenCreateTask }: RightColumnProps) {
  const quickRequests = [
    'Analyze the call summary and highlight the main topic points',
    'Create a PDF document with completed tasks for the week',
    'Fix the Gantt chart according to the updated task data in project',
  ];

  return (
    <div className="flex flex-col gap-6 w-full lg:w-80 shrink-0">
      {/* 1. Quick requests Card (Authentic Lisso Design) */}
      <div className="bg-white/80 backdrop-blur-md rounded-[28px] p-5 border border-stone-200/50 shadow-sm flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xs font-bold">
              ✦
            </div>
            <h3 className="font-semibold text-sm text-stone-900 tracking-tight">
              Quick requests
            </h3>
          </div>
          <button
            onClick={() => onOpenCreateTask()}
            className="text-xs font-semibold text-stone-800 hover:text-stone-950 flex items-center gap-1 bg-stone-100/70 hover:bg-stone-200/70 px-2.5 py-1 rounded-full transition-colors"
          >
            <PlusIcon className="w-3 h-3" />
            <span>Set Task</span>
          </button>
        </div>

        {/* Requests List */}
        <div className="flex flex-col divide-y divide-stone-100">
          {quickRequests.map((req, idx) => (
            <div
              key={idx}
              onClick={() => onOpenCreateTask(req)}
              className="py-3 group flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50/80 -mx-2 px-2 rounded-xl transition-colors"
              title="Click to add as task"
            >
              <p className="text-xs font-medium text-stone-700 group-hover:text-stone-950 leading-relaxed">
                {req}
              </p>
              <div className="w-6 h-6 rounded-full bg-stone-100 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center text-stone-500 shrink-0 transition-colors">
                <ChevronRightIcon className="w-3 h-3 group-hover:text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Workspace Overview Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-[28px] p-5 border border-stone-200/50 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="bg-stone-900 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
            Workspace
          </span>
          <span className="text-[11px] font-semibold text-stone-500">
            Sprint 04
          </span>
        </div>

        <div className="space-y-3 my-2">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-stone-700">Sprint Progress</span>
              <span className="font-bold text-stone-900">72%</span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full w-[72%]" />
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-600 space-y-1">
            <p className="font-semibold text-stone-800">Team Active Goals:</p>
            <p className="text-[11px] text-stone-500">
              • VinteX Landing Page Redesign &bull; Q1 Review
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenCreateTask()}
          className="w-full text-center py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all shadow-sm"
        >
          + Add New Goal
        </button>
      </div>
    </div>
  );
}
