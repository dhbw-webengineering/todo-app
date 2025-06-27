"use client";

import { useState } from "react";
import { TaskCard } from "components/task/TaskCard";
import { MultiSelect } from "@/components/multiselect";
import { TOdoApiResponse } from "@/types/task";
import { Turtle } from "lucide-react";
import { DateRangePicker } from "@/components/dateRangePicker";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { DateRange } from "react-day-picker";



const initialTasks: TOdoApiResponse[] = [
  {
    id: 1,
    userId: 2,
    title: "Justin muss Eier lecken",
    description: "Leck Eier\n",
    dueDate: "2025-07-03T17:00:00.000Z",
    categoryId: 2,
    completedAt: null,
    createdAt: "2025-07-03T17:00:00.000Z",
    updatedAt: "2025-07-03T17:00:00.000Z",
    category: {
      id: 2,
      userId: 4,
      name: "Allgemein"
    },
    tags: [
      {
        id: 3,
        name: "tag1"
      },
      {
        id: 1,
        name: "tag3"
      }
    ]
  }
]

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);

  const handleUpdate = (updatedTask: TOdoApiResponse) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const toggleErledigt = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === Number (id)
          ? {
            ...task,
            abgeschlossen: task.completedAt
              ? null
              : new Date().toISOString(),
          }
          : task
      )
    );
  };

  const categorielist = [
    { value: "Kategorie1", label: "Kategorie1", icon: Turtle },
    { value: "Kategorie2", label: "Kategorie2", icon: Turtle },
    { value: "Kategorie3", label: "Kategorie3", icon: Turtle },
  ];
  const taglsit = [
    { value: "Tag1", label: "Tag1", icon: Turtle },
    { value: "Tag2", label: "Tag2", icon: Turtle },
    { value: "Tag3", label: "Tag3", icon: Turtle }
  ];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCategorie, setSelectedCategorie] = useState<string[]>([]);

  const handleCategoriesChange = (newCategories: string[]) => {
    setSelectedCategorie(newCategories);
  
    const params = new URLSearchParams(searchParams);
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','));
    } else {
      params.delete('categories');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagsChange = (newTags: string[]) => {
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
            options={categorielist}
            onValueChange={handleCategoriesChange}
            defaultValue={selectedCategorie}
            placeholder="Kategorie"
            variant="inverted"
            maxCount={2}
          />
        </div>
        <div className="w-1/5">
          <MultiSelect
            options={taglsit}
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
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={toggleErledigt}
            onUpdate={handleUpdate}
            onDelete={(id) =>
              setTasks((prev) => prev.filter((task) => task.id !== id))
            }
          />
        ))}
      </div>
    </div>
  );
}
