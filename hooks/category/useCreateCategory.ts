import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { API_ROUTES } from '@/lib/constants';
import { Category } from '@/types/category';
import { toast } from 'sonner';

interface CreateCategoryData {
  name: string;
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryData) =>
      fetcher<Category>(API_ROUTES.CATEGORIES, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategorie erfolgreich erstellt!');
    },
    onError: (error) => {
      toast.error('Fehler beim Erstellen der Kategorie');
      console.error('Create category error:', error);
    },
  });
};
