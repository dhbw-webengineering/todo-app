'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import TasksContainer from './TasksContainer';

export default function OverviewTasks() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <TasksContainer showTasksDone={false} />
    </div>
  );
}