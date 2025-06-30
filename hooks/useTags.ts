import { useEffect, useState } from "react";

export interface Tag {
  id: number;
  name: string;
}

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/tags", 
        { credentials: "include" })
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

  return { tags, loading };
}
