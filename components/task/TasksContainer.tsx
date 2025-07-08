'use client';

import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  Ref,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { TaskCard } from './TaskCard';
import { useTasks, UseTasksResult } from '@/hooks/useTasks';
import { TodoApiResponse } from '@/types/task';
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
  {
    range,
    setHasData,
    showTasksDone,
    sendTaskUpdate,
    sendTaskDelete,
    onTagsChanged,
  }: TasksContainerProps,
  ref: Ref<TasksContainerRef | null>
) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  if (range) {
    const [fromOffset, toOffset] = range;
    const from = new Date();
    from.setDate(from.getDate() + fromOffset);
    const to = new Date();
    to.setDate(to.getDate() + toOffset);
    params.set('from', from.toISOString());
    params.set('to', to.toISOString());
  }

  const { tasks, loading, error, refetch, updateTask: updateTaskHook }: UseTasksResult =
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
      await updateTaskHook(task);
      sendTaskUpdate?.(task);
      toast.success('Task erfolgreich aktualisiert');
    } catch (error) {
      toast.error('Fehler beim Aktualisieren der Aufgabe');
      console.error(error);
    }
  };

  const handleDelete = async (task: TodoApiResponse) => {
    try {
      if (sendTaskDelete) {
        sendTaskDelete(task);
      } else {
        await refetch();
      }
      onTagsChanged?.();
      toast.success('Task erfolgreich gelöscht');
    } catch (error) {
      toast.error('Fehler beim Löschen der Aufgabe');
      console.error(error);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if ((a.completedAt === null) !== (b.completedAt === null)) {
      return a.completedAt ? 1 : -1;
    }
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  if (loading) {
    return <div className="text-center py-4">Loading tasks...</div>;
  }
  
  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdate={handleUpdate}
          onDelete={() => handleDelete(task)}
          onTagsChanged={onTagsChanged}
        />
      ))}
    </div>
  );
}

export default forwardRef(TasksContainer);
