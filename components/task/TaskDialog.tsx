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
import { TodoApiResponse, TodoApiCreate, TodoApiEdit } from "@/types/task";
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
import { createTodoApi, updateTodoApi } from "@/TasksAPI";
import { useCategories } from "@/hooks/useCategory";
import { CategorySelect } from "@/components/categorySelect";

type TaskDialogProps = {
  mode: "create" | "edit";
  task?: TodoApiResponse | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDelete?: (id: number) => void;
  hideTrigger?: boolean;
  triggerVariant?: "button" | "dropdown";
  onTagsChanged?: () => void;
};

export function TaskDialog({
  mode,
  task,
  open,
  onOpenChange,
  onDelete,
  hideTrigger = false,
  triggerVariant = "button",
  onTagsChanged,
}: TaskDialogProps) {
  // State Management
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const currentOpen = isControlled ? open : internalOpen;
  const setCurrentOpen = isControlled ? onOpenChange! : setInternalOpen;

  const { categories } = useCategories();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string>("");
  const [tagsStr, setTagsStr] = useState("");
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState<{
    title?: boolean;
    dueDate?: boolean;
    category?: boolean;
  }>({});

  // State for delete confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);

  const handleSave = async () => {
    const newErrors = {
      title: !title.trim(),
      dueDate: !dueDate,
      category: !categoryId,
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    try {
      if (mode === "create") {
        const createData: TodoApiCreate = {
          title: title,
          dueDate: dueDate!.toISOString(),
          description: description || undefined,
          categoryId: Number(categoryId),
          completedAt: completed ? new Date().toISOString() : null,
          tags: tagsStr
            ? tagsStr.split(",").map((name) => name.trim()).filter(Boolean)
            : undefined,
        };
        await createTodoApi(createData);
      } else if (mode === "edit" && task) {
        const editData: TodoApiEdit = {
          id: task.id,
          title,
          dueDate: dueDate ? dueDate.toISOString() : undefined,
          description: description || undefined,
          categoryId: Number(categoryId),
          tags: tagsStr
            ? tagsStr.split(",").map((name) => name.trim()).filter(Boolean)
            : undefined,
          completedAt: completed
            ? task.completedAt
              ? task.completedAt
              : new Date().toISOString()
            : null,
        };
        await updateTodoApi(editData);
      }
      if (onTagsChanged) {
        onTagsChanged();
      }
      window.location.reload();

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

  useEffect(() => {
    if (mode === "edit" && task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
      setCategoryId(String(task.categoryId));
      setTagsStr(task.tags?.map((t) => t.name).join(", ") || "");
      setCompleted(!!task.completedAt);
    }
    if (mode === "create") {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, task]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate(undefined);
    setCategoryId("");
    setTagsStr("");
    setCompleted(false);
    setErrors({});
  };

  const setRelativeDate = (daysFromToday: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    setDueDate(date);
  };

  const handleDelete = async () => {
    if (mode === "edit" && task && onDelete) {
      try {
        onDelete(task.id);
        setCurrentOpen(false);
      } catch (error) {
        console.error("Fehler beim Löschen:", error);
      } 
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
            <DropdownMenuItem onClick={() => setShowDeleteConfirmation(true)} className="text-red-600 cursor-pointer">
              Löschen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return null;
  };

  return (
    <>
      {renderTrigger()}

      {/*Todo edit dialog*/}
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
              <label htmlFor="task-title" className="text-sm font-medium">
                Titel *
              </label>
              <Input
                id="task-title"
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
                htmlFor="task-description"
                className="text-sm font-medium"
              >
                Beschreibung (optional)
              </label>
              <Textarea
                id="task-description"
                value={description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="Beschreibung (optional)"
              />
            </div>

            {/* Fälligkeitsdatum */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="task-dueDate">
                Fälligkeitsdatum *
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="task-dueDate"
                    variant="outline"
                    className={`w-full justify-start text-left font-normal cursor-pointer ${errors.dueDate ? "border-red-500" : ""
                      }`}
                    aria-invalid={errors.dueDate}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate
                      ? format(dueDate, "dd.MM.yyyy")
                      : "Datum wählen"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 z-[1000]"
                  align="start"
                  sideOffset={4}
                >
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    locale={de}
                    defaultMonth={dueDate ?? new Date()}
                    initialFocus
                  />

                  <div className="flex justify-between p-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => setRelativeDate(0)}
                    >
                      Heute
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => setRelativeDate(1)}
                    >
                      Morgen
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => setRelativeDate(7)}
                    >
                      In 7 Tagen
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Kategorie */}
            <div className="space-y-1">
              <label htmlFor="task-category" className="text-sm font-medium">
                Kategorie *
              </label>
              <CategorySelect 
                data={categories}
                value={categoryId}
                onChange={setCategoryId}
                />
            </div>

            {/* Tags */}
            <div className="space-y-1">
              <label htmlFor="task-tags" className="text-sm font-medium">
                Tags (Kommagetrennt, optional)
              </label>
              <Input
                id="task-tags"
                value={tagsStr}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTagsStr(e.target.value)}
                placeholder="Tags (Kommagetrennt, optional)"
              />
            </div>

            {/* Erledigt */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={completed}
                onCheckedChange={() => setCompleted(!completed)}
                id="task-completed"
                className="cursor-pointer"
              />
              <label htmlFor="task-completed" className="text-sm">
                Erledigt
              </label>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button className="cursor-pointer" onClick={handleSave}>
              {mode === "create" ? "Erstellen" : "Speichern"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog for task deletion */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Todo löschen</DialogTitle>
            <DialogDescription>
              Bist du sicher, dass du die Todo &quot;{task?.title}&quot; löschen möchtest?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="cursor-pointer" onClick={() => setShowDeleteConfirmation(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" className="cursor-pointer" onClick={handleDelete}>
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
