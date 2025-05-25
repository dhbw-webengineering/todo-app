import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { Task } from "@/types/task";
import { EditTaskDialog } from "@/components/task/EditTaskDialog"; // Pfad anpassen

import { useState } from "react";

import { format, differenceInCalendarDays } from "date-fns";

export function TaskCard({
  task,
  onToggle,
  onUpdate,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (id: string) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);

  let faelligkeitLabel = "";
  if (task.faelligkeit) {
    const heute = new Date();
    const faellig = new Date(task.faelligkeit);
    const diff = differenceInCalendarDays(faellig, heute);

    if (diff === 0) faelligkeitLabel = "heute fällig";
    else if (diff === 1) faelligkeitLabel = "morgen fällig";
    else if (diff > 1) faelligkeitLabel = `fällig in ${diff} Tagen`;
    else if (diff === -1) faelligkeitLabel = "seit gestern fällig";
    else faelligkeitLabel = `seit ${Math.abs(diff)} Tagen fällig`;
  }

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white dark:bg-zinc-900 w-full flex flex-col">
      <div>
        <div className="flex justify-between items-start">
          <p className="pb-3 text-sm text-muted-foreground">
            {task.kategorie && <span>{task.kategorie.name}</span>}
            {task.faelligkeit && (
              <span>
                {" "}
                • {faelligkeitLabel} •{" "}
                {format(new Date(task.faelligkeit), "dd.MM.yyyy")}
              </span>
            )}
          </p>
          {task.abgeschlossen && <Badge variant="default">Erledigt</Badge>}
        </div>

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
      </div>

      {/* Container für Tags und Menubar */}
      <div className="mt-3 flex flex-wrap justify-between items-start">
        <div className="flex flex-wrap gap-2 max-w-[calc(100%-40px)] flex-grow">
          {task.tags.map((tag) => (
            <Badge key={tag.tagID} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>

        <div className="flex-shrink-0 ml-4 self-end">
          <EditTaskDialog task={task} onSave={onUpdate} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}
