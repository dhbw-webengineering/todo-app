export interface TOdoApiResponse {
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
