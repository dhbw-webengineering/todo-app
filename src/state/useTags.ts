import { useCallback, useEffect, useState } from "react";
import { ApiRoute } from "../utils/ApiRoute";

export interface Tag {
  id: number;
  name: string;
}

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTags = useCallback(() => {
    setLoading(true);
    fetch(ApiRoute.TAGS, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTags(data.map((t: Tag) => ({
            id: t.id,
            name: t.name.trim(),
          })));
        } else {
          setTags([]);
          console.error("Fehler beim Laden der Tags:", data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return { tags, loading, refetch: fetchTags };
}
