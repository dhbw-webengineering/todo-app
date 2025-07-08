import { useState, useEffect, useCallback } from 'react';
import fetcher from '@/utils/fetcher';
import { TodoApiResponse } from '@/types/task';
import { ApiRoute } from '@/ApiRoute';

export interface UseTasksResult {
  tasks: TodoApiResponse[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateTask: (task: TodoApiResponse) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export function useTasks(
  params: URLSearchParams,
  showDone: boolean
): UseTasksResult {
  const [tasks, setTasks] = useState<TodoApiResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = params.toString();
      const url = qs ? `${ApiRoute.TODOS}?${qs}` : ApiRoute.TODOS;
      const data = await fetcher<TodoApiResponse[]>(url, { method: 'GET' });
      setTasks(showDone ? data : data.filter((t) => !t.completedAt));
    } catch (err: any) {
      setTasks([]);
      setError(err.message || 'Fehler beim Laden der Aufgaben');
    } finally {
      setLoading(false);
    }
  }, [params.toString(), showDone]);

  const updateTask = useCallback(
    async (task: TodoApiResponse) => {
      await fetcher(`${ApiRoute.TODOS}/${task.id}`, {
        method: 'PATCH',
        body: JSON.stringify(task),
      });
      await load();
    },
    [load]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await fetcher(`${ApiRoute.TODOS}/${id}`, { method: 'DELETE' });
      await load();
    },
    [load]
  );

  useEffect(() => {
    void load();
  }, [load]);

  return { tasks, loading, error, refetch: load, updateTask, deleteTask };
}