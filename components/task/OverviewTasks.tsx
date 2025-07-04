'use client'

import { TodoApiResponse } from "@/types/task";
import TasksDisplay from "./TasksDisplay";
import React, { RefObject, useState } from "react";
import { TasksContainerRef } from "./TasksContainer";
import OverviewDisplaysData from "@/OverviewDisplaysData";
import { Button } from "../ui/button";
import styles from "./OverviewTasks.module.css";


export default function OverviewTasks() {
    const sectionsIdStart = "dashboard-section-";

    const [displaysData, setDisplaysData] = useState<OverviewDisplaysData[]>([
        new OverviewDisplaysData("Heute", [0, 0]),
        new OverviewDisplaysData("Morgen", [1, 1]),
        new OverviewDisplaysData("Nächste 3 Tage", [0, 2]),
        new OverviewDisplaysData("Nächste 7 Tage", [0, 6]),
        new OverviewDisplaysData("In 1 Woche", [7, 13]),
        new OverviewDisplaysData("In 2 Wochen", [14, 20]),
        new OverviewDisplaysData("In 3 Wochen", [21, 27]),
        new OverviewDisplaysData("In 4 Wochen", [28, 34]),
        new OverviewDisplaysData("Nächste 30 Tage", [0, 29])
    ]);

    const updateTask = (task: TodoApiResponse) => {
        displaysData.forEach(entry => {
            entry.containerRef.current?.updateTask(task);
        });
    }

    const deleteTask = (task: TodoApiResponse) => {
        displaysData.forEach(entry => {
            entry.containerRef.current?.deleteTask(task);
        });
    }

    const onDisplayHasDataChanged = (ref: RefObject<TasksContainerRef>, hasData: boolean) => {
        setDisplaysData(prev => prev.map(entry =>
            entry.containerRef === ref
            ? {
                ...entry,
                hasData: hasData
            }
            : entry
        ));
    }

    const scrollToSection = (index: number) => {
        const element = document.getElementById(`${sectionsIdStart}${index}`);
        element?.scrollIntoView({behavior: "smooth"});
    }

    return (
        <>
        <div className={styles.displaysContainer}>
            { displaysData.filter(entry => entry.hasData || entry.hasData === undefined).length === 0 &&
                <p>Keine Daten verfügbar.</p>
            }

            { displaysData.map((entry, index) => 
                <TasksDisplay key={index} scrollId={`${sectionsIdStart}${index}`} header={entry.header} range={entry.range} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={entry.containerRef as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />
            )}
      </div>

        <div className={styles.scrollbarContainer}>
            { displaysData.map((entry, index) =>
                entry.hasData &&
                <Button key={index} variant="outline" className={styles.scrollbarButton} onClick={() => scrollToSection(index)}>
                    {entry.header}
                </Button>
            )}
        </div>
        </>
    );
}