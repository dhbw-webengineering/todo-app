'use client';

import React, { forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import { useSearchParams } from 'next/navigation';
import { TaskCard } from './TaskCard';
import { useTasks, UseTasksResult } from '@/src/state/useTasks';
import { TodoApiResponse } from '@/src/types/task';
import { toast } from 'sonner';

export type TasksContainerRef = {
  updateTask: (task: TodoApiResponse) => void;
  deleteTask: (task: TodoApiResponse) => void;
};

interface TasksContainerProps {
  range?: [number, number];
  setHasData?: (hasData: boolean) => void;
  showTasksDone: boolean;
  sendTaskUpdate?: (task: TodoApiResponse) => void;
  sendTaskDelete?: (task: TodoApiResponse) => void;
  onTagsChanged?: () => void;
}

function TasksContainer(
  { range, setHasData, showTasksDone, sendTaskUpdate, sendTaskDelete, onTagsChanged }: TasksContainerProps,
  ref: Ref<TasksContainerRef | null>
) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  if (range) {
    const [from, to] = range;
    const start = new Date();
    start.setDate(start.getDate() + from);
    const end = new Date();
    end.setDate(end.getDate() + to);
    params.set('from', start.toISOString());
    params.set('to', end.toISOString());
  }

  const { tasks, loading, error, refetch, updateTask: updateHook }: UseTasksResult =
    useTasks(params, showTasksDone);

  useImperativeHandle(ref, () => ({
    updateTask: handleUpdate,
    deleteTask: handleDelete,
  }));

  useEffect(() => {
    setHasData?.(tasks.length > 0);
  }, [tasks, setHasData]);

  const handleUpdate = async (task: TodoApiResponse) => {
    try {
      await updateHook(task);
      sendTaskUpdate?.(task);
      toast.success('Task aktualisiert');
    } catch {
      toast.error('Update fehlgeschlagen');
    }
  };

  const handleDelete = async (task: TodoApiResponse) => {
    try {
      if (sendTaskDelete) sendTaskDelete(task);
      else await refetch();
      onTagsChanged?.();
      toast.success('Task gelöscht');
    } catch {
      toast.error('Löschen fehlgeschlagen');
    }
  };

  if (loading) return <div className="text-center py-4">Lade...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  if (tasks.length === 0) {
    return <div className="text-center py-4">Keine Aufgaben gefunden</div>;
  }

  return (
    <div className="space-y-4">
      {tasks
        .sort((a, b) => {
          const ac = !!a.completedAt, bc = !!b.completedAt;
          if (ac !== bc) return ac ? 1 : -1;
          if (!a.dueDate || !b.dueDate) return a.dueDate ? -1 : b.dueDate ? 1 : 0;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        })
        .map(task => (
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
