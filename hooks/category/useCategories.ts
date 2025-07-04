import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { API_ROUTES } from '@/lib/constants';
import { Category } from '@/types/category';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => fetcher<Category[]>(API_ROUTES.CATEGORIES),
  });
};
