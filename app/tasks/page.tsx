"use client";

import { useState,  useEffect } from "react";
import { TaskCard } from "components/task/TaskCard";
import { MultiSelect } from "@/components/multiselect";
import { TodoApiResponse } from "@/types/task";
import { Turtle } from "lucide-react";
import { DateRangePicker } from "@/components/dateRangePicker";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import TasksContainer from "@/components/task/TasksContainer";
import { ApiRoute } from "@/ApiRoute";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { useCategories } from "@/hooks/useCategory";
import { useTags } from "@/hooks/useTags";
import type { Category } from "@/types/category";

export default function TasksPage() {
  const [tasks, setTasks] = useState<TodoApiResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Kategorien und Tags vom Backend holen
  const { categories} = useCategories();
  const { tags,} = useTags();

  // Kategorien für MultiSelect mappen
  const categorielist = categories.map((cat: Category) => ({
    value: String(cat.id),
    label: cat.name,
    icon: Turtle,
  }));

  // Tags für MultiSelect mappen
  const tagsList = tags.map((tag) => ({
    value: tag.name,
    label: tag.name,
    icon: Turtle,
  }));

  // Query-Parameter Hooks
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialisierung der Filter aus der URL
  const [selectedCategorie, setSelectedCategorie] = useState<string[]>(() => {
    const catParam = searchParams.get("categories");
    return catParam ? catParam.split(",") : [];
  });
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tagParam = searchParams.get("tags");
    return tagParam ? tagParam.split(",") : [];
  });

  // Synchronisiere Auswahl mit Query-Parametern
  useEffect(() => {
    const catParam = searchParams.get("categories");
    setSelectedCategorie(catParam ? catParam.split(",") : []);
    const tagParam = searchParams.get("tags");
    setSelectedTags(tagParam ? tagParam.split(",") : []);
  }, [searchParams]);

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-1/5">
          <MultiSelect
            options={categorielist}
            onValueChange={handleCategoriesChange}
            value={selectedCategorie}
            placeholder="Kategorie"
            variant="inverted"
            maxCount={2}
          />
        </div>
        <div className="w-1/5">
          <MultiSelect
            options={tagsList}
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
      <div className="space-y-4 max-w-3xl">
        <TasksContainer apiRoute={ApiRoute.TODOS} showTasksDone={true}/>
      </div>
    </div>
  );
}
