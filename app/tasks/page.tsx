'use client';

import React, { useState } from 'react';
import { FilterBar } from '@/components/task/FilterBar';
import TasksContainer from '@/components/task/TasksContainer';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function TasksPage() {
  const [showCompleted, setShowCompleted] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Alle Tasks</h1>
      </div>
      <FilterBar />
      <div className="flex items-center space-x-2">
        <Switch
          id="show-completed"
          checked={showCompleted}
          onCheckedChange={setShowCompleted}
        />
        <Label htmlFor="show-completed">Abgeschlossene Tasks anzeigen</Label>
      </div>
      <TasksContainer showTasksDone={showCompleted} />
    </div>
  );
}
