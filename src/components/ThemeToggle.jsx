export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
    >
      {isDark ? '☀️ Chiaro' : '🌙 Scuro'}
    </button>
  )
}
