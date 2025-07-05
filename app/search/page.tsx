"use client"

import { ApiRoute } from "@/ApiRoute";
import SearchMenu from "@/components/searchMenu";
import TasksContainer from "@/components/task/TasksContainer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchPage() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [hasData, setHasData] = useState<boolean>(true);

    const onSearch = async (title: string, ignorecase: boolean) => {
        router.replace(`${pathname}?title=${title}&ignorecase=${ignorecase ? 1 : 0}`);
    }

    return (
        <div className="p-6 max-w-3xl">
            <SearchMenu onSearch={onSearch} />
            <div className="mt-[30px]">
                { !hasData &&
                    <p className="ml-3">{`Keine Ergebnisse zur Suche \"${searchParams.get("title")}\" gefunden.`}</p>
                }
                { searchParams.has("title") &&
                    <TasksContainer
                        apiRoute={ApiRoute.SEARCH} 
                        showTasksDone={true}
                        setHasData={setHasData}
                    />
                }
            </div>
        </div>
    );
}