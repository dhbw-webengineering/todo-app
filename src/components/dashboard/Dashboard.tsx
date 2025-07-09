'use client'
import React from 'react'
import { useTasks } from '@/src/state/useTasks'
import { useTaskQuery } from '@/src/state/TaskQueryContext'
import { Button } from '@/src/components/ui/button'
import { TaskCard } from '@/src/components/task/TaskCard'

type Section = {
    header: string
    range: [number | undefined, number]
}

const SECTIONS: Section[] = [
    { header: 'Überfällig', range: [undefined, -1] },
    { header: 'Heute', range: [0, 0] },
    { header: 'Morgen', range: [1, 1] },
    { header: 'Nächste 3 Tage', range: [2, 2] },
    { header: 'Nächste 7 Tage', range: [3, 6] },
    { header: 'Nächste 30 Tage', range: [7, 29] },
]

export default function Dashboard() {
    const { tasks, loading, error } = useTasks(new URLSearchParams(), false)
    const { invalidateAll } = useTaskQuery()
    const [active, setActive] = React.useState<boolean[]>(SECTIONS.map(() => true))

    const today = new Date()

    const inRange = (dueDate: string, [from, to]: [number | undefined, number]) => {
        const d = new Date(dueDate)
        const diff = Math.floor((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return (from === undefined || diff >= from) && diff <= to
    }

    const scrollTo = (i: number) => {
        document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: 'smooth' })
    }

    React.useEffect(() => {
        if (!loading && !error) {
            setActive(SECTIONS.map(sec =>
                tasks.some(t => t.dueDate && inRange(t.dueDate, sec.range))
            ))
        }
    }, [tasks, loading, error])

    return (
        <div className="p-6 pr-0 lg:pr-48">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="flex flex-col w-full">
                {loading && <p>Lade alle Aufgaben…</p>}
                {error && <p className="text-red-600">Fehler: {error}</p>}

                {!loading && !error && SECTIONS.map((sec, i) => {
                    const filtered = tasks.filter(t => t.dueDate && inRange(t.dueDate, sec.range))

                    return (
                        filtered.length > 0 && (
                            <section key={i} id={`section-${i}`}>
                                <h2 className="text-xl font-semibold mt-8 mb-4">{sec.header}</h2>

                                <div className="space-y-4">
                                    {filtered.map(task => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onUpdate={() => invalidateAll()}
                                            onDelete={() => invalidateAll()}
                                        />
                                    ))}
                                </div>
                            </section>
                        )
                    )
                })}
            </div>
            <div
                className="
    fixed 
    flex 
    gap-2 
    w-full 
    justify-center 
    bottom-6

    sm:w-auto sm:bottom-6 sm:right-6 
    sm:justify-end

    lg:flex-col 
    lg:top-1/2 
    lg:-translate-y-1/2 
    lg:bottom-auto
  "
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
