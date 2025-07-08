import { useState, useEffect } from 'react'
import fetcher from '../utils/fetcher'
import { TodoApiResponse } from '@/types/task'

export function useTasks(filter: string) {
  const [tasks, setTasks] = useState<TodoApiResponse[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await fetcher<TodoApiResponse[]>(`/api/tasks?filter=${encodeURIComponent(filter)}`, {
          method: 'GET',
        })
        setTasks(data)
      } catch {
        setTasks([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [filter])

  return { tasks, loading }
}