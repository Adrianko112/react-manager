import { CATEGORIES } from '../constants'

const STATUSES = [
  { value: 'all', label: 'Tutte' },
  { value: 'active', label: 'Da fare' },
  { value: 'done', label: 'Completate' },
]

const selectClass =
  'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800'

export default function TaskFilters({
  status,
  setStatus,
  category,
  setCategory,
  search,
  setSearch,
  sort,
  setSort,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex gap-1 rounded-lg bg-slate-200 p-1 dark:bg-slate-700">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            aria-pressed={status === s.value}
            className={`rounded-md px-3 py-1 text-sm ${
              status === s.value
                ? 'bg-white font-medium shadow-sm dark:bg-slate-900'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca..."
          aria-label="Cerca attività"
          className={`${selectClass} w-full sm:w-36`}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filtra per categoria"
          className={selectClass}
        >
          <option value="all">Tutte le categorie</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Ordinamento"
          className={selectClass}
        >
          <option value="manual">Ordine manuale</option>
          <option value="due">Per scadenza</option>
        </select>
      </div>
    </div>
  )
}
