import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"

import { Task } from '@/types/task'
import { EditTaskDialog } from "@/components/task/EditTaskDialog" // Pfad anpassen

export function TaskCard({
  task,
  onToggle,
  onUpdate,
}: {
  task: Task
  onToggle: (id: string) => void
  onUpdate: (updatedTask: Task) => void
}) {
  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white dark:bg-zinc-900">
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-start">
          <Checkbox
            checked={!!task.abgeschlossen}
            onCheckedChange={() => onToggle(task.eintragID)}
            className="mt-1"
          />
          <div>
            <h2
              className={`text-lg font-semibold ${
                task.abgeschlossen ? "line-through text-muted-foreground" : ""
              }`}
            >
              {task.titel}
            </h2>
            {task.beschreibung && (
              <p className="text-sm text-muted-foreground">
                {task.beschreibung}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {task.abgeschlossen && <Badge variant="default">Erledigt</Badge>}
          <EditTaskDialog task={task} onSave={onUpdate} />
        </div>
      </div>

      <div className="mt-2 text-sm text-muted-foreground">
        {task.faelligkeit && (
          <p>Fällig: {format(new Date(task.faelligkeit), "dd.MM.yyyy")}</p>
        )}
        {task.kategorie && <p>Kategorie: {task.kategorie.name}</p>}
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {task.tags.map((tag) => (
            <Badge key={tag.tagID} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
