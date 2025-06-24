'use client';

import styles from "./TasksContainer.module.css";

import { useState, useEffect, Dispatch, SetStateAction, useImperativeHandle, forwardRef, Ref } from 'react';
import { TaskCard } from "./TaskCard";

import { ApiRoute } from "@/ApiRoute";
import { Task, TaskForJson } from "@/types/Task";
import moment from "moment";

export type TasksContainerRef = {
  updateTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
};

interface TasksContainerProps {
  apiRoute: ApiRoute;
  day?: number;
  range?: [number, number];
  setHasData?: (hasData: boolean) => void;
  showTasksDone: boolean;
  sendTaskUpdate?: (task: Task) => void;
  sendTaskDelete?: (task: Task) => void;
}

function TasksContainer(props: TasksContainerProps, ref: Ref<TasksContainerRef>) {
  const {apiRoute, day, range, setHasData, showTasksDone, sendTaskUpdate, sendTaskDelete} = props;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    updateTask,
    deleteTask
  }));

  useEffect(() => {
    async function fetchTasks() {
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
        const query = (apiRoute == ApiRoute.ENTRY_LIST_NEXT) ? `${apiRoute}?start=${start}&end=${end}` : apiRoute;
        const response = await fetch(query);
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        const dataForJson: TaskForJson[] = await response.json();
        const data: Task[] = dataForJson.map(entry => {
          return {
            ...entry,
            dueDate: entry.dueDate !== undefined ? moment(entry.dueDate * 1000) : undefined
          }
        });
        updateTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const updateTasks = (newTasks: SetStateAction<Task[]>) => {
    setTasks(newTasks);
    if (setHasData !== undefined) {
      setHasData(newTasks.length > 0);
    }
  }

  const sendOrUpdateTask = (task: Task) => {
    if (sendTaskUpdate !== undefined) {
      sendTaskUpdate(task);
    } else {
      updateTask(task);
    }
  }

  const updateTask = (task: Task) => {
    modifyTaskAndSetHasData(
      task,
      task.done ? -1 : 1,
      () => {
        updateTasks(prevTasks => prevTasks.map(oldTask =>
          oldTask.id === task.id ? task : oldTask
        ));
      }
    );
  }

  const sendOrDeleteTask = (task: Task) => {
    if (sendTaskDelete !== undefined) {
      sendTaskDelete(task);
    } else {
      deleteTask(task);
    }
  }

  const deleteTask = (task: Task) => {
    modifyTaskAndSetHasData(
      task,
      -1,
      () => {
        setTasks(oldTasks => oldTasks.filter(oTask => oTask.id !== task.id));
      }
    );
  }

  const modifyTaskAndSetHasData = (task: Task, increaseValue: number, runnable: () => void) => {
    let count = tasks.filter(cTask => !cTask.done).length;
    if (tasks.filter(fTask => fTask.id === task.id).length !== 1) {
      return;
    }
    count += increaseValue;

    runnable();

    if (setHasData !== undefined && count === 0) {
      setHasData(false);
    }
  }

  const filteredTasks = showTasksDone ? tasks : [...tasks].filter(task => !task.done);

  // Sort tasks: offene tasks zuerst, dabei frühestes fälligkeitsdatum zuerst
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.done !== b.done) {
      return a.done ? 1 : -1;
    }
    if (a.dueDate === undefined) {
      return -1;
    }
    if (b.dueDate === undefined) {
      return 1;
    }
    return a.dueDate.toDate().getDate() - b.dueDate.toDate().getDate();
  });


  if (loading) return <div className={styles.loading}>Loading tasks...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
      <div className={styles.taskList}>
          {sortedTasks.map((task: Task) => (
                    <TaskCard onDelete={() => sendOrDeleteTask(task)} onUpdate={sendOrUpdateTask} key={task.id} task={task} />
                  ))}
      </div>
  );
};

export default forwardRef(TasksContainer);