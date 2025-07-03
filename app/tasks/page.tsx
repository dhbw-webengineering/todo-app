"use client";

import { useState, useEffect } from "react";
import { MultiSelect } from "@/components/multiselect";
import { DateRangePicker } from "@/components/dateRangePicker";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import TasksContainer from "@/components/task/TasksContainer";
import { TaskDialog } from "@/components/task/TaskDialog";
import { ApiRoute } from "@/ApiRoute";
import { DateRange } from "react-day-picker";
import { useCategories } from "@/hooks/useCategory";
import { useTasks } from '@/hooks/useTasks';
import { useTags } from '@/hooks/useTags';
import { createTask, updateTask, deleteTask } from '@/lib/taskMutations';
import type { Category } from "@/types/category";

export default function TasksPage() {
  // 1. Daten per SWR-Hooks abholen
  const { tasks, isLoading: loadingTasks, isError: errorTasks } = useTasks();
  const { tags, isLoading: loadingTags, isError: errorTags } = useTags();
  
  const { categories } = useCategories();

  // 2. Ladezustand und Fehler abfangen
  if (loadingTasks || loadingTags) {
    return <div className="p-6 text-center">Daten werden geladen…</div>;
  }
  if (errorTasks || errorTags) {
    return <div className="p-6 text-center text-red-600">Fehler beim Laden der Daten.</div>;
  }

  // 3. Mapping für MultiSelect-Optionen
  const categoryOptions = categories.map((cat: Category) => ({
    value: String(cat.id),
    label: cat.name,
  }));

  const tagOptions = tags.map((tag) => ({
    value: tag.name,
    label: tag.name,
  }));

  // 4. Query-Parameter Hooks für Filterung
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 5. Filter-State für URL-Parameter
  const [selectedCategorie, setSelectedCategorie] = useState<string[]>(() => {
    const catParam = searchParams.get("categories");
    return catParam ? catParam.split(",") : [];
  });
  
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tagParam = searchParams.get("tags");
    return tagParam ? tagParam.split(",") : [];
  });

  // 6. Synchronisiere Auswahl mit Query-Parametern
  useEffect(() => {
    const catParam = searchParams.get("categories");
    setSelectedCategorie(catParam ? catParam.split(",") : []);
    const tagParam = searchParams.get("tags");
    setSelectedTags(tagParam ? tagParam.split(",") : []);
  }, [searchParams]);

  // 7. Handler für Filter-Änderungen (URL-Updates)
  const handleCategoriesChange = (newCategories: string[]) => {
    setSelectedCategorie(newCategories);
    const params = new URLSearchParams(searchParams);
    if (newCategories.length > 0) {
      params.set("categories", newCategories.join(","));
    } else {
      params.delete("categories");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleTagsChange = (newTags: string[]) => {
    setSelectedTags(newTags);
    const params = new URLSearchParams(searchParams);
    if (newTags.length > 0) {
      params.set("tags", newTags.join(","));
    } else {
      params.delete("tags");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleDateChange = (range: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (range?.from && range?.to) {
      params.set("startDate", String(range.from.getTime()));
      params.set("endDate", String(range.to.getTime()));
    } else {
      params.delete("startDate");
      params.delete("endDate");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  // 8. Rendering der kompletten Seite
  return (
    <div className="p-6">
      {/* Header mit Create-Dialog */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        {/* Create-Dialog: createTask invalidiert automatisch Tasks & Tags */}
        <TaskDialog 
          mode="create" 
          onSave={createTask}
        />
      </div>

      {/* Filter-Bereich */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-1/5">
          <MultiSelect
            options={categoryOptions}
            onValueChange={handleCategoriesChange}
            value={selectedCategorie}
            placeholder="Kategorie"
            variant="inverted"
            maxCount={2}
          />
        </div>
        <div className="w-1/5">
          <MultiSelect
            options={tagOptions}
            onValueChange={handleTagsChange}
            value={selectedTags}
            placeholder="Tags"
            variant="secondary"
            maxCount={2}
          />
        </div>
        <div className="w-1/6">
          <DateRangePicker onChange={handleDateChange} />
        </div>
      </div>

      {/* Task-Liste mit SWR-Daten */}
      <div className="space-y-4 max-w-3xl">
        <TasksContainer
          tasks={tasks}                    // Daten von useTasks()
          categories={categories}
          tags={tags}
          showTasksDone={true}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
}
