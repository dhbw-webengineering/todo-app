import { mutate } from 'swr';
import { createTodoApi, updateTodoApi, deleteTodoApi } from '@/TasksAPI';
import type { TodoApiCreate, TodoApiEdit } from '@/types/task';

/** Neuen Task erstellen und Tasks & Tags neu laden */
export async function createTask(data: TodoApiCreate) {
  const newTask = await createTodoApi(data);
  await Promise.all([
    mutate('/todos'),  // invalidiert Tasks-Cache
    mutate('/tags'),   // invalidiert Tags-Cache
  ]);
  return newTask;
}

/** Task aktualisieren und Tasks & Tags neu laden */
export async function updateTask(data: TodoApiEdit) {
  const updated = await updateTodoApi(data);
  await Promise.all([
    mutate('/todos'),
    mutate('/tags'),
  ]);
  return updated;
}

/** Task löschen und Tasks & Tags neu laden */
export async function deleteTask(id: number) {
  await deleteTodoApi(id);
  await Promise.all([
    mutate('/todos'),
    mutate('/tags'),
  ]);
}
