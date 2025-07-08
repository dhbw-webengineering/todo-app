import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import fetcher from '../utils/fetcher'
import { ApiRoute } from '@/src/utils/ApiRoute'
import { User } from '@/src/types/user'

export function useAuth() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const loadUser = useCallback(async () => {
        try {
            setLoading(true)
            const data = await fetcher<User>(ApiRoute.ME, { method: 'GET' })
            setUser(data)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    const login = useCallback(async (email: string, password: string) => {
        await fetcher(ApiRoute.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        await loadUser()
        router.push('/tasks')
    }, [loadUser, router])

    const logout = useCallback(async () => {
        await fetcher(ApiRoute.LOGOUT, { method: 'POST' })
        setUser(null)
        router.push('/auth/login')
    }, [router])

    useEffect(() => {
        loadUser()
    }, [loadUser])

    return { user, loading, login, logout }
}
