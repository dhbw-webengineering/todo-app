'use client'
import { useCallback, useEffect, useState } from 'react'
import { useTasks } from '@/src/state/useTasks'
import { Button } from '@/src/components/ui/button'
import { TaskCard } from '@/src/components/task/TaskCard'
import { ApiRoute } from '@/src/utils/ApiRoute'
import { useSidebar } from '../ui/sidebar'
import clsx from 'clsx'

type Section = {
    header: string
    range: [number | undefined, number]
}

const SECTIONS: Section[] = [
    { header: 'Überfällig', range: [undefined, -1] },
    { header: 'Heute', range: [0, 0] },
    { header: 'Morgen', range: [1, 1] },
    { header: 'Nächste 3 Tage', range: [0, 2] },
    { header: 'Nächste 7 Tage', range: [0, 6] },
    { header: 'Nächste Woche', range: [7, 13] },
    { header: 'Nächste 31 Tage', range: [0, 30] },
]

export default function Dashboard() {
    const { tasks, loading, error, updateTask: updateHook, deleteTask: deleteHook } = useTasks(ApiRoute.TODOS, new URLSearchParams(), false)
    const [active, setActive] = useState<boolean[]>(SECTIONS.map(() => true))
    const { open } = useSidebar()

    const inRange = useCallback((dueDate: string, [from, to]: [number | undefined, number]) => {
        const today = new Date(new Date().setHours(0, 0, 0, 0));

        const d = new Date(new Date(dueDate).setHours(0, 0, 0, 0));
        const diff = Math.floor((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return (from === undefined || diff >= from) && diff <= to;
    }, [])

    const scrollTo = (i: number) => {
        document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (!loading && !error) {
            setActive(SECTIONS.map(sec =>
                tasks.some(t => t.dueDate && inRange(t.dueDate, sec.range))
            ))
        }
    }, [tasks, loading, error, inRange])

    return (
        <div className="p-6 pr-0 lg:pr-48">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex flex-col w-full mb-10 lg:mb-0">
                {loading && <p>Lade alle Aufgaben…</p>}
                {error && <p className="text-red-600">Fehler: {error}</p>}

                {!loading && !error && SECTIONS.map((sec, i) => {
                    const filtered = tasks.filter(t => t.dueDate && inRange(t.dueDate, sec.range))

                    return (
                        filtered.length > 0 && (
                            <section key={i} id={`section-${i}`}>
                                <h2 className="text-xl font-semibold mt-8 mb-4">{sec.header}</h2>

                                <div className="space-y-4">
                                    {filtered
                                        .sort((a, b) => {
                                            const ac = !!a.completedAt, bc = !!b.completedAt;
                                            if (ac !== bc) return ac ? 1 : -1;
                                            if (!a.dueDate || !b.dueDate) return a.dueDate ? -1 : b.dueDate ? 1 : 0;
                                            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                                        })
                                        .map(task => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                onUpdate={task => updateHook(task)}
                                                onDelete={id => deleteHook(String(id))}
                                            />
                                        ))}
                                </div>
                            </section>
                        )
                    )
                })}
            </div>
            <div
                className={clsx(
                    "w-full fixed bottom-0 h-fit flex flex-wrap gap-2 justify-center px-2 left-0 bg-zinc-900 p-1",
                    open ? "md:left-[var(--sidebar-width)]" : "md:left-0",
                    open ? "md:w-[calc(100%-var(--sidebar-width))]" : "",
                    "lg:w-auto lg:bottom-3 lg:right-0 lg:justify-end lg:overflow-visible lg:flex-col lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:pr-5 lg:left-auto lg:bg-transparent"
                )}

            >
                {SECTIONS.map((sec, i) =>
                    active[i] && (
                        <Button
                            key={i}
                            variant="outline"
                            className="flex-shrink-0 cursor-pointer"
                            onClick={() => scrollTo(i)}
                        >
                            {sec.header}
                        </Button>
                    )
                )}
            </div>

        </div>
    )
}
