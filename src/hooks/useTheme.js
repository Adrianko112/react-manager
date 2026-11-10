import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

const systemPrefersDark = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches

// Tema chiaro/scuro: parte dalla preferenza di sistema e salva la scelta.
export function useTheme() {
  const [theme, setTheme] = useLocalStorage('theme', systemPrefersDark() ? 'dark' : 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return [theme, toggleTheme]
}
