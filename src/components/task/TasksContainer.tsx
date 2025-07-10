'use client';

import React, { forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import { useSearchParams } from 'next/navigation';
import { TaskCard } from './TaskCard';
import { useTaskQuery } from '@/src/state/TaskQueryContext';
import { useTasks, UseTasksResult } from '@/src/state/useTasks';
import { useTags } from '@/src/state/TagsContext';
import { TodoApiResponse } from '@/src/types/task';
import { toast } from 'sonner';
import { ApiRoute } from '@/src/utils/ApiRoute';

export type TasksContainerRef = {
  updateTask: (task: TodoApiResponse) => void;
  deleteTask: (task: TodoApiResponse) => void;
};

interface TasksContainerProps {
  apiRoute?: string;
  range?: [number, number];
  setHasData?: (hasData: boolean) => void;
  showTasksDone: boolean;
  sendTaskUpdate?: (task: TodoApiResponse) => void;
  sendTaskDelete?: (task: TodoApiResponse) => void;
}

function TasksContainer(
  {
    apiRoute = ApiRoute.TODOS,
    range,
    setHasData,
    showTasksDone,
    sendTaskUpdate,
    sendTaskDelete,
  }: TasksContainerProps,
  ref: Ref<TasksContainerRef | null>
) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  // Optionalen Datumsbereich als Query-Parameter hinzufügen
  if (range) {
    const [from, to] = range;
    const start = new Date();
    start.setDate(start.getDate() + from);
    const end = new Date();
    end.setDate(end.getDate() + to);
    params.set('from', start.toISOString());
    params.set('to', end.toISOString());
  }

  // 1. Task-Hooks: Lade Tasks und Operationen
  const {
    tasks,
    loading,
    error,
    updateTask: updateHook,
    deleteTask: deleteHook,
  }: UseTasksResult = useTasks(apiRoute, params, showTasksDone);

  const { invalidateAll } = useTaskQuery();
  const { refetch: refetchTags } = useTags();

  useImperativeHandle(ref, () => ({
    updateTask: handleUpdate,
    deleteTask: handleDelete,
  }));

  useEffect(() => {
    setHasData?.(tasks.length > 0);
  }, [tasks, setHasData]);

  async function handleUpdate(task: TodoApiResponse) {
    try {
      await updateHook(task);
      sendTaskUpdate?.(task);
      toast.success('Task aktualisiert');
      invalidateAll(); 
      await refetchTags();
    } catch {
      toast.error('Update fehlgeschlagen');
    }
  }

  async function handleDelete(task: TodoApiResponse) {
    try {
      await deleteHook(String(task.id));
      sendTaskDelete?.(task);
      toast.success('Task gelöscht');
      invalidateAll();    
      await refetchTags();
    } catch {
      toast.error('Löschen fehlgeschlagen');
    }
  }

  if (loading) {
    return <div className="text-center py-4">Lade...</div>;
  }
  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }
  if (tasks.length === 0) {
    return <div className="text-center py-4">Keine Aufgaben gefunden</div>;
  }

  return (
    <div className="space-y-4">
      {tasks
        .sort((a, b) => {
          const ac = Boolean(a.completedAt);
          const bc = Boolean(b.completedAt);
          if (ac !== bc) return ac ? 1 : -1;
          if (!a.dueDate || !b.dueDate)
            return a.dueDate ? -1 : b.dueDate ? 1 : 0;
          return (
            new Date(a.dueDate).getTime() -
            new Date(b.dueDate).getTime()
          );
        })
        .map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={handleUpdate}
            onDelete={() => handleDelete(task)}
          />
        ))}
    </div>
  );
}

export default forwardRef(TasksContainer);
