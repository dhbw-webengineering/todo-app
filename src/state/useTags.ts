import { useCallback, useEffect, useState } from "react";
import { ApiRoute } from "../utils/ApiRoute";
import fetcher from "../utils/fetcher";

export interface Tag { id: number; name: string; }

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetcher<Tag[]>(ApiRoute.TAGS);
      if (Array.isArray(data)) {
        setTags(data.map((t: Tag) => ({ id: t.id, name: t.name.trim() })));
      } else {
        console.error("Fehler beim Laden der Tags:", data);
        setTags([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return { tags, loading, refetch: fetchTags };
}
