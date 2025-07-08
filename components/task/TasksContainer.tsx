'use client';

import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  Ref,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { TaskCard } from './TaskCard';
import { useTasks } from '@/hooks/useTasks';
import { TodoApiResponse } from '@/types/task';

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
  ref: Ref<TasksContainerRef>
) {
  // Query aus der URL
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

  const { tasks, loading, error } = useTasks(params, showTasksDone);

  useImperativeHandle(ref, () => ({
    updateTask: (task: TodoApiResponse) => handleUpdate(task),
    deleteTask: (task: TodoApiResponse) => handleDelete(task),
  }));

  useEffect(() => {
    setHasData?.(tasks.length > 0);
  }, [tasks, setHasData]);

  const handleUpdate = (task: TodoApiResponse) => {
    if (sendTaskUpdate) {
      sendTaskUpdate(task);
    }
  };

  const handleDelete = (task: TodoApiResponse) => {
    if (sendTaskDelete) {
      sendTaskDelete(task);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-lg mt-12">
        Loading tasks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-lg mt-12">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {tasks.map((task: TodoApiResponse) => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdate={() => handleUpdate(task)}
          onDelete={() => handleDelete(task)}
          onTagsChanged={onTagsChanged}
        />
      ))}
    </div>
  );
}

export default forwardRef(TasksContainer);