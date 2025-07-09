"use client"
import Dashboard from '@/src/components/dashboard/Dashboard'
import { useProtectedRoute } from '../state/useProtectedRoute'

export default function Home() {
  useProtectedRoute()
  return <Dashboard />
}