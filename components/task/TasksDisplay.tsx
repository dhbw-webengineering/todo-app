'use client'

import { useState, RefObject } from 'react';

import TasksContainer, { TasksContainerRef } from "./TasksContainer";

import { ApiRoute } from "@/ApiRoute";
import { TodoApiResponse } from '@/types/task';


interface TasksDisplayProps {
  header: string,
  day?: number,
  range?: [number, number],
  sendTaskUpdate: (task: TodoApiResponse) => void,
  sendTaskDelete: (task: TodoApiResponse) => void,
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
      <h3 className={"pl-5 mt-[50px] mb-2 text-muted-foreground font-bold"}>{header}</h3>
      <TasksContainer apiRoute={ApiRoute.TODOS} day={day} range={range} setHasData={updateHasData} showTasksDone={false} sendTaskUpdate={sendTaskUpdate} sendTaskDelete={sendTaskDelete} ref={tasksUpdateRef}/>
      </>
    }
    </>
  );
}