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
import { useState, useEffect } from "react";
import { Task } from "@/types/task";
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

type TaskDialogProps = {
  mode: "create" | "edit";
  task?: Task;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave: (task: Task | any) => void;
  onDelete?: (id: string) => void;
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
  const [titel, setTitel] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [faelligkeitDate, setFaelligkeitDate] = useState<Date | undefined>(
    undefined
  );
  const [kategorie, setKategorie] = useState("");
  const [tags, setTags] = useState("");
  const [abgeschlossen, setAbgeschlossen] = useState(false);

  const [errors, setErrors] = useState<{
    titel?: boolean;
    faelligkeit?: boolean;
    kategorie?: boolean;
  }>({});

  // In TaskDialog.tsx - handleSave Funktion anpassen
  const handleSave = async () => {
    const newErrors = {
      titel: !titel.trim(),
      faelligkeit: !faelligkeitDate,
      kategorie: !kategorie.trim(),
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    try {
      const taskData = {
        ...(mode === "edit" && task ? task : {}),
        titel,
        beschreibung,
        abgeschlossen: abgeschlossen ? new Date().toISOString() : null,
        faelligkeit: faelligkeitDate ? faelligkeitDate.toISOString() : "null",
        kategorie: { name: kategorie },
        tags: tags
          ? tags.split(",").map((name, i) => ({
              name: name.trim(),
              tagID:
                mode === "edit" && task?.tags?.[i]?.tagID
                  ? task.tags[i].tagID
                  : `temp-${i}`,
            }))
          : [],
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
      setTitel(task.titel);
      setBeschreibung(task.beschreibung || "");
      setFaelligkeitDate(
        task.faelligkeit ? new Date(task.faelligkeit) : undefined
      );
      setKategorie(task.kategorie?.name || "");
      setTags(task.tags?.map((t) => t.name).join(", ") || "");
      setAbgeschlossen(!!task.abgeschlossen && task.abgeschlossen !== "null");
    }
  }, [mode, task]);

  const resetForm = () => {
    setTitel("");
    setBeschreibung("");
    setFaelligkeitDate(undefined);
    setKategorie("");
    setTags("");
    setAbgeschlossen(false);
    setErrors({});
  };

  const setRelativeDate = (daysFromToday: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    setFaelligkeitDate(date);
  };

  const handleDelete = () => {
    if (mode === "edit" && task && onDelete) {
      onDelete(task.eintragID);
      setCurrentOpen(false);
    }
  };

  const renderTrigger = () => {
    if (hideTrigger) return null;

    if (mode === "create") {
      return (
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start gap-2">
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
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setCurrentOpen(true)}>
              Bearbeiten
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
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
                value={titel}
                onChange={(e) => setTitel(e.target.value)}
                placeholder="Titel"
                aria-invalid={errors.titel}
                className={errors.titel ? "border-red-500" : ""}
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
                value={beschreibung}
                onChange={(e) => setBeschreibung(e.target.value)}
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
                      errors.faelligkeit ? "border-red-500" : ""
                    }`}
                    aria-invalid={errors.faelligkeit}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {faelligkeitDate
                      ? format(faelligkeitDate, "dd.MM.yyyy")
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
                      selected={faelligkeitDate}
                      onSelect={setFaelligkeitDate}
                      locale={de}
                      defaultMonth={faelligkeitDate ?? new Date()}
                      initialFocus
                    />
                  </div>

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
                </PopoverContent>
              </Popover>
            </div>

            {/* Kategorie */}
            <div className="space-y-1">
              <label htmlFor="task-kategorie" className="text-sm font-medium">
                Kategorie *
              </label>
              <Input
                id="task-kategorie"
                value={kategorie}
                onChange={(e) => setKategorie(e.target.value)}
                placeholder="Kategorie"
                aria-invalid={errors.kategorie}
                className={errors.kategorie ? "border-red-500" : ""}
              />
            </div>

            {/* Tags */}
            <div className="space-y-1">
              <label htmlFor="task-tags" className="text-sm font-medium">
                Tags (Kommagetrennt, optional)
              </label>
              <Input
                id="task-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (Kommagetrennt, optional)"
              />
            </div>

            {/* Erledigt */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={abgeschlossen}
                onCheckedChange={() => setAbgeschlossen(!abgeschlossen)}
                id="task-abgeschlossen"
              />
              <label htmlFor="task-abgeschlossen" className="text-sm">
                Erledigt
              </label>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={handleSave}>
              {mode === "create" ? "Erstellen" : "Speichern"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
