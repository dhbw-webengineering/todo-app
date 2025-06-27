import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TOdoApiResponse } from "@/types/task"; 
import { TaskDialog } from "@/components/task/TaskDialog";
import { format, differenceInCalendarDays } from "date-fns";

export function TaskCard({
  task,
  onToggle,
  onUpdate,
  onDelete,
}: {
  task: TOdoApiResponse;
  onToggle: (id: number) => void;
  onUpdate: (updatedTask: TOdoApiResponse) => void;
  onDelete: (id: number) => void;
}) {
  let faelligkeitLabel = "";
  if (task.dueDate) {
    const heute = new Date();
    const faellig = new Date(task.dueDate);
    const diff = differenceInCalendarDays(faellig, heute);

    if (diff === 0) faelligkeitLabel = "heute fällig";
    else if (diff === 1) faelligkeitLabel = "morgen fällig";
    else if (diff > 1) faelligkeitLabel = `fällig in ${diff} Tagen`;
    else if (diff === -1) faelligkeitLabel = "seit gestern fällig";
    else faelligkeitLabel = `seit ${Math.abs(diff)} Tagen fällig`;
  }

  const isCompleted = !!task.completedAt;

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white dark:bg-zinc-900 w-full flex flex-col">
      <div>
        <div className="flex justify-between items-start">
          <p className="pb-3 text-sm text-muted-foreground">
            {task.category && <span>{task.category.name}</span>}
            {task.dueDate && (
              <span>
                {" "}
                • {faelligkeitLabel} •{" "}
                {format(new Date(task.dueDate), "dd.MM.yyyy")}
              </span>
            )}
          </p>

          {isCompleted && <Badge variant="default">Erledigt</Badge>}
        </div>

        <div className="flex gap-3 items-start">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={() => onToggle(task.id)}
            className="mt-1 cursor-pointer"
          />
          <div>
            <h2
              className={`text-lg font-semibold ${
                isCompleted ? "line-through text-muted-foreground" : ""
              }`}
            >
              {task.title}
            </h2>
            {task.description && (
              <p className="text-sm text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Container für Tags und Menubar */}
      <div className="mt-3 flex flex-wrap justify-between items-start">
        <div className="flex flex-wrap gap-2 max-w-[calc(100%-40px)] flex-grow">
          {task.tags?.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>

        <div className="flex-shrink-0 ml-4 self-end">
          <TaskDialog
            mode="edit"
            task={task}
            onSave={onUpdate}
            triggerVariant="dropdown"
            hideTrigger={false}
          />
        </div>
      </div>
    </div>
  );
}
