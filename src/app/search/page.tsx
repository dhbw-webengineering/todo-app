"use client"

import SearchMenu from "@/src/components/searchMenu";
import TasksContainer from "@/src/components/task/TasksContainer";
import { ApiRoute } from "@/src/utils/ApiRoute";
import { Suspense } from "react";
import { useState } from "react";

export default function SearchPage() {
    const [hasData, setHasData] = useState<boolean>(true);

    return (
        <div className="p-6 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Suche</h1>
            <Suspense>
                <SearchMenu />
            </Suspense>
            <div className="mt-[30px]">
                { !hasData &&
                    <p className="ml-3">{`Keine Ergebnisse zur Suche gefunden.`}</p>
                }
                <Suspense>
                    <TasksContainer
                        apiRoute={ApiRoute.SEARCH}
                        showTasksDone={true}
                        setHasData={setHasData}
                    />
                </Suspense>
            </div>
        </div>
    );
}