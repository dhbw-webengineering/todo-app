import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { API_ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      fetcher<void>(API_ROUTES.TODO_BY_ID(id), { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Aufgabe erfolgreich gelöscht!');
    },
    onError: (error) => {
      toast.error('Fehler beim Löschen der Aufgabe');
      console.error('Delete task error:', error);
    },
  });
};
