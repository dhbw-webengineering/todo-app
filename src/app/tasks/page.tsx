'use client';

import React, { useState } from 'react';
import { FilterBar } from '@/src/components/task/FilterBar';
import TasksContainer from '@/src/components/task/TasksContainer';
import { Switch } from '@/src/components/ui/switch';
import { Label } from '@/src/components/ui/label';

export default function TasksPage() {
  const [showCompleted, setShowCompleted] = useState(true);

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
