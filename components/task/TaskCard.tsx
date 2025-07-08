import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TodoApiResponse } from "@/types/task";
import { TaskDialog } from "@/components/task/TaskDialog";
import { differenceInCalendarDays, format } from "date-fns";
import moment from 'moment';
import { toast } from 'sonner';

moment.locale("de");

export function TaskCard({
  task,
  onUpdate,
  onDelete,
  onTagsChanged
}: {
  task: TodoApiResponse;
  onUpdate: (updatedTask: TodoApiResponse) => void;
  onDelete: () => void;
  onTagsChanged?: () => void;
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
            {isCompleted && (
              <Badge variant="default" className="text-xs bg-green-200 text-green-800">
                Erledigt
              </Badge>
            )}
            {task.category && (
              <Badge variant="secondary" className="text-xs">
                {task.category.name}
              </Badge>
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
                <p className={`text-sm mt-1 ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-wrap gap-1">
              {task.tags?.map(tag => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
            <TaskDialog
              mode="edit"
              task={task}
              onDelete={onDelete}
              triggerVariant="dropdown"
              onTagsChanged={onTagsChanged}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
