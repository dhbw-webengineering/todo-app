import { createRef, RefObject } from "react"
import { TasksContainerRef } from "./components/task/TasksContainer"

export default class OverviewDisplaysData {
    containerRef: RefObject<TasksContainerRef | null> = createRef<TasksContainerRef>();
    hasData: boolean | undefined = undefined;
    header: string;
    range: [number, number];

    constructor(header: string, range: [number, number]) {
        this.header = header;
        this.range = range;
    }
}