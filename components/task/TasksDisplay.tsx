'use client'

import { useState, Ref, RefObject } from 'react';

import styles from "./TasksDisplay.module.css";

import TasksContainer, { TasksContainerRef } from "./TasksContainer";

import { ApiRoute } from "@/ApiRoute";
import { Task } from '@/types/Task';


interface TasksDisplayProps {
  header: string,
  day?: number,
  range?: [number, number],
  sendTaskUpdate: (task: Task) => void,
  sendTaskDelete: (task: Task) => void,
  tasksUpdateRef: RefObject<TasksContainerRef>,
  sendHasDataChanged: (ref: RefObject<TasksContainerRef>, hasData: boolean) => void;
}

export default function TasksDisplay(props: TasksDisplayProps) {
  const { header, day, range, sendTaskUpdate, sendTaskDelete, tasksUpdateRef, sendHasDataChanged } = props;
  const [hasData, setHasData] = useState(true);

  const updateHasData = (hasData: boolean) => {
    setHasData(hasData);
    sendHasDataChanged(tasksUpdateRef, hasData);
  }

  return (
    <>
    { hasData &&
      <>
      <h3 className={styles.timeDisplay}>{header}</h3>
      <TasksContainer apiRoute={ApiRoute.ENTRY_LIST_NEXT} day={day} range={range} setHasData={updateHasData} showTasksDone={false} sendTaskUpdate={sendTaskUpdate} sendTaskDelete={sendTaskDelete} ref={tasksUpdateRef}/>
      </>
    }
    </>
  );
}