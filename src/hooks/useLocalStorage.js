import { useEffect, useState } from 'react'

// Come useState, ma il valore viene salvato in localStorage.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage non disponibile: l'app funziona comunque in memoria
    }
  }, [key, value])

  return [value, setValue]
}
