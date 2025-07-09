import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/state/AuthContext'

export function useProtectedRoute() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [loading, user, router])
}
