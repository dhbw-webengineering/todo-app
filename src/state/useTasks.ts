import { useState, useEffect, useCallback, useMemo } from 'react'
import fetcher from '@/src/utils/fetcher'
import { TodoApiResponse } from '@/src/types/task'
import { ApiRoute } from '@/src/utils/ApiRoute'
import { useTaskQuery } from '@/src/state/TaskQueryContext'

export interface UseTasksResult {
  tasks: TodoApiResponse[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateTask: (task: TodoApiResponse) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export function useTasks(apiRoute: ApiRoute, params: URLSearchParams, showDone: boolean): UseTasksResult {
  const [tasks, setTasks] = useState<TodoApiResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { invalidateAll, subscribe } = useTaskQuery()

  // memoize query string so useCallback dependency is static
  const queryString = useMemo(() => params.toString(), [params])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const url = queryString ? `${apiRoute}?${queryString}` : apiRoute
      const data = await fetcher<TodoApiResponse[]>(url, { method: 'GET' })
      const filtered = showDone ? data : data.filter(t => !t.completedAt)
      setTasks(filtered)
    } catch (err) {
      const message =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Fehler beim Laden der Aufgaben'
      setError(message)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [apiRoute, queryString, showDone])

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      void load()
    })
    return unsubscribe
  }, [load, subscribe])

  useEffect(() => {
    void load()
  }, [load])

  const updateTask = useCallback(
    async (task: TodoApiResponse) => {
      await fetcher(`${ApiRoute.TODOS}/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      })
      invalidateAll()
    },
    [invalidateAll]
  )

  const deleteTask = useCallback(
    async (id: string) => {
      await fetcher(`${ApiRoute.TODOS}/${id}`, {
        method: 'DELETE',
      })
      invalidateAll()
    },
    [invalidateAll]
  )

  return {
    tasks,
    loading,
    error,
    refetch: load,
    updateTask,
    deleteTask,
  }
}
