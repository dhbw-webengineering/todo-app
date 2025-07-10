import { beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskCard } from '@/src/components/task/TaskCard'
import { TaskQueryProvider } from '@/src/state/TaskQueryContext'
import { CategoryProvider } from '@/src/state/CategoryContext'
import { AuthProvider } from '@/src/state/AuthContext'
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



import { TodoApiResponse } from '@/src/types/task'

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

const mockTask: TodoApiResponse = {
  id: 1,
  userId: 1,
  title: "Test-Aufgabe",
  description: "Beschreibung für Test-Aufgabe",
  dueDate: "2026-07-06T10:00:00.000Z", 
  categoryId: 1,
  completedAt: null,
  createdAt: "2025-07-01T18:26:40.484Z",
  updatedAt: "2025-07-08T22:01:10.078Z",
  category: { id: 1, userId: 1, name: "Allgemein" },
  tags: []
}

describe('TaskCard', () => {
  it('rendert den Titel der Aufgabe', () => {
    renderWithProviders(
      <TaskCard task={mockTask} onUpdate={() => {}} onDelete={() => {}} />
    )
    expect(screen.getByText('Test-Aufgabe')).toBeInTheDocument()
  })

  it('zeigt die Beschreibung an', () => {
    renderWithProviders(
      <TaskCard task={mockTask} onUpdate={() => {}} onDelete={() => {}} />
    )
    expect(screen.getByText('Beschreibung für Test-Aufgabe')).toBeInTheDocument()
  })

  it('zeigt die Kategorie an', () => {
    renderWithProviders(
      <TaskCard task={mockTask} onUpdate={() => {}} onDelete={() => {}} />
    )
    expect(screen.getByText('Allgemein')).toBeInTheDocument()
  })

  it('zeigt das Fälligkeitsdatum im korekkten Format an', () => {
    renderWithProviders(
      <TaskCard task={mockTask} onUpdate={() => {}} onDelete={() => {}} />
    )
    expect(screen.getByText((text) => text.includes('06.07.2026'))).toBeInTheDocument()
  })

  it('zeigt den Status "Offen" für unerledigte Tasks', () => { 
    renderWithProviders(
      <TaskCard task={mockTask} onUpdate={() => {}} onDelete={() => {}} />
    )
    expect(screen.getByText('Offen')).toBeInTheDocument()
  })

  it('zeigt den Status "Erledigt" für erledigte Tasks', () => {
    const completedTask = { ...mockTask, completedAt: new Date().toISOString() }
    renderWithProviders(
      <TaskCard task={completedTask} onUpdate={() => {}} onDelete={() => {}} />
    )
    expect(screen.getByText('Erledigt')).toBeInTheDocument()
  })

  it('ruft onUpdate beim Umschalten der Checkbox auf', () => {
    const mockOnUpdate = vi.fn()
    renderWithProviders(
      <TaskCard task={mockTask} onUpdate={mockOnUpdate} onDelete={() => {}} />
    )
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(mockOnUpdate).toHaveBeenCalledWith(expect.objectContaining({
      id: mockTask.id,
      completedAt: expect.any(String)
    }))
  })

  it('zeigt "keine Tags" an, wenn keine Tags vorhanden sind', () => {
    renderWithProviders(
      <TaskCard task={mockTask} onUpdate={() => {}} onDelete={() => {}} />
    )
    expect(screen.getByText(/keine Tags/i)).toBeInTheDocument()
  })
})
