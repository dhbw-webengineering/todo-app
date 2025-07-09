import { toast } from 'sonner'

export interface FetchError extends Error {
  status: number
  data?: unknown
}

export default async function fetcher<T = unknown>(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<T> {
  const defaultInit: RequestInit = {
    credentials: 'include',
    ...init,
  }

  const res = await fetch(input, defaultInit)
  const contentType = res.headers.get('Content-Type') || ''
  const data =
    contentType.includes('application/json')
      ? await res.json()
      : await res.text()

  if (!res.ok) {
    const errMessage =
      (typeof data === 'object' && data !== null && 'message' in data)
        ? (data as { message?: string }).message ?? res.statusText
        : res.statusText || 'Ein unbekannter Fehler ist aufgetreten.'

    console.error(errMessage)
    
    const error = new Error(errMessage) as FetchError
    error.status = res.status
    error.data = data
    throw error
  }

  return data as T
}