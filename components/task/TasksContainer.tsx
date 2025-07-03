"use client";

import { TaskCard } from "./TaskCard";
import type { TodoApiResponse, TodoApiEdit} from "@/types/task";
import type { Category } from "@/types/category";
import type { Tag } from "@/types/tag";

interface TasksContainerProps {
  tasks: TodoApiResponse[];                           // kommt jetzt von oben
  categories: Category[];                             // (nur falls die Cards es brauchen)
  tags: Tag[];                                        //  "
  showTasksDone: boolean;
  onUpdate: (t: TodoApiEdit) => Promise<any>;     // SWR-Mutation
  onDelete: (id: number) => Promise<any>;             // SWR-Mutation
}

export default function TasksContainer({
  tasks,
  categories,
  tags,
  showTasksDone,
  onUpdate,
  onDelete,
}: TasksContainerProps) {
  /* 1. filtern */
  const list = showTasksDone ? tasks : tasks.filter(t => !t.completedAt);

  /* 2. sortieren */
  const sorted = [...list].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  /* 3. rendern */
  return (
    <div className="grid gap-5">
      {sorted.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          categories={categories}   /* falls du die Info im Card brauchst */
          tags={tags}
         onUpdate={async updatedTask => {
            // Erzeuge hier das Edit-Payload aus dem vollen Task, z.B. nur Felder, die du ändern willst
            const payload: TodoApiEdit = {
              id: updatedTask.id,
              title: updatedTask.title,
              dueDate: updatedTask.dueDate,
              description: updatedTask.description,
              categoryId: updatedTask.categoryId,
              tags: updatedTask.tags?.map(t => t.name),
              completedAt: updatedTask.completedAt ?? null,
            };
            await onUpdate(payload);
          }}
          onDelete={id => onDelete(id)}
        />
      ))}
    </div>
  );
}
