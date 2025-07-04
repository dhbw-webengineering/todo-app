import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { API_ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      fetcher<void>(API_ROUTES.CATEGORY_BY_ID(id), { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategorie erfolgreich gelöscht!');
    },
    onError: (error) => {
      toast.error('Fehler beim Löschen der Kategorie');
      console.error('Delete category error:', error);
    },
  });
};
