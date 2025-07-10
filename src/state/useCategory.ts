import { useCallback } from "react";
import { useCategoryContext } from "./CategoryContext";
import fetcher from "../utils/fetcher";
import { ApiRoute } from "../utils/ApiRoute";
import { Category } from "../types/category";
import { useTaskQuery } from '@/src/state/TaskQueryContext';


export const useCategory = () => {
  const { categories, loading, error, refresh } = useCategoryContext();
  const { invalidateAll } = useTaskQuery()

  const addCategory = useCallback(
    async (name: string): Promise<Category> => {
      console.log("Adding category:", name);
      const newCat = await fetcher<Category>(ApiRoute.CATEGORY, {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      await refresh();
      return newCat;
    },
    [refresh]
  );

  const editCategory = useCallback(
    async (id: string, name: string): Promise<Category> => {
      const updated = await fetcher<Category>(`${ApiRoute.CATEGORY}/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      await refresh();
      invalidateAll();
      return updated;
    },
    [refresh, invalidateAll]
  );

  const removeCategory = useCallback(
    async (id: string): Promise<void> => {
      await fetcher(`${ApiRoute.CATEGORY}/${id}`, {
        method: "DELETE",
      });
      await refresh();
    },
    [refresh]
  );

  return {
    categories,
    loading,
    error,
    addCategory,
    editCategory,
    removeCategory,
  };
};
