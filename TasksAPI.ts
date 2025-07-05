import { toast } from "sonner";
import { TodoApiCreate, TodoApiEdit, TodoApiResponse } from "./types/task";
import { ApiRoute } from "./ApiRoute";

export const createTodoApi = async (data: TodoApiCreate) => {
    console.log(JSON.stringify(data))
    const response = await fetch(ApiRoute.TODOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });
    if (!response.ok) throw new Error("Fehler beim Erstellen");
    return (await response.json()) as TodoApiResponse;
};

export const loadTodosApi = async (apiRoute: ApiRoute, callback?: (data: TodoApiResponse[]) => void, catchRun?: () => void, finallyRun?: () => void, searchParams?: URLSearchParams) => {
    try {
        const queryString = searchParams?.toString() ?? '';
        const url = queryString
            ? `${apiRoute}?${queryString}`
            : apiRoute;
        const response = await fetch(url, { credentials: "include" });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: TodoApiResponse[] = await response.json();
        if (callback) callback(data);
        return data;
    } catch (error) {
        if (catchRun) catchRun();
        toast.error("Fehler beim Laden der Aufgaben", {
            description: error instanceof Error ? error.message : "Unbekannter Fehler",
        });
    } finally {
        if (finallyRun) finallyRun();
    }
}

export const updateTodoApi = async (data: TodoApiEdit) => {
    const response = await fetch(`${ApiRoute.TODOS}/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });
    if (!response.ok) throw new Error("Fehler beim Aktualisieren");
    return (await response.json()) as TodoApiResponse;
};

export const deleteTodoApi = async (taskId: number) => {
    try {
        const response = await fetch(`${ApiRoute.TODOS}/${taskId}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (!response.ok) throw new Error("Fehler beim Löschen im Backend.");
    } catch (error) {
        toast.error("Fehler beim Löschen der Aufgabe", {
            duration: 3000,
            description: error instanceof Error ? error.message : "Unbekannter Fehler",
        });
    }
};