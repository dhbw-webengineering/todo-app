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
import { useAuth } from "./AuthContext"; // <--- wichtig!

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

    const { user, loading: authLoading } = useAuth(); // <--- Auth-Status abfragen

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await fetcher<Category[]>(ApiRoute.CATEGORY);
            setCategories(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Lade nur, wenn Auth-Status fertig und User eingeloggt
        if (!authLoading && user) {
            void loadCategories();
        }
    }, [authLoading, user]);

    const refresh = async () => {
        if (!authLoading && user) {
            await loadCategories();
        }
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
