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

export type TasksContainerRef = {
  updateTask: (task: TodoApiResponse) => void;
  deleteTask: (task: TodoApiResponse) => void;
};

interface TasksContainerProps {
  /**
   * Optionaler Datumsbereich in Tagen: [von heute + offsetStart, heute + offsetEnd]
   */
  range?: [number, number];
  /**
   * Callback, um dem Parent mitzuteilen, ob Tasks verfügbar sind
   */
  setHasData?: (hasData: boolean) => void;
  /**
   * Flag, ob erledigte Tasks angezeigt werden sollen
   */
  showTasksDone: boolean;
  /**
   * Optionaler Callback, wenn ein Task upgedated wird
   */
  sendTaskUpdate?: (task: TodoApiResponse) => void;
  /**
   * Optionaler Callback, wenn ein Task gelöscht wird
   */
  sendTaskDelete?: (task: TodoApiResponse) => void;
  /**
   * Callback, wenn Task-Tags geändert wurden
   */
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
  // 1. Query-Parameter aus URL lesen
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  // 2. Optionalen Datumsbereich anhängen
  if (range) {
    const [fromOffset, toOffset] = range;
    const from = new Date();
    from.setDate(from.getDate() + fromOffset);
    const to = new Date();
    to.setDate(to.getDate() + toOffset);
    params.set('from', from.toISOString());
    params.set('to', to.toISOString());
  }

  // 3. Tasks laden via Hook (automatischer Refetch bei params & showTasksDone)
  const { tasks, loading, error, refetch }: UseTasksResult =
    useTasks(params, showTasksDone);

  // 4. Imperative Methoden für Parent
  useImperativeHandle(ref, () => ({
    updateTask: (task: TodoApiResponse) => handleUpdate(task),
    deleteTask: (task: TodoApiResponse) => handleDelete(task),
  }));

  // 5. Parent über Datenverfügbarkeit informieren
  useEffect(() => {
    setHasData?.(tasks.length > 0);
  }, [tasks, setHasData]);

  // 6. Update- und Delete-Handler
  const handleUpdate = (task: TodoApiResponse) => {
    if (sendTaskUpdate) {
      sendTaskUpdate(task);
    } else {
      // Nach Update neu laden
      void refetch();
    }
  };

  const handleDelete = (task: TodoApiResponse) => {
    if (sendTaskDelete) {
      sendTaskDelete(task);
    } else {
      // Nach Delete neu laden
      void refetch();
    }
    onTagsChanged?.();
  };

  // 7. Rendern
  if (loading) {
    return <div className="text-center text-lg mt-12">Loading tasks...</div>;
  }
  if (error) {
    return (
      <div className="text-center text-lg mt-12 text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {tasks.map((task) => (
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