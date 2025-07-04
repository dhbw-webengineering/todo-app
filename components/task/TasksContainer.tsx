'use client';


import { useState, useEffect, SetStateAction, useImperativeHandle, forwardRef, Ref } from 'react';
import { TaskCard } from "./TaskCard";

import { ApiRoute } from "@/ApiRoute";
import { TodoApiEdit, TodoApiResponse } from "@/types/task";
import { deleteTodoApi, loadTodosApi, updateTodoApi } from "TasksAPI";
import { useSearchParams } from 'next/navigation'; // App Router

export type TasksContainerRef = {
  updateTask: (task: TodoApiResponse) => void;
  deleteTask: (task: TodoApiResponse) => void;
};

interface TasksContainerProps {
  apiRoute: ApiRoute;
  range?: [number, number];
  setHasData?: (hasData: boolean) => void;
  showTasksDone: boolean;
  sendTaskUpdate?: (task: TodoApiResponse) => void;
  sendTaskDelete?: (task: TodoApiResponse) => void;
  onTagsChanged?: () => void;
}

function TasksContainer(props: TasksContainerProps, ref: Ref<TasksContainerRef>) {
  const {range, setHasData, showTasksDone, sendTaskUpdate, sendTaskDelete, onTagsChanged} = props;
  const [tasks, setTasks] = useState<TodoApiResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useImperativeHandle(ref, () => ({
    updateTask,
    deleteTask
  }));

  // Initiales Laden der Tasks mit Fehlerbehandlung
  useEffect(() => {
    const fetchInitialTasks = async () => {
      const params = new URLSearchParams(searchParams);

      if (range !== undefined) {
        const start = new Date();
        start.setDate(start.getDate() + range[0]);
        const end = new Date();
        end.setDate(end.getDate() + range[1]);

        params.set("from", start.toISOString());
        params.set("to", end.toISOString());
      }

      loadTodosApi(
        data => updateTasks(data),
        () => setFetchError("Fehler beim Laden der Aufgaben."),
        () => setLoading(false),
        params
      );
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
    const editData: TodoApiEdit = {
      ...task,
      tags: task.tags ?
        task.tags.map((tag) => tag.name.trim()).filter(Boolean)
        : undefined,
    };
    updateTodoApi(editData);
  }

  // update task inside this Container
  const updateTask = (task: TodoApiResponse) => {
    modifyTaskAndSetHasData(
      task,
      task.completedAt ? -1 : 1,
      () => {
        updateTasks(prevTasks => prevTasks.map(oldTask =>
          oldTask.id === task.id ? task : oldTask
        ));
      }
    );
  }

  const sendOrDeleteTask = async (task: TodoApiResponse) => {
    if (sendTaskDelete !== undefined) {
      sendTaskDelete(task);
    } else {
      deleteTask(task);
    }
    await deleteTodoApi(task.id);
    if (onTagsChanged) {
      onTagsChanged();
    }
  }

  // delete task inside this Container
  const deleteTask = (task: TodoApiResponse) => {
    modifyTaskAndSetHasData(
      task,
      -1,
      () => setTasks(prevTasks => prevTasks.filter(oTask => oTask.id !== task.id))
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


  if (loading) return <div className={"text-center text-lg mt-12"}>Loading tasks...</div>;
  if (error) return <div className={"text-center text-lg mt-12"}>Error: {error}</div>;

  return (
      <div className={"grid gap-5"}>
          {sortedTasks.map((task: TodoApiResponse) => (
                    <TaskCard 
                    onDelete={() => sendOrDeleteTask(task)} 
                    onUpdate={sendOrUpdateTask} 
                    key={task.id} 
                    task={task} 
                    onTagsChanged={onTagsChanged} 
                    />
                  ))}
      </div>
  );
};

export default forwardRef(TasksContainer);