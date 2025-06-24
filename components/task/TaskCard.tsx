import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/types/task";
import { TaskDialog } from "@/components/task/TaskDialog";
import { format } from "date-fns";
import moment from 'moment'

moment.locale("de")

export function TaskCard({
  task,
  onUpdate,
  onDelete
}: {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (id: number) => void;
}) {
  let dueDateLabel = "";
  if (task.dueDate) {
    const today = moment().startOf("day");
    const diff = task.dueDate.startOf("day").diff(today, "days");

    if (diff === 0) dueDateLabel = "heute fällig";
    else if (diff === 1) dueDateLabel = "morgen fällig";
    else if (diff > 1) dueDateLabel = `fällig in ${diff} Tagen`;
    else if (diff === -1) dueDateLabel = "seit gestern fällig";
    else dueDateLabel = `seit ${Math.abs(diff)} Tagen fällig`;
  }

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white dark:bg-zinc-900 w-full flex flex-col">
      <div>
        <div className="flex justify-between items-start">
          <p className="pb-3 text-sm text-muted-foreground">
            {task.categoryId !== undefined && <span>{"CatId:" + task.categoryId}</span>}
            {task.dueDate && (
              <span>
                {" "}
                • {dueDateLabel} •{" "}
                {format(task.dueDate.toDate(), "dd.MM.yyyy")}
              </span>
            )}
          </p>
          
          {task.done && <Badge variant="default">Erledigt</Badge>}
        </div>

        <div className="flex gap-3 items-start">
          <Checkbox
            checked={task.done} 
            onCheckedChange={(checkedState: boolean | 'indeterminate') => {
              if (checkedState === "indeterminate") {
                return;
              }
              task = {
                ...task,
                done: checkedState
              }
              onUpdate(task);
            }}
            className="mt-1 cursor-pointer"
          />
          <div>
            <h2
              className={`text-lg font-semibold ${
                task.done ? "line-through text-muted-foreground" : ""
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
          {task.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex-shrink-0 ml-4 self-end">
          <TaskDialog 
            mode="edit" 
            task={task} 
            onSave={updatedTask => {
              // bei mode 'edit' ist der Typ immer 'Task'
              onUpdate(updatedTask as Task);
            }} 
            onDelete={onDelete}
            triggerVariant="dropdown"
            hideTrigger={false}
          />
        </div>
      </div>
    </div>
  );
}
