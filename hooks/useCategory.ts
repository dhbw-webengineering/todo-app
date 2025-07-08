// DEPRECATED: This file is deprecated and should not be used.
// Please use the useCategoriesContext hook from @/hooks/useCategoriesContext instead.
// The Category interface is now imported from @/types/category.

import { useCategoriesContext } from "@/hooks/useCategoriesContext";

// This function is kept for backward compatibility but will log a warning when used
export function useCategories() {
  console.warn(
    "useCategories is deprecated. Please use useCategoriesContext from @/hooks/useCategoriesContext instead."
  );
  return useCategoriesContext();
}

// Re-export Category from the types directory
export { Category } from "@/types/category";
