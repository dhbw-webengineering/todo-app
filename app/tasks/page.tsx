"use client";

import { useState, useEffect } from "react";
import { MultiSelect } from "@/components/multiselect";
import { DateRangePicker } from "@/components/dateRangePicker";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import TasksContainer from "@/components/task/TasksContainer";
import { ApiRoute } from "@/ApiRoute";
import { DateRange } from "react-day-picker";
import { useCategories } from "@/hooks/useCategory";
import { useTags } from "@/hooks/useTags";
import type { Category } from "@/types/category";

export default function TasksPage() {
  // Kategorien und Tags vom Backend holen
  const { categories } = useCategories();
  const { tags, refetch: refetchTags } = useTags();

  // Kategorien für MultiSelect mappen
  const categorielist = categories.map((cat: Category) => ({
    value: String(cat.id),
    label: cat.name,
  }));

  // Tags für MultiSelect mappen
  const tagsList = tags.map((tag) => ({
    value: String(tag.id),
    label: tag.name,
  }));

  // Query-Parameter Hooks
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialisierung der Filter aus der URL (nutze getAll!)
  const [selectedCategorie, setSelectedCategorie] = useState<string[]>(() => {
    return searchParams.getAll("category");
  });
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    return searchParams.getAll("tag");
  });

  // DateRange initialisieren aus Query-Parametern
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    if (fromParam && toParam) {
      const fromDate = new Date(fromParam);
      const toDate = new Date(toParam);
      if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
        return { from: fromDate, to: toDate };
      }
    }
    return undefined;
  });

  // Synchronisiere Auswahl mit Query-Parametern
  useEffect(() => {
    setSelectedCategorie(searchParams.getAll("category"));
    setSelectedTags(searchParams.getAll("tag"));

    // DateRange synchronisieren
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    if (fromParam && toParam) {
      const fromDate = new Date(fromParam);
      const toDate = new Date(toParam);
      if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
        setDateRange({ from: fromDate, to: toDate });
        return;
      }
    }
    setDateRange(undefined);
  }, [searchParams]);

  const handleCategoriesChange = (newCategories: string[]) => {
    setSelectedCategorie(newCategories);

    const params = new URLSearchParams(searchParams);
    params.delete("category");
    newCategories.forEach(cat => params.append("category", cat));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleTagsChange = (newTags: string[]) => {
    setSelectedTags(newTags);

    const params = new URLSearchParams(searchParams);
    params.delete("tag");
    newTags.forEach(tag => params.append("tag", tag));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);

    const params = new URLSearchParams(searchParams);
    if (range?.from && range?.to) {
      params.set("from", range.from.toISOString());
      params.set("to", range.to.toISOString());
    } else {
      params.delete("from");
      params.delete("to");
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
          <DateRangePicker value={dateRange} onChange={handleDateChange} />
        </div>
      </div>
      <div className="space-y-4 max-w-3xl">
        <TasksContainer 
          apiRoute={ApiRoute.TODOS} 
          showTasksDone={true}
          onTagsChanged={refetchTags}
        />
      </div>
    </div>
  );
}
