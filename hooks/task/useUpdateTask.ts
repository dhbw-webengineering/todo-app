import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { API_ROUTES } from '@/lib/constants';
import { TodoApiEdit, TodoApiResponse } from '@/types/task';
import { toast } from 'sonner';

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: TodoApiEdit) =>
      fetcher<TodoApiResponse>(API_ROUTES.TODO_BY_ID(id), {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Aufgabe erfolgreich aktualisiert!');
    },
    onError: (error) => {
      toast.error('Fehler beim Aktualisieren der Aufgabe');
      console.error('Update task error:', error);
    },
  });
};
