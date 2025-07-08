'use client'

import { useState, RefObject } from 'react';

import styles from "./TasksDisplay.module.css";

import TasksContainer, { TasksContainerRef } from "./TasksContainer";

import { ApiRoute } from "@/ApiRoute";
import { TodoApiResponse } from '@/types/task';


interface TasksDisplayProps {
  scrollId: string,
  header: string,
  range?: [number, number],
  sendTaskUpdate: (task: TodoApiResponse) => void,
  sendTaskDelete: (task: TodoApiResponse) => void,
  tasksUpdateRef: RefObject<TasksContainerRef>,
  sendHasDataChanged: (ref: RefObject<TasksContainerRef>, hasData: boolean) => void;
}

export default function TasksDisplay(props: TasksDisplayProps) {
  const {scrollId, header, range, sendTaskUpdate, sendTaskDelete, tasksUpdateRef, sendHasDataChanged } = props;
  const [hasData, setHasData] = useState(true);

  const updateHasData = (hasData: boolean) => {
    setHasData(hasData);
    sendHasDataChanged(tasksUpdateRef, hasData);
  }

  return (
    <>
    { hasData &&
      <>
      <h3 id={scrollId} className={styles.timeDisplay}>{header}</h3>
      <TasksContainer range={range} setHasData={updateHasData} showTasksDone={false} sendTaskUpdate={sendTaskUpdate} sendTaskDelete={sendTaskDelete} ref={tasksUpdateRef}/>
      </>
    }
    </>
  );
}