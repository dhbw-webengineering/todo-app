'use client';

import React, { useState, useRef, RefObject } from 'react';
import { TodoApiResponse } from '@/types/task';
import { Button } from '@/components/ui/button';
import TasksDisplay from './TasksDisplay';
import styles from './OverviewTasks.module.css';
import { TasksContainerRef } from './TasksContainer';

interface DisplayData {
  header: string;
  range: [number, number];
  containerRef: RefObject<TasksContainerRef | null>;
  hasData: boolean | undefined;
}

export default function OverviewTasks() {
  const sectionsIdStart = 'dashboard-section-';

  const [displaysData, setDisplaysData] = useState<DisplayData[]>([
    { header: 'Heute',          range: [0, 0],    containerRef: useRef<TasksContainerRef | null>(null), hasData: undefined },
    { header: 'Morgen',         range: [1, 1],    containerRef: useRef<TasksContainerRef | null>(null), hasData: undefined },
    { header: 'Nächste 3 Tage', range: [0, 2],    containerRef: useRef<TasksContainerRef | null>(null), hasData: undefined },
    { header: 'Nächste 7 Tage', range: [0, 6],    containerRef: useRef<TasksContainerRef | null>(null), hasData: undefined },
    { header: 'In 1 Woche',     range: [7, 13],   containerRef: useRef<TasksContainerRef | null>(null), hasData: undefined },
    { header: 'In 2 Wochen',    range: [14, 20],  containerRef: useRef<TasksContainerRef | null>(null), hasData: undefined },
    { header: 'In 3 Wochen',    range: [21, 27],  containerRef: useRef<TasksContainerRef | null>(null), hasData: undefined },
    { header: 'In 4 Wochen',    range: [28, 34],  containerRef: useRef<TasksContainerRef | null>(null), hasData: undefined },
    { header: 'Nächste 30 Tage',range: [0, 29],   containerRef: useRef<TasksContainerRef | null>(null), hasData: undefined },
  ]);

  const updateTask = (task: TodoApiResponse) => {
    displaysData.forEach(entry => entry.containerRef.current!.updateTask(task));
  };

  const deleteTask = (task: TodoApiResponse) => {
    displaysData.forEach(entry => entry.containerRef.current!.deleteTask(task));
  };

  const onDisplayHasDataChanged = (
    ref: RefObject<TasksContainerRef | null>,
    hasData: boolean
  ) => {
    setDisplaysData(prev =>
      prev.map(entry =>
        entry.containerRef === ref
          ? { ...entry, hasData }
          : entry
      )
    );
  };

  const scrollToSection = (index: number) => {
    const el = document.getElementById(`${sectionsIdStart}${index}`);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className={styles.quickJump}>
        {displaysData.filter(e => e.hasData || e.hasData === undefined).length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Keine Daten verfügbar.
          </div>
        )}
        {displaysData.map((entry, i) => (
          <Button
            key={i}
            variant="outline"
            size="sm"
            onClick={() => scrollToSection(i)}
            disabled={!entry.hasData}
            className={entry.hasData ? '' : 'opacity-50'}
          >
            {entry.header}
          </Button>
        ))}
      </div>

      <div className={styles.tasksContainer}>
        {displaysData.map((entry, i) =>
          entry.hasData && (
            <TasksDisplay
              key={i}
              scrollId={`${sectionsIdStart}${i}`}
              header={entry.header}
              range={entry.range}
              sendTaskUpdate={updateTask}
              sendTaskDelete={deleteTask}
              tasksUpdateRef={entry.containerRef}
              sendHasDataChanged={onDisplayHasDataChanged}
            />
          )
        )}
      </div>
    </>
  );
}
