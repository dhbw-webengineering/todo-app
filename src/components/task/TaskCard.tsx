import { Badge } from "@/src/components/ui/badge";
import { Checkbox } from "@/src/components/ui/checkbox";
import { TodoApiResponse } from "@/src/types/task";
import { TaskDialog } from "@/src/components/task/TaskDialog";
import { differenceInCalendarDays, format } from "date-fns";
import { toast } from 'sonner';
import Link from "next/link";

export function TaskCard({
  task,
  onUpdate,
  onDelete,
}: {
  task: TodoApiResponse;
  onUpdate: (updatedTask: TodoApiResponse) => void;
  onDelete: (id: number) => void;
}) {
  let dueDateLabel = "";
  if (task.dueDate) {
    const heute = new Date();
    const faellig = new Date(task.dueDate);
    const diff = differenceInCalendarDays(faellig, heute);
    if (diff === 0) dueDateLabel = "heute fällig";
    else if (diff === 1) dueDateLabel = "morgen fällig";
    else if (diff > 1) dueDateLabel = `fällig in ${diff} Tagen`;
    else if (diff === -1) dueDateLabel = "seit gestern fällig";
    else dueDateLabel = `seit ${Math.abs(diff)} Tagen fällig`;
  }

  const isCompleted = !!task.completedAt;

  const handleToggleComplete = async () => {
    try {
      const updated: TodoApiResponse = {
        ...task,
        completedAt: isCompleted ? null : new Date().toISOString()
      };
      await onUpdate(updated);
    } catch (error) {
      toast.error('Fehler beim Aktualisieren des Task-Status');
      console.error(error);
    }
  };

  return (
    <div className={`border rounded-lg p-4 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {isCompleted ? (
              <Badge variant="default" className="text-xs bg-green-200 text-green-800">
                Erledigt
              </Badge>
            ) : (new Date(task.dueDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) ? (
              <Badge variant="destructive" className="text-xs">
                Überfällig
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Offen
              </Badge>
            )}
            {task.category && (
              <Link href={`/tasks?category=${task.category.id}`} className="cursor-pointer">
                <Badge variant="outline" className="text-xs">
                  {task.category.name}
                </Badge>
              </Link>
            )}
            {task.dueDate && (
              <span className="text-sm text-gray-500">
                • {dueDateLabel} • {format(new Date(task.dueDate), "dd.MM.yyyy")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={handleToggleComplete}
              className="mt-1 cursor-pointer"
            />
            <div className="flex-1">
              <h4 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h4>
              {task.description && (
                <p className={`text-sm mt-1 ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-wrap gap-1">
              {task.tags?.length ? (task.tags?.map(tag => (
                <Link key={tag.id} href={`/tasks?tag=${tag.id}`} className="cursor-pointer">
                  <Badge variant="outline" className="text-xs">
                    {tag.name}
                  </Badge>
                </Link>
              ))) : (
                <span className="text-xs text-gray-500 italic">keine Tags</span>)}
            </div>
            <TaskDialog
              mode="edit"
              task={task}
              onDelete={() => onDelete(task.id)}
              triggerVariant="dropdown"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
