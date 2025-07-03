import useSWR from 'swr';
import type { Tag } from "@/types/tag";

export function useTags() {
  const { data, error, isValidating, mutate } = useSWR<Tag[]>('/tags');
  return {
    tags: (data || []).map(t => ({ id: t.id, name: t.name.trim() })),
    isLoading: !error && !data,
    isError: !!error,
    refetch: () => mutate(),
  };
}
