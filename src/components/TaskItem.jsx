import { useState } from 'react'
import { formatDate, isOverdue } from '../utils/tasks'

const PRIORITY_STYLES = {
  Alta: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  Media: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Bassa: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
}

// Componente di presentazione. Per il drag & drop riceve da fuori
// ref, style e "handle" (attributi/listener del pulsante di trascinamento).
export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
  innerRef,
  style,
  handle,
  isDragging = false,
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)
  const overdue = isOverdue(task)

  function save() {
    const trimmed = draft.trim()
    if (trimmed) onEdit(task.id, trimmed)
    else setDraft(task.title)
    setEditing(false)
  }

  return (
    <li
      ref={innerRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm dark:bg-slate-800 ${
        overdue ? 'border-red-300 dark:border-red-700' : 'border-slate-200 dark:border-slate-700'
      } ${isDragging ? 'relative z-10 opacity-80 shadow-lg' : ''}`}
    >
      {handle && (
        <button
          type="button"
          aria-label={`Trascina ${task.title}`}
          className="cursor-grab touch-none text-slate-400 hover:text-slate-600 active:cursor-grabbing dark:hover:text-slate-200"
          {...handle}
        >
          ⠿
        </button>
      )}

      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Completa ${task.title}`}
        className="h-4 w-4 accent-indigo-600"
      />

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
              if (e.key === 'Escape') {
                setDraft(task.title)
                setEditing(false)
              }
            }}
            aria-label="Modifica titolo"
            className="w-full rounded border border-indigo-400 bg-transparent px-2 py-1 text-sm focus:outline-none"
          />
        ) : (
          <span
            onDoubleClick={() => setEditing(true)}
            title="Doppio click per modificare"
            className={`block cursor-text truncate text-sm ${
              task.completed ? 'text-slate-400 line-through' : ''
            }`}
          >
            {task.title}
          </span>
        )}
        {task.dueDate && (
          <span
            className={`text-xs ${
              overdue ? 'font-medium text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {overdue ? 'Scaduta il ' : 'Scade il '}
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 sm:inline dark:bg-slate-700 dark:text-slate-300">
        {task.category}
      </span>
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}
      >
        {task.priority}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        aria-label={`Elimina ${task.title}`}
        className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
      >
        ✕
      </button>
    </li>
  )
}
