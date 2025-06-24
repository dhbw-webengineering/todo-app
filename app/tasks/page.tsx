"use client";

import { useState } from "react";
import { MultiSelect } from "@/components/multiselect";
import { Turtle } from "lucide-react";
import { DateRangePicker } from "@/components/dateRangePicker";
import TasksContainer from "@/components/task/TasksContainer";
import { ApiRoute } from "@/ApiRoute";
import { DateRange } from "react-day-picker";

export default function TasksPage() {

  const frameworksList = [
    { value: 0, label: "React", icon: Turtle },
    { value: 1, label: "Angular", icon: Turtle },
    { value: 2, label: "Vue", icon: Turtle },
    { value: 3, label: "Svelte", icon: Turtle },
    { value: 4, label: "Ember", icon: Turtle },
  ];

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      <div className="flex items-center space-x-4 mb-6">
        
        <div className="w-1/6">
          <MultiSelect
            options={frameworksList}
            onValueChange={setSelectedCategories}
            defaultValue={selectedCategories}
            placeholder="Kategorie"
            variant="inverted"
            maxCount={2}
          />
        </div>
        <div className="w-1/6">
          <MultiSelect
            options={frameworksList}
            onValueChange={setSelectedTags}
            defaultValue={selectedTags}
            placeholder="Tags"
            variant="secondary"
            maxCount={2}
          />
        </div>
        <div className="w-1/6">
          <DateRangePicker 
            onChange={(range: DateRange | undefined) => console.log(range)} />
        </div>
      </div>

      <div className="space-y-4 max-w-3xl">
        <TasksContainer apiRoute={ApiRoute.ENTRY_LIST} showTasksDone={true}/>
      </div>
    </div>
  );
}
