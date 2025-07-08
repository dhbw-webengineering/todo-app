'use client';

import React, { useState, RefObject } from 'react';
import styles from './TasksDisplay.module.css';
import TasksContainer, { TasksContainerRef } from './TasksContainer';
import { TodoApiResponse } from '@/types/task';

interface TasksDisplayProps {
  scrollId: string;
  header: string;
  range?: [number, number];
  sendTaskUpdate: (task: TodoApiResponse) => void;
  sendTaskDelete: (task: TodoApiResponse) => void;
  tasksUpdateRef: RefObject<TasksContainerRef | null>;
  sendHasDataChanged: (ref: RefObject<TasksContainerRef | null>, hasData: boolean) => void;
}

export default function TasksDisplay(props: TasksDisplayProps) {
  const { scrollId, header, range, sendTaskUpdate, sendTaskDelete, tasksUpdateRef, sendHasDataChanged } = props;
  const [hasData, setHasData] = useState(true);

  const updateHasData = (flag: boolean) => {
    setHasData(flag);
    sendHasDataChanged(tasksUpdateRef, flag);
  };

  if (!hasData) return null;

  return (
    <div id={scrollId} className={styles.taskSection}>
      <h3 className={styles.sectionHeader}>{header}</h3>
      <TasksContainer
        ref={tasksUpdateRef}
        range={range}
        setHasData={updateHasData}
        showTasksDone={false}
        sendTaskUpdate={sendTaskUpdate}
        sendTaskDelete={sendTaskDelete}
      />
    </div>
  );
}
