'use client';

import React from 'react';
import { FilterBar } from '@/components/task/FilterBar';
import TasksContainer from '@/components/task/TasksContainer';

export default function TasksPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Alle Tasks</h1>
      <FilterBar />
      <TasksContainer showTasksDone={true} />
    </main>
  );
}