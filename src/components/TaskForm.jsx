import { useState } from 'react'
import { CATEGORIES, PRIORITIES } from '../constants'

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [priority, setPriority] = useState('Media')
  const [dueDate, setDueDate] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd({ title: trimmed, category, priority, dueDate: dueDate || null })
    setTitle('')
    setDueDate('')
  }

  const fieldClass =
    'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nuova attività..."
        aria-label="Titolo attività"
        className={`${fieldClass} flex-1 sm:min-w-48`}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Categoria"
        className={fieldClass}
      >
        {CATEGORIES.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        aria-label="Priorità"
        className={fieldClass}
      >
        {PRIORITIES.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        aria-label="Scadenza"
        className={fieldClass}
      />
      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Aggiungi
      </button>
    </form>
  )
}
