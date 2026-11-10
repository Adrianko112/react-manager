// Data odierna in formato YYYY-MM-DD (fuso orario locale).
export function todayISO() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function isOverdue(task, today = todayISO()) {
  return Boolean(task.dueDate) && !task.completed && task.dueDate < today
}

export function formatDate(iso) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

// Ordina per scadenza: le attività senza data vanno in fondo.
export function sortByDueDate(tasks) {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return a.dueDate.localeCompare(b.dueDate)
  })
}

export function filterTasks(tasks, { status, category, search }) {
  const q = search.trim().toLowerCase()
  return tasks.filter((t) => {
    if (status === 'active' && t.completed) return false
    if (status === 'done' && !t.completed) return false
    if (category !== 'all' && t.category !== category) return false
    if (q && !t.title.toLowerCase().includes(q)) return false
    return true
  })
}

// Sposta nell'array completo l'elemento "activeId" nella posizione di "overId".
export function reorderById(tasks, activeId, overId) {
  const from = tasks.findIndex((t) => t.id === activeId)
  const to = tasks.findIndex((t) => t.id === overId)
  if (from === -1 || to === -1 || from === to) return tasks
  const next = [...tasks]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}
