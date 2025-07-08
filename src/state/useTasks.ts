import { useState, useEffect, useCallback } from 'react';
import fetcher from '@/src/utils/fetcher';
import { TodoApiResponse } from '@/src/types/task';
import { ApiRoute } from '@/src/utils/ApiRoute';
import { useTaskQuery } from '@/src/state/TaskQueryContext';

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
  const { invalidateAll, subscribe } = useTaskQuery();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = params.toString();
      const url = qs ? `${ApiRoute.TODOS}?${qs}` : ApiRoute.TODOS;
      const data = await fetcher<TodoApiResponse[]>(url, { method: 'GET' });
      const filtered = showDone ? data : data.filter(t => !t.completedAt);
      setTasks(filtered);
    } catch (err: any) {
      setTasks([]);
      setError(err.message || 'Fehler beim Laden der Aufgaben');
    } finally {
      setLoading(false);
    }
  }, [params.toString(), showDone]);

  // Subscription: bei Invalidierung neu laden
  useEffect(() => {
    const unsubscribe = subscribe(() => { void load(); });
    return unsubscribe;
  }, [load, subscribe]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateTask = useCallback(async (task: TodoApiResponse) => {
    await fetcher(`${ApiRoute.TODOS}/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    invalidateAll();
  }, [invalidateAll]);

  const deleteTask = useCallback(async (id: string) => {
    await fetcher(`${ApiRoute.TODOS}/${id}`, { method: 'DELETE' });
    invalidateAll();
  }, [invalidateAll]);

  return { tasks, loading, error, refetch: load, updateTask, deleteTask };
}
