import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { API_ROUTES } from '@/lib/constants';
import { TodoApiCreate, TodoApiResponse } from '@/types/task';
import { toast } from 'sonner';

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TodoApiCreate) => 
      fetcher<TodoApiResponse>(API_ROUTES.TODOS, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Aufgabe erfolgreich erstellt!');
    },
    onError: (error) => {
      toast.error('Fehler beim Erstellen der Aufgabe');
      console.error('Create task error:', error);
    },
  });
};
