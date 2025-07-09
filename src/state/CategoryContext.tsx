import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import fetcher from "../utils/fetcher";
import { ApiRoute } from "../utils/ApiRoute";
import { Category } from "../types/category";



interface CategoryContextValue {
    categories: Category[];
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextValue | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await fetcher<Category[]>(ApiRoute.CATEGORY);
            setCategories(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const refresh = async () => {
        await loadCategories();
    };

    return (
        <CategoryContext.Provider
            value={{ categories, loading, error, refresh }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategoryContext = (): CategoryContextValue => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error("useCategoryContext must be used within a CategoryProvider");
    }
    return context;
};
