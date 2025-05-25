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
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { de } from "date-fns/locale";
import { CalendarIcon, Plus } from "lucide-react";

type Props = {
  onCreate: (newTask: any) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean; // Falls du den Trigger-Button verstecken willst
};

export function CreateTaskDialog({
  onCreate,
  open,
  onOpenChange,
  hideTrigger,
}: Props) {
  // interner Fallback-State (wenn open/onOpenChange nicht übergeben werden)
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;

  const currentOpen = isControlled ? open : internalOpen;
  const setCurrentOpen = isControlled ? onOpenChange! : setInternalOpen;

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

  const setRelativeDate = (daysFromToday: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    setFaelligkeitDate(date);
  };

  const handleCreate = () => {
    const newErrors = {
      titel: !titel.trim(),
      faelligkeit: !faelligkeitDate,
      kategorie: !kategorie.trim(),
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    onCreate({
      titel,
      beschreibung,
      abgeschlossen: abgeschlossen ? "true" : "false",
      faelligkeit: faelligkeitDate?.toISOString(),
      kategorie: { name: kategorie },
      tags: tags
        ? tags.split(",").map((name, i) => ({
            name: name.trim(),
            tagID: `temp-${i}`,
          }))
        : [],
    });

    // Reset
    setTitel("");
    setBeschreibung("");
    setFaelligkeitDate(undefined);
    setKategorie("");
    setTags("");
    setAbgeschlossen(false);
    setErrors({});
    setCurrentOpen(false);
  };

  return (
    <Dialog open={currentOpen} onOpenChange={setCurrentOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Plus className="w-4 h-4" />
            Neuen Task erstellen
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Task erstellen</DialogTitle>
          <DialogDescription>
            Fülle die folgenden Felder aus, um einen neuen Task zu erstellen.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Titel */}
          <div className="space-y-1">
            <label htmlFor="create-titel" className="text-sm font-medium">
              Titel *
            </label>
            <Input
              id="create-titel"
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
              htmlFor="create-beschreibung"
              className="text-sm font-medium"
            >
              Beschreibung (optional)
            </label>
            <Textarea
              id="create-beschreibung"
              value={beschreibung}
              onChange={(e) => setBeschreibung(e.target.value)}
              placeholder="Beschreibung (optional)"
            />
          </div>
          {/* Fälligkeitsdatum */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="create-faelligkeit">
              Fälligkeitsdatum *
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="create-faelligkeit"
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
                tabIndex={0}
                forceMount
              >
                <div className="pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={faelligkeitDate}
                    onSelect={(date) => setFaelligkeitDate(date)}
                    locale={de}
                    defaultMonth={faelligkeitDate ?? new Date()}
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
            <label htmlFor="create-kategorie" className="text-sm font-medium">
              Kategorie *
            </label>
            <Input
              id="create-kategorie"
              value={kategorie}
              onChange={(e) => setKategorie(e.target.value)}
              placeholder="Kategorie"
              aria-invalid={errors.kategorie}
              className={errors.kategorie ? "border-red-500" : ""}
            />
          </div>
          {/* Tags */}
          <div className="space-y-1">
            <label htmlFor="create-tags" className="text-sm font-medium">
              Tags (Kommagetrennt, optional)
            </label>
            <Input
              id="create-tags"
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
              id="create-abgeschlossen"
            />
            <label htmlFor="create-abgeschlossen" className="text-sm">
              Erledigt
            </label>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={handleCreate}>Erstellen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
