"use client";

import { useState } from "react";
import { TaskCard } from "components/task/TaskCard";
import { MultiSelect } from "@/components/multiselect";
import { Task } from "@/types/task";
import { Turtle } from "lucide-react";
import { DateRangePicker } from "@/components/dateRangePicker";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';



const initialTasks: Task[] = [
  {
    eintragID: "1",
    titel: "React-Komponenten bauen",
    beschreibung: "Task-UI mit shadcn/ui gestalten",
    faelligkeit: "2025-06-01",
    abgeschlossen: null,
    created_at: "2025-05-18T12:00:00Z",
    updated_at: "2025-05-18T12:00:00Z",
    kategorie: { name: "Entwicklung" },
    tags: [
      { tagID: "a", name: "Frontend" },
      { tagID: "b", name: "UI" },
    ],
  },
  {
    eintragID: "2",
    titel: "API anbinden",
    beschreibung: "Daten vom Express-Backend laden",
    faelligkeit: "2025-06-05",
    abgeschlossen: "2025-05-19T08:00:00Z",
    created_at: "2025-05-18T12:00:00Z",
    updated_at: "2025-05-19T08:00:00Z",
    kategorie: { name: "Backend" },
    tags: [{ tagID: "c", name: "API" }],
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);

  const handleUpdate = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.eintragID === updatedTask.eintragID ? updatedTask : task
      )
    );
  };

  const toggleErledigt = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.eintragID === id
          ? {
            ...task,
            abgeschlossen: task.abgeschlossen
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

    // Query-Parameter aktualisieren  
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

    // Query-Parameter aktualisieren  
    const params = new URLSearchParams(searchParams);
    if (newTags.length > 0) {
      params.set('tags', newTags.join(','));
    } else {
      params.delete('tags');
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
            onChange={(range) => console.log(range)} />
        </div>
      </div>

      <div className="space-y-4 max-w-3xl">
        {tasks.map((task) => (
          <TaskCard
            key={task.eintragID}
            task={task}
            onToggle={toggleErledigt}
            onUpdate={handleUpdate}
            onDelete={(id) =>
              setTasks((prev) => prev.filter((task) => task.eintragID !== id))
            }
          />
        ))}
      </div>
    </div>
  );
}
