import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { API_ROUTES } from '@/lib/constants';
import { TodoApiResponse } from '@/types/task';

interface UseTasksOptions {
  filters?: {
    completed?: boolean;
    categoryId?: number;
    tags?: string[];
    search?: string;
  };
}

export const useTasks = (options?: UseTasksOptions) => {
  const { filters } = options || {};

  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (filters?.completed !== undefined) {
        searchParams.append('completed', filters.completed.toString());
      }
      if (filters?.categoryId) {
        searchParams.append('categoryId', filters.categoryId.toString());
      }
      if (filters?.tags?.length) {
        searchParams.append('tags', filters.tags.join(','));
      }
      if (filters?.search) {
        searchParams.append('search', filters.search);
      }

      const queryString = searchParams.toString();
      const endpoint = queryString ? 
        `${API_ROUTES.TODOS}?${queryString}` : 
        API_ROUTES.TODOS;

      return fetcher<TodoApiResponse[]>(endpoint);
    },
  });
};
