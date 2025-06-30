'use client';

import styles from "./TasksContainer.module.css";

import { useState, useEffect, Dispatch, SetStateAction, useImperativeHandle, forwardRef, Ref } from 'react';
import { TaskCard } from "./TaskCard";

import { ApiRoute } from "@/ApiRoute";
import { TodoApiEdit, TodoApiResponse } from "@/types/task";
import { toast } from "sonner";

export type TasksContainerRef = {
  updateTask: (task: TodoApiResponse) => void;
  deleteTask: (task: TodoApiResponse) => void;
};

interface TasksContainerProps {
  apiRoute: ApiRoute;
  day?: number;
  range?: [number, number];
  setHasData?: (hasData: boolean) => void;
  showTasksDone: boolean;
  sendTaskUpdate?: (task: TodoApiResponse) => void;
  sendTaskDelete?: (task: TodoApiResponse) => void;
}

function TasksContainer(props: TasksContainerProps, ref: Ref<TasksContainerRef>) {
  const {apiRoute, day, range, setHasData, showTasksDone, sendTaskUpdate, sendTaskDelete} = props;
  const [tasks, setTasks] = useState<TodoApiResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    updateTask,
    deleteTask
  }));

  // Initiales Laden der Tasks mit Fehlerbehandlung
  useEffect(() => {
    const fetchInitialTasks = async () => {
      let start = 0;
      let end = 0;
      if (day !== undefined) {
        start = end = day;
      }
      if (range !== undefined) {
        start = range?.[0];
        end = range?.[1];
      }

      try {
        const response = await fetch("http://localhost:3001/todos", { credentials: "include" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: TodoApiResponse[] = await response.json();
        updateTasks(data);
      } catch (error) {
        setFetchError("Fehler beim Laden der Aufgaben.");
        toast.error("Fehler beim Laden der Aufgaben", {
          description: error instanceof Error ? error.message : "Unbekannter Fehler",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInitialTasks();
  }, []);

  const updateTasks = (newTasks: SetStateAction<TodoApiResponse[]>) => {
    setTasks(newTasks);
    if (setHasData !== undefined) {
      setHasData(newTasks.length > 0);
    }
  }

  const sendOrUpdateTask = (task: TodoApiResponse) => {
    if (sendTaskUpdate !== undefined) {
      sendTaskUpdate(task);
    } else {
      updateTask(task);
    }
  }

  const updateTask = (task: TodoApiResponse) => {
    modifyTaskAndSetHasData(
      task,
      task.completedAt ? -1 : 1,
      async () => {
        const editData: TodoApiEdit = {
          id: task.id,
          title: task.title,
          dueDate: task.dueDate,
          description: task.description,
          categoryId: task.categoryId,
          tags: task.tags ?
            task.tags.map((tag) => tag.name.trim()).filter(Boolean)
            : undefined,
          completedAt: task.completedAt
        };
        const response = await fetch(`http://localhost:3001/todos/${task.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editData),
          credentials: "include",
        });
        if (!response.ok) throw new Error("Fehler beim Aktualisieren");
        updateTasks(prevTasks => prevTasks.map(oldTask =>
          oldTask.id === task.id ? task : oldTask
        ));
      }
    );
  }

  const sendOrDeleteTask = (task: TodoApiResponse) => {
    if (sendTaskDelete !== undefined) {
      sendTaskDelete(task);
    } else {
      deleteTask(task);
    }
  }

  const deleteTask = (task: TodoApiResponse) => {
    modifyTaskAndSetHasData(
      task,
      -1,
      async () => {
        try {
          const response = await fetch(`http://localhost:3001/todos/${task.id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!response.ok) throw new Error("Fehler beim Löschen im Backend.");
          setTasks(prevTasks => prevTasks.filter(oTask => oTask.id !== task.id));
        } catch (error) {
          toast.error("Fehler beim Löschen der Aufgabe", {
            duration: 3000,
            description: error instanceof Error ? error.message : "Unbekannter Fehler",
          });
        }
      }
    );
  }

  const modifyTaskAndSetHasData = (task: TodoApiResponse, increaseValue: number, runnable: () => void) => {
    let count = tasks.filter(cTask => !cTask.completedAt).length;
    if (tasks.filter(fTask => fTask.id === task.id).length !== 1) {
      return;
    }
    count += increaseValue;

    runnable();

    if (setHasData !== undefined && count === 0) {
      setHasData(false);
    }
  }

  const filteredTasks = showTasksDone ? tasks : [...tasks].filter(task => !task.completedAt);

  // Sort tasks: offene tasks zuerst, dabei frühestes fälligkeitsdatum zuerst
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if ((a.completedAt === null) !== (b.completedAt === null)) {
      return a.completedAt ? 1 : -1;
    }
    if (a.dueDate === undefined) {
      return -1;
    }
    if (b.dueDate === undefined) {
      return 1;
    }
    return new Date(a.dueDate).getDate() - new Date(b.dueDate).getDate();
  });


  if (loading) return <div className={styles.loading}>Loading tasks...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
      <div className={styles.taskList}>
          {sortedTasks.map((task: TodoApiResponse) => (
                    <TaskCard onDelete={() => sendOrDeleteTask(task)} onUpdate={sendOrUpdateTask} key={task.id} task={task} />
                  ))}
      </div>
  );
};

export default forwardRef(TasksContainer);