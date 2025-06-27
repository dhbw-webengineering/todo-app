"use client";

import { useState } from "react";
import { MultiSelect } from "@/components/multiselect";
import { Turtle } from "lucide-react";
import { DateRangePicker } from "@/components/dateRangePicker";
import TasksContainer from "@/components/task/TasksContainer";
import { ApiRoute } from "@/ApiRoute";
import { DateRange } from "react-day-picker";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function TasksPage() {

  const categoriesList = [
    { value: 0, label: "Kategorie1", icon: Turtle },
    { value: 1, label: "Kategorie2", icon: Turtle },
    { value: 2, label: "Kategorie3", icon: Turtle },
  ];
  const tagsList = [
    { value: 0, label: "Tag1", icon: Turtle },
    { value: 1, label: "Tag2", icon: Turtle },
    { value: 2, label: "Tag3", icon: Turtle }
  ];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const handleCategoriesChange = (newCategories: number[]) => {
    setSelectedCategories(newCategories);
  
    const params = new URLSearchParams(searchParams);
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','));
    } else {
      params.delete('categories');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const handleTagsChange = (newTags: number[]) => {
    setSelectedTags(newTags);
    
    const params = new URLSearchParams(searchParams);
    if (newTags.length > 0) {
      params.set('tags', newTags.join(','));
    } else {
      params.delete('tags');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleDateChange = (range: DateRange | undefined) => {

    console.log("Selected date range:", range);
    const params = new URLSearchParams(searchParams);
    if (range?.from && range?.to) {
      params.set('startDate', String(range.from.getTime()));
      params.set('endDate', String(range.to.getTime()));
    }
    else {
      params.delete('startDate');
      params.delete('endDate');
    }
    router.replace(`${pathname}?${params.toString()}`);

  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      <div className="flex items-center space-x-4 mb-6">

        <div className="w-1/5">
          <MultiSelect
            options={categoriesList}
            onValueChange={handleCategoriesChange}
            defaultValue={selectedCategories}
            placeholder="Kategorie"
            variant="inverted"
            maxCount={2}
          />
        </div>
        <div className="w-1/5">
          <MultiSelect
            options={tagsList}
            onValueChange={handleTagsChange}
            defaultValue={selectedTags}
            placeholder="Tags"
            variant="secondary"
            maxCount={2}
          />
        </div>
        <div className="w-1/6">
          <DateRangePicker 
            onChange={handleDateChange} />
        </div>
      </div>

      <div className="space-y-4 max-w-3xl">
        <TasksContainer apiRoute={ApiRoute.TODOS} showTasksDone={true}/>
      </div>
    </div>
  );
}
