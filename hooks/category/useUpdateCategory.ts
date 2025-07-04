import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { API_ROUTES } from '@/lib/constants';
import { Category } from '@/types/category';
import { toast } from 'sonner';

interface UpdateCategoryData {
  id: number;
  name: string;
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: UpdateCategoryData) =>
      fetcher<Category>(API_ROUTES.CATEGORY_BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify({ name }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategorie erfolgreich aktualisiert!');
    },
    onError: (error) => {
      toast.error('Fehler beim Aktualisieren der Kategorie');
      console.error('Update category error:', error);
    },
  });
};
