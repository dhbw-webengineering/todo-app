'use client'

import { TodoApiResponse } from "@/types/task";
import TasksDisplay from "./TasksDisplay";
import React, { createRef, RefObject, useState } from "react";
import { TasksContainerRef } from "./TasksContainer";
import { Button } from "../ui/button";
import styles from "./OverviewTasks.module.css";


export default function OverviewTasks() {
    const sectionsIdStart = "dashboard-section-";

    // boolean: hasData
    const [taskListRefs, setTaskListRefs] = useState<[RefObject<TasksContainerRef | null>, boolean | undefined][]>([
        [createRef<TasksContainerRef>(), undefined],
        [createRef<TasksContainerRef>(), undefined],
        [createRef<TasksContainerRef>(), undefined],
        [createRef<TasksContainerRef>(), undefined],
        [createRef<TasksContainerRef>(), undefined],
        [createRef<TasksContainerRef>(), undefined],
        [createRef<TasksContainerRef>(), undefined],
        [createRef<TasksContainerRef>(), undefined],
        [createRef<TasksContainerRef>(), undefined]
    ]);

    const headers = [
        "Heute",
        "Morgen",
        "Nächste 3 Tage",
        "Nächste 7 Tage",
        "In 1 Woche",
        "In 2 Wochen",
        "In 3 Wochen",
        "In 4 Wochen",
        "Nächste 30 Tage"
    ];

    const updateTask = (task: TodoApiResponse) => {
        taskListRefs.forEach(entry => {
            entry[0].current?.updateTask(task);
        });
    }

    const deleteTask = (task: TodoApiResponse) => {
        taskListRefs.forEach(entry => {
            entry[0].current?.deleteTask(task);
        });
    }

    const onDisplayHasDataChanged = (ref: RefObject<TasksContainerRef>, hasData: boolean) => {
        setTaskListRefs(prev => prev.map(entry => entry[0] === ref ? [entry[0], hasData] : entry));
    }

    const scrollToSection = (index: number) => {
        const element = document.getElementById(`${sectionsIdStart}${index}`);
        element?.scrollIntoView({behavior: "smooth"});
    }

    //TODO: use right styles file/seperate style
    return (
        <>
        <div className={`${styles.displaysContainer} space-x-4 mb-6`}>
            { taskListRefs.filter(entry => entry[1] || entry[1] === undefined).length === 0 &&
                <p>Keine Daten verfügbar.</p>
            }

            <TasksDisplay scrollId={`${sectionsIdStart}0`} header={headers[0]} day={0} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[0][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />
            
            <TasksDisplay scrollId={`${sectionsIdStart}1`} header={headers[1]} day={1} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[1][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />

            <TasksDisplay scrollId={`${sectionsIdStart}2`} header={headers[2]} range={[0, 2]} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[2][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />

            <TasksDisplay scrollId={`${sectionsIdStart}3`} header={headers[3]} range={[0, 6]} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[3][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />

            <TasksDisplay scrollId={`${sectionsIdStart}4`} header={headers[4]} range={[7, 13]} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[4][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />

            <TasksDisplay scrollId={`${sectionsIdStart}5`} header={headers[5]} range={[14, 20]} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[5][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />

            <TasksDisplay scrollId={`${sectionsIdStart}6`} header={headers[6]} range={[21, 27]} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[6][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />

            <TasksDisplay scrollId={`${sectionsIdStart}7`} header={headers[7]} range={[28, 34]} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[7][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />

            <TasksDisplay scrollId={`${sectionsIdStart}8`} header={headers[8]} range={[0, 29]} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[8][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />
        </div>

        <div className={styles.scrollbarContainer}>
            { taskListRefs.filter(entry => entry[1]).map((entry, index) =>
                <Button key={index} variant="outline" className={styles.scrollbarButton} onClick={() => scrollToSection(index)}>
                    {headers[index]}
                </Button>)
            }
        </div>
        </>
    );
}