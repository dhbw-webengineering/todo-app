import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function fetcher<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (response.status === 401) {
      window.location.href = '/auth/login';
      return Promise.reject('Unauthorized');
    }

    if (!response.ok) {
      const errorText = await response.text();
      toast.error(`API Fehler: ${response.statusText}`);
      throw new Error(`${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      toast.error(`Netzwerkfehler: ${error.message}`);
    }
    throw error;
  }
}
