"use client";

import { useState } from "react";
import { TaskCard } from "components/task/TaskCard";
import { Task } from "@/types/task";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MultiSelect } from "@/components/multiselect";
import { Turtle } from "lucide-react";
import { DateRangePicker } from "@/components/dateRangePicker";

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

  const frameworksList = [
    { value: "react", label: "React", icon: Turtle },
    { value: "angular", label: "Angular", icon: Turtle },
    { value: "vue", label: "Vue", icon: Turtle },
    { value: "svelte", label: "Svelte", icon: Turtle },
    { value: "ember", label: "Ember", icon: Turtle },
  ];

  const [selectedKategorie, setSelectedKategorie] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      <div className="flex items-center space-x-4 mb-6">
        
        <div className="w-1/6">
          <MultiSelect
            options={frameworksList}
            onValueChange={setSelectedKategorie}
            defaultValue={selectedKategorie}
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
          <DateRangePicker />
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
