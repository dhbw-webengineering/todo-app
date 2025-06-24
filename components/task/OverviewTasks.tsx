'use client'

import { Task } from "@/types/Task";
import TasksDisplay from "./TasksDisplay";
import React, { createRef, Ref, RefObject, useState } from "react";
import { TasksContainerRef } from "./TasksContainer";


export default function OverviewTasks() {

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

    function updateTask(task: Task) {
        taskListRefs.forEach(entry => {
            entry[0].current?.updateTask(task);
        });
    }

    function deleteTask(task: Task) {
        taskListRefs.forEach(entry => {
            entry[0].current?.deleteTask(task);
        });
    }

    function onDisplayHasDataChanged(ref: RefObject<TasksContainerRef>, hasData: boolean) {
        setTaskListRefs(prev => prev.map(entry => entry[0] === ref ? [entry[0], hasData] : entry));
    }
    
    return (
        <>

        {taskListRefs.filter(entry => entry[1]).length === 0 &&
            <p>Keine Daten verfügbar.</p>}
        
        <TasksDisplay header="Heute" day={0} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[0][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />
        
        <TasksDisplay header="Morgen" day={1} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[1][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />

        <TasksDisplay header="Nächste 3 Tage" range={[0, 2]} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[2][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />

        <TasksDisplay header="Nächste 7 Tage" range={[0, 6]} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[3][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />

        <TasksDisplay header="In 1 Woche" range={[7, 13]} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[4][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />

        <TasksDisplay header="In 2 Wochen" range={[14, 20]} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[5][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />

        <TasksDisplay header="In 3 Wochen" range={[21, 27]} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[6][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />

        <TasksDisplay header="In 4 Wochen" range={[28, 34]} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[7][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />

        <TasksDisplay header="Nächste 30 Tage" range={[0, 29]} sendTaskUpdate={updateTask} sendTaskDelete={deleteTask} tasksUpdateRef={taskListRefs[8][0] as RefObject<TasksContainerRef>} sendHasDataChanged={onDisplayHasDataChanged} />
        
        </>
    );
}