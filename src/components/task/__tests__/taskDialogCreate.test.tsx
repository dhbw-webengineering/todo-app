import { beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskDialog } from '@/src/components/task/TaskDialog'
import { TaskQueryProvider } from '@/src/state/TaskQueryContext'
import { CategoryProvider } from '@/src/state/CategoryContext'
import { TagsProvider } from '@/src/state/TagsContext'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))


import { AuthProvider } from '@/src/state/AuthContext'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
    if (url.includes('/api/categories')) {
      return Promise.resolve({
        ok: true,
        json: async () => ([{ id: 1, userId: 1, name: 'Allgemein' }]),
      })
    }
    return Promise.resolve({
      ok: true,
      json: async () => ([]),
    })
  })
)})

afterEach(() => {
  vi.restoreAllMocks()
})

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <AuthProvider>
      <TagsProvider>
      <CategoryProvider>
        <TaskQueryProvider>
          {ui}
        </TaskQueryProvider>
      </CategoryProvider>
      </TagsProvider>
    </AuthProvider>
  )
}

describe('TaskDialog (Create Mode)', () => {
  it('zeigt eine Fehlermeldung, wenn der Titel fehlt', async () => {
    renderWithProviders(<TaskDialog mode="create" />)

    const openButton = screen.getByRole('button', { name: /neu/i })
    fireEvent.click(openButton)

    const saveButton = await screen.findByRole('button', { name: /erstellen/i })
    fireEvent.click(saveButton)

    expect(await screen.findByText(/titel darf nicht leer sein/i)).toBeInTheDocument()
  })

  it('zeigt eine Fehlermeldung, wenn das Fälligkeitsdatum fehlt', async () => {
    renderWithProviders(<TaskDialog mode="create" />)
    fireEvent.click(screen.getByRole('button', { name: /neu/i }))

    fireEvent.change(screen.getByLabelText(/titel/i), { target: { value: 'Mein Task' } })
    const saveButton = await screen.findByRole('button', { name: /erstellen/i })
    fireEvent.click(saveButton)

    expect(await screen.findByText(/fälligkeitsdatum ist erforderlich/i)).toBeInTheDocument()
  })

  it('zeigt eine Fehlermeldung, wenn die Kategorie fehlt', async () => {
    renderWithProviders(<TaskDialog mode="create" />)
    fireEvent.click(screen.getByRole('button', { name: /neu/i }))

    fireEvent.change(screen.getByLabelText(/titel/i), { target: { value: 'Mein Task' } })
    const dateButton = screen.getByRole('button', { name: /datum wählen/i })
    fireEvent.click(dateButton)

    const saveButton = await screen.findByRole('button', { name: /erstellen/i })
    fireEvent.click(saveButton)

    expect(await screen.findByText(/kategorie ist erforderlich/i)).toBeInTheDocument()
  })
})
