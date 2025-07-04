import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { API_ROUTES } from '@/lib/constants';

export interface Tag {
    id: number;
    name: string;
}

export const useTags = () => {
    return useQuery({
        queryKey: ['tags'],
        queryFn: () => fetcher<Tag[]>(API_ROUTES.TAGS),
    });
};
