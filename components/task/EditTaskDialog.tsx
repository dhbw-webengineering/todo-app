"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Task } from "@/types/task";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { de } from "date-fns/locale";
import { CalendarIcon, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type Props = {
  task: Task;
  onSave: (updatedTask: Task) => void;
  onDelete: (id: string) => void;
};

export function EditTaskDialog({ task, onSave, onDelete }: Props) {
  const [open, setOpen] = useState(false);

  const [titel, setTitel] = useState(task.titel);
  const [beschreibung, setBeschreibung] = useState(task.beschreibung || "");
  const [faelligkeitDate, setFaelligkeitDate] = useState<Date | undefined>(
    task.faelligkeit ? new Date(task.faelligkeit) : undefined
  );
  const [kategorie, setKategorie] = useState(task.kategorie?.name || "");
  const [tags, setTags] = useState(
    task.tags?.map((t) => t.name).join(", ") || ""
  );
  const [abgeschlossen, setAbgeschlossen] = useState(!!task.abgeschlossen);

  const [errors, setErrors] = useState<{
    titel?: boolean;
    faelligkeit?: boolean;
    kategorie?: boolean;
  }>({});

  const setRelativeDate = (daysFromToday: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    setFaelligkeitDate(date);
  };

  const handleSave = () => {
    const newErrors = {
      titel: !titel.trim(),
      faelligkeit: !faelligkeitDate,
      kategorie: !kategorie.trim(),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    onSave({
      ...task,
      titel,
      beschreibung,
      abgeschlossen: abgeschlossen ? "true" : "false",
      faelligkeit: faelligkeitDate ? faelligkeitDate.toISOString() : "null",
      kategorie: { name: kategorie },
      tags: tags
        ? tags.split(",").map((name, i) => ({
            name: name.trim(),
            tagID: task.tags?.[i]?.tagID || `temp-${i}`,
          }))
        : [],
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button aria-label="Mehr Optionen">
            <MoreVertical className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Bearbeiten
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(task.eintragID)}
            className="text-red-600"
          >
            Löschen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Task bearbeiten</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Titel */}
          <div className="space-y-1">
            <label htmlFor="edit-titel" className="text-sm font-medium">
              Titel *
            </label>
            <Input
              id="edit-titel"
              value={titel}
              onChange={(e) => setTitel(e.target.value)}
              placeholder="Titel"
              aria-invalid={errors.titel}
              className={errors.titel ? "border-red-500" : ""}
            />
          </div>
          {/* Beschreibung */}
          <div className="space-y-1">
            <label htmlFor="edit-beschreibung" className="text-sm font-medium">
              Beschreibung (optional)
            </label>
            <Textarea
              id="edit-beschreibung"
              value={beschreibung}
              onChange={(e) => setBeschreibung(e.target.value)}
              placeholder="Beschreibung (optional)"
            />
          </div>
          {/* Fälligkeitsdatum */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="edit-faelligkeit">
              Fälligkeitsdatum *
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="edit-faelligkeit"
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
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={faelligkeitDate}
                  onSelect={setFaelligkeitDate}
                  initialFocus
                  locale={de}
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
              </PopoverContent>
            </Popover>
          </div>
          {/* Kategorie */}
          <div className="space-y-1">
            <label htmlFor="edit-kategorie" className="text-sm font-medium">
              Kategorie *
            </label>
            <Input
              id="edit-kategorie"
              value={kategorie}
              onChange={(e) => setKategorie(e.target.value)}
              placeholder="Kategorie"
              aria-invalid={errors.kategorie}
              className={errors.kategorie ? "border-red-500" : ""}
            />
          </div>
          {/* Tags */}
          <div className="space-y-1">
            <label htmlFor="edit-tags" className="text-sm font-medium">
              Tags (Kommagetrennt, optional)
            </label>
            <Input
              id="edit-tags"
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
              id="abgeschlossen"
            />
            <label htmlFor="abgeschlossen" className="text-sm">
              Erledigt
            </label>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={handleSave}>Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
