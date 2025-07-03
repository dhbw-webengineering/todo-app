import useSWR from 'swr';
import type { TodoApiResponse } from '@/types/task';

export function useTasks() {
  // useSWR lädt beim ersten Mount die Daten und cached sie
  const { data, error, isValidating, mutate } = useSWR<TodoApiResponse[]>('/todos');

  return {
    tasks: data || [],                   // immer ein Array zurückliefern
    isLoading: !error && !data,          // true, solange erste Antwort fehlt
    isError: !!error,                    // true, wenn fetch fehlschlägt
    refetch: () => mutate(),             // manuelles Nachladen möglich
  };
}
