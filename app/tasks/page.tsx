'use client';

import React from 'react';
import { FilterBar } from '@/components/task/FilterBar';
import TasksContainer from '@/components/task/TasksContainer';

export default function TasksPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      <FilterBar />
      <div className="space-y-4 max-w-3xl">
        <TasksContainer
          showTasksDone={true}
        />
      </div>
    </div>
  );
}
