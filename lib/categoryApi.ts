import { Category } from "@/types/category";

const API_URL = "http://localhost:3001";

// Fetch all categories for the current user
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/category`, {
    credentials: "include", // Include cookies for authentication
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}

// Create a new category
export async function createCategory(name: string): Promise<Category> {
  const response = await fetch(`${API_URL}/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for authentication
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Failed to create category");
  }

  return response.json();
}

// Update a category
export async function updateCategory(id: string, name: string): Promise<Category> {
  const response = await fetch(`${API_URL}/category/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for authentication
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Failed to update category");
  }

  return response.json();
}

// Delete a category
export async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/category/${id}`, {
    method: "DELETE",
    credentials: "include", // Include cookies for authentication
  });

  if (!response.ok) {
    throw new Error("Failed to delete category");
  }
}
