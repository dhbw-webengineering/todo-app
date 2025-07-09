'use client';

import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter, DialogDescription
} from '@/src/components/ui/dialog';
import { de } from 'date-fns/locale';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Button } from '@/src/components/ui/button';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Calendar } from '@/src/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/src/components/ui/popover';
import { CalendarIcon, MoreVertical, Plus } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem
} from '@/src/components/ui/dropdown-menu';
import { createTodoApi, updateTodoApi } from '@/src/utils/TasksAPI';
import { useCategory } from '@/src/state/useCategory';
import { CategorySelect } from '@/src/components/categorySelect';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { TodoApiResponse, TodoApiCreate, TodoApiEdit } from '@/src/types/task';
import { useTaskQuery } from '@/src/state/TaskQueryContext';
import { z } from "zod"
import { toast } from 'sonner';
import { cn } from '@/src/utils/utils';

const TaskSchema = z.object({
  title: z.string().min(1, "Titel darf nicht leer sein"),
  dueDate: z.date({ required_error: "Fälligkeitsdatum ist erforderlich" }),
  categoryId: z.string().min(1, "Kategorie ist erforderlich"),
  tagsStr: z.string().optional(),
  description: z.string().optional(),
  completed: z.boolean(),
})

type TaskDialogProps = {
  mode: 'create' | 'edit';
  task?: TodoApiResponse | null;
  onDelete?: (id: number) => void;
  triggerVariant?: 'button' | 'dropdown';
  hideTrigger?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function TaskDialog({
  mode,
  task,
  onDelete,
  triggerVariant = 'button',
  hideTrigger = false,
  open: controlledOpen,
  onOpenChange,
}: TaskDialogProps) {
  const [openState, setOpenState] = useState(false);
  const open = controlledOpen ?? openState;
  const setOpen = onOpenChange ?? setOpenState;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [categoryId, setCategoryId] = useState('');
  const { categories } = useCategory();
  const [tagsStr, setTagsStr] = useState('');
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof z.infer<typeof TaskSchema>, string>>>({});
  const { invalidateAll } = useTaskQuery();

  useEffect(() => {
    if (mode === 'edit' && task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
      setCategoryId(String(task.categoryId));
      setTagsStr(task.tags?.map(t => t.name).join(', ') || '');
      setCompleted(!!task.completedAt);
    } else {
      setTitle(''); setDescription(''); setDueDate(undefined);
      setCategoryId(''); setTagsStr(''); setCompleted(false); setErrors({});
    }
  }, [mode, task]);

  const handleSave = async () => {
    const parsed = TaskSchema.safeParse({
      title: title.trim(),
      dueDate,
      categoryId,
      tagsStr,
      description,
      completed,
    });

    if (!parsed.success) {
      const newErrors: Partial<Record<keyof z.infer<typeof TaskSchema>, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof z.infer<typeof TaskSchema>;
        newErrors[key] = issue.message;
      }
      setErrors(newErrors);
      toast.error(parsed.error.issues[0]?.message || "Fehlerhafte Eingabe");
      return;
    }

    setErrors({});

    try {
      const tagList = tagsStr
        ? tagsStr.split(",").map(tag => tag.trim()).filter(Boolean)
        : undefined;

      if (mode === "create") {
        const data: TodoApiCreate = {
          title: title.trim(),
          dueDate: dueDate!.toISOString(),
          description: description || undefined,
          categoryId: Number(categoryId),
          completedAt: completed ? new Date().toISOString() : null,
          tags: tagList,
        };
        await createTodoApi(data);
      } else {
        const edit: TodoApiEdit = {
          id: task!.id,
          title: title.trim(),
          dueDate: dueDate ? dueDate.toISOString() : undefined,
          description: description || undefined,
          categoryId: Number(categoryId),
          tags: tagList,
          completedAt: completed ? (task!.completedAt || new Date().toISOString()) : null,
        };
        await updateTodoApi(edit);
      }

      invalidateAll();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Speichern fehlgeschlagen. Bitte versuche es erneut.");
    }
  };

  const handleDelete = async () => {
    if (mode === 'edit' && task && onDelete) {
      onDelete(task.id);
      invalidateAll();
      setOpen(false);
    }
  };

  const renderTrigger = () => {
    if (hideTrigger) return null;
    if (mode === 'create') {
      return (
        <Button onClick={() => setOpen(true)} variant="outline">
          <Plus size={16} /> Neu
        </Button>
      );
    }
    if (triggerVariant === 'dropdown') {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreVertical className="cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className='cursor-pointer' onClick={() => setOpen(true)}>Bearbeiten</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-red-600">Löschen</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {renderTrigger()}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Task erstellen' : 'Task bearbeiten'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Bitte Felder ausfüllen.' : 'Änderungen vornehmen.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label>Titel *</label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              aria-invalid={!!errors.title}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
          </div>
          <div>
            <label>Beschreibung</label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <label>Fälligkeitsdatum *</label>
            <Popover>
              <PopoverTrigger asChild className="cursor-pointer">
                <Button variant="outline" className={cn("w-full justify-start", errors.dueDate && "border-red-500")}>
                  {dueDate ? format(dueDate, 'dd.MM.yyyy') : 'Datum wählen'}
                  <CalendarIcon className="ml-auto" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={date => setDueDate(date || undefined)}
                  locale={de}
                />
              </PopoverContent>
            </Popover>
            {errors.dueDate && <p className="text-sm text-red-600">{errors.dueDate}</p>}
          </div>
          <div>
            <label>Kategorie *</label>
            <CategorySelect data={categories} value={categoryId} onChange={id => setCategoryId(id)} />
            {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId}</p>}
          </div>
          <div>
            <label>Tags</label>
            <Input value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="tag1, tag2" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id='completed' className='cursor-pointer' checked={completed} onCheckedChange={v => setCompleted(!!v)} />
            <label htmlFor='completed' className='cursor-pointer'>als Erledigt markieren</label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" className='cursor-pointer' onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button onClick={handleSave} className='cursor-pointer'>{mode === 'create' ? 'Erstellen' : 'Speichern'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
