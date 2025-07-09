export interface TodoApiResponse {
  id: number;
  userId: number;
  title: string;
  description?: string;
  dueDate: string;
  categoryId: number;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    userId: number;
    name: string;
  };
  tags?: {
    id: number;
    name: string;
  }[];
}

export interface TodoApiCreate {
  title: string;
  dueDate: string; // ISO-String
  description?: string;
  categoryId: number;
  tags?: string[]; // Tag-Namen als Array (wie in deinem Backend erwartet)
  completedAt: string | null; // Für das Erledigt-Toggling, optional
}

export interface TodoApiEdit {
  id: number; // Die ID des zu bearbeitenden Todos
  title?: string;
  dueDate?: string;
  description?: string;
  categoryId?: number;
  tags?: string[]; // Tag-Namen als Array (wie in deinem Backend erwartet)
  completedAt?: string | null; // Für das Erledigt-Toggling
}