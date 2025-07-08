import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Category } from "@/types/category";
import { fetchCategories } from "@/lib/categoryApi";
import { toast } from "sonner";

// Define the shape of our context
interface CategoriesContextType {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetchCategories: () => Promise<void>;
}

// Create the context with a default value
const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

// Provider component that will wrap the app
export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoriesData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to load categories");
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories when the provider mounts
  useEffect(() => {
    fetchCategoriesData();
  }, []);

  // Function to manually refetch categories
  const refetchCategories = async () => {
    await fetchCategoriesData();
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        isLoading,
        error,
        refetchCategories,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

// Custom hook to use the categories context
export function useCategoriesContext() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error("useCategoriesContext must be used within a CategoriesProvider");
  }
  return context;
}