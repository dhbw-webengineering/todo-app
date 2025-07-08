import { useState, useEffect, useCallback } from 'react';
import fetcher from '@/utils/fetcher';
import { TodoApiResponse } from '@/types/task';
import { ApiRoute } from 'ApiRoute';

export interface UseTasksResult {
  tasks: TodoApiResponse[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
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
      const url = qs
        ? `${ApiRoute.TODOS}?${qs}`
        : ApiRoute.TODOS;
      const data = await fetcher<TodoApiResponse[]>(url, { method: 'GET' });
      setTasks(showDone ? data : data.filter(t => !t.completedAt));
    } catch (err: any) {
      setTasks([]);
      setError(err.message || 'Fehler beim Laden der Aufgaben');
    } finally {
      setLoading(false);
    }
  }, [params.toString(), showDone]);

  useEffect(() => {
    void load();
  }, [load]);

  return { tasks, loading, error, refetch: load };
}
