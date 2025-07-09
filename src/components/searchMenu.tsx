"use client"

import { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function SearchMenu() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchTitle, setSearchTitle] = useState<string>(searchParams.get("title") ?? "");
    const [ignorecase, setIgnorecase] = useState<boolean>(searchParams.get("ignorecase") ? !!Number(searchParams.get("ignorecase")) : true);
    const [notDone, setNotDone] = useState<boolean>(searchParams.get("notDone") ? !!Number(searchParams.get("notDone")) : false);


    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            search();
        }
    };

    const isSearchInputInvalid = searchTitle.trim() === "";

    const search = () => {
        if (isSearchInputInvalid) {
            toast.error("Ungültiger Suchbegriff", {
                duration: 3000
            });
            return;
        }

        const params = new URLSearchParams();
        params.set("title", searchTitle.trim());
        params.set("ignorecase", `${Number(ignorecase)}`)
        params.set("notDone", `${Number(notDone)}`)

        router.replace(`${pathname}?${params.toString()}`);
    }


    return (
        <div className="flex-column">
            <div className="flex">
                <Input
                    value={searchTitle}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTitle(e.target.value)}
                    placeholder="Nach Titel suchen"
                    onKeyDown={handleInputKeyDown}
                />
                <Button className="ml-[20px] cursor-pointer" onClick={search} disabled={isSearchInputInvalid}>
                    Suchen
                </Button>
            </div>
            <div className="flex items-center mt-[7px]">
                <Checkbox
                    checked={!ignorecase}
                    onCheckedChange={() => setIgnorecase(!ignorecase)}
                    className="cursor-pointer"
                    id="task-case-sensitive"
                />
                <label htmlFor="task-case-sensitive" className="text-sm ml-[5px]">
                    Groß-/Kleinschreibung beachten
                </label>
            </div>
            <div className="flex items-center mt-[2px]">
                <Checkbox
                    checked={notDone}
                    onCheckedChange={() => setNotDone(!notDone)}
                    className="cursor-pointer"
                    id="task-completed"
                />
                <label htmlFor="task-completed" className="text-sm ml-[5px]">
                    Abgeschlossene ausblenden
                </label>
            </div>
        </div>
    );
}