import { useMemo, useState } from 'react'
import TaskForm from './components/TaskForm'
import TaskFilters from './components/TaskFilters'
import TaskList from './components/TaskList'
import ThemeToggle from './components/ThemeToggle'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTheme } from './hooks/useTheme'
import { filterTasks, reorderById, sortByDueDate } from './utils/tasks'

export default function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', [])
  const [theme, toggleTheme] = useTheme()
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('manual')

  const addTask = (data) =>
    setTasks((prev) => [{ id: crypto.randomUUID(), completed: false, ...data }, ...prev])

  const toggleTask = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))

  const editTask = (id, title) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)))

  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id))

  const clearCompleted = () => setTasks((prev) => prev.filter((t) => !t.completed))

  const reorderTasks = (activeId, overId) =>
    setTasks((prev) => reorderById(prev, activeId, overId))

  const visibleTasks = useMemo(() => {
    const filtered = filterTasks(tasks, { status, category, search })
    return sort === 'due' ? sortByDueDate(filtered) : filtered
  }, [tasks, status, category, search, sort])

  const hasFilters = status !== 'all' || category !== 'all' || search.trim() !== ''
  const canReorder = sort === 'manual' && !hasFilters
  const doneCount = tasks.filter((t) => t.completed).length

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Task Manager</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {doneCount} di {tasks.length} completate
          </p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <section className="space-y-4 rounded-2xl bg-white/60 p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
        <TaskForm onAdd={addTask} />
        <TaskFilters
          status={status}
          setStatus={setStatus}
          category={category}
          setCategory={setCategory}
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
        />

        {visibleTasks.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            {tasks.length === 0 ? 'Nessuna attività. Aggiungine una!' : 'Nessun risultato.'}
          </p>
        ) : (
          <TaskList
            tasks={visibleTasks}
            canReorder={canReorder}
            onReorder={reorderTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={editTask}
          />
        )}

        {!canReorder && tasks.length > 1 && (
          <p className="text-xs text-slate-400">
            Per riordinare con il trascinamento, scegli "Ordine manuale" e rimuovi i filtri.
          </p>
        )}

        {doneCount > 0 && (
          <button
            onClick={clearCompleted}
            className="text-sm text-slate-500 underline hover:text-red-600 dark:text-slate-400"
          >
            Elimina completate
          </button>
        )}
      </section>
    </main>
  )
}
