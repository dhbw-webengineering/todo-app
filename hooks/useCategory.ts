// hooks/useCategories.ts
import { useEffect, useState } from "react";

export interface Category {
  id: number;
  userId: number;
  name: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/category")
      .then((res) => res.json())
      .then((data) => setCategories(data.map((c: Category) => ({
        ...c,
        name: c.name.trim(),
      }))))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
