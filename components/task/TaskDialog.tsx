"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect, ChangeEvent } from "react";
import { Task, TaskCreateData } from "@/types/task";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { de } from "date-fns/locale";
import { CalendarIcon, Plus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MultiSelect } from "../multiselect";
import { Turtle } from "lucide-react";
import moment, { Moment } from "moment";


type TaskDialogProps = {
  mode: "create" | "edit";
  task?: Task;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave: (task: Task | TaskCreateData) => void;
  onDelete?: (id: number) => void;
  hideTrigger?: boolean;
  triggerVariant?: "button" | "dropdown";
};

export function TaskDialog({
  mode,
  task,
  open,
  onOpenChange,
  onSave,
  onDelete,
  hideTrigger = false,
  triggerVariant = "button",
}: TaskDialogProps) {
  // State Management
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const currentOpen = isControlled ? open : internalOpen;
  const setCurrentOpen = isControlled ? onOpenChange! : setInternalOpen;

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Moment | undefined>(
    undefined
  );
  const [categoryId, setCategoryId] = useState<number[]>([0]);
  const [tags, setTags] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const [errors, setErrors] = useState<{
    title?: boolean;
    dueDate?: boolean;
    category?: boolean;
  }>({});

  // In TaskDialog.tsx - handleSave Funktion anpassen
  const handleSave = async () => {
    const newErrors = {
      title: !title.trim(),
      dueDate: !dueDate,
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    try {
      const taskData: TaskCreateData = {
        ...(mode === "edit" && task ? task : {}),
        title: title,
        description: description,
        done: done,
        dueDate: dueDate,
        categoryId: categoryId[0],
        tags: tags
      };

      await onSave(taskData);

      if (mode === "create") {
        resetForm();
      }
      setCurrentOpen(false);
    } catch (error) {
      console.error(
        `Fehler beim ${mode === "create" ? "Erstellen" : "Speichern"}:`,
        error
      );
    }
  };

  // Initialize form - Edit Mode korrigieren
  useEffect(() => {
    if (mode === "edit" && task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDueDate(task.dueDate);
      setCategoryId([task.categoryId || 0]);
      setTags(task.tags || []);
      setDone(task.done);
    }
  }, [mode, task]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate(undefined);
    setCategoryId([0]);
    setTags([]);
    setDone(false);
    setErrors({});
  };

  const setRelativeDate = (daysFromToday: number) => {
    setDueDate(moment().add(daysFromToday, "days"));
  };

  const handleDelete = () => {
    if (mode === "edit" && task && onDelete) {
      onDelete(task.id);
      setCurrentOpen(false);
    }
  };

  const renderTrigger = () => {
    if (hideTrigger) return null;

    if (mode === "create") {
      return (
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            Neuen Task erstellen
          </Button>
        </DialogTrigger>
      );
    }

    if (mode === "edit" && triggerVariant === "dropdown") {
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button aria-label="Mehr Optionen">
              <MoreVertical className="w-5 h-5 cursor-pointer" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setCurrentOpen(true)} className="cursor-pointer">
              Bearbeiten
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600 cursor-pointer">
              Löschen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return null;
  };

  const frameworksList = [
    { value: 0, label: "React", icon: Turtle },
    { value: 1, label: "Angular", icon: Turtle },
    { value: 2, label: "Vue", icon: Turtle },
    { value: 3, label: "Svelte", icon: Turtle },
    { value: 4, label: "Ember", icon: Turtle },
  ];

  const [selectedCategory, setSelectedCategory] = useState<number>();

  return (
    <>
      {renderTrigger()}

      <Dialog open={currentOpen} onOpenChange={setCurrentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Task erstellen" : "Task bearbeiten"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Felder ausfüllen um Task zu erstellen"
                : "Felder editieren um Task zu bearbeiten"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Titel */}
            <div className="space-y-1">
              <label htmlFor="task-titel" className="text-sm font-medium">
                Titel *
              </label>
              <Input
                id="task-titel"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="Titel"
                aria-invalid={errors.title}
                className={errors.title ? "border-red-500" : ""}
              />
            </div>

            {/* Beschreibung */}
            <div className="space-y-1">
              <label
                htmlFor="task-beschreibung"
                className="text-sm font-medium"
              >
                Beschreibung (optional)
              </label>
              <Textarea
                id="task-beschreibung"
                value={description}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                placeholder="Beschreibung (optional)"
              />
            </div>

            {/* Fälligkeitsdatum */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="task-faelligkeit">
                Fälligkeitsdatum *
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="task-faelligkeit"
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      errors.dueDate ? "border-red-500" : ""
                    }`}
                    aria-invalid={errors.dueDate}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate !== undefined
                      ? format(dueDate.toDate(), "dd.MM.yyyy")
                      : "Datum wählen"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 z-[1000]"
                  align="start"
                  sideOffset={4}
                >
                  <div className="pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={(date: Date) => {
                          setDueDate(moment(date));
                        }
                      }
                      locale={de}
                      defaultMonth={dueDate ?? moment().toDate()}
                      initialFocus
                    />
                    <div className="flex justify-between p-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRelativeDate(0)}
                      >
                        Heute
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRelativeDate(1)}
                      >
                        Morgen
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRelativeDate(7)}
                      >
                        In 7 Tagen
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Kategorie */}
            <MultiSelect
              options={frameworksList}
              onValueChange={setCategoryId}
              defaultValue={[0]}
              maxSelectable={1}
              placeholder="Kategorie"
              />

            {/* Tags */}
            <div className="space-y-1">
              <label htmlFor="task-tags" className="text-sm font-medium">
                Tags (Kommagetrennt, optional)
              </label>
              <Input
                id="task-tags"
                value={tags}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTags(e.target.value.replace(" ", "").split(","))}
                placeholder="Tags (Kommagetrennt, optional)"
              />
            </div>

            {/* Erledigt */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={done}
                onCheckedChange={() => setDone(!done)}
                id="task-abgeschlossen"
              />
              <label htmlFor="task-abgeschlossen" className="text-sm">
                Erledigt
              </label>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={() => {
              handleSave();
              // bei Datumsänderung muss neu geladen werden
              if (task && task.dueDate !== dueDate) {
                window.location.reload();
              }
            }}>
              {mode === "create" ? "Erstellen" : "Speichern"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
