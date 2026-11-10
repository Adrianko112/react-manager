import { describe, expect, it } from 'vitest'
import { filterTasks, formatDate, isOverdue, reorderById, sortByDueDate } from './tasks'

const t = (id, extra = {}) => ({
  id,
  title: `Task ${id}`,
  category: 'Lavoro',
  completed: false,
  dueDate: null,
  ...extra,
})

describe('isOverdue', () => {
  it('è vero solo per attività non completate con scadenza passata', () => {
    expect(isOverdue(t('1', { dueDate: '2020-01-01' }), '2024-06-01')).toBe(true)
    expect(isOverdue(t('1', { dueDate: '2020-01-01', completed: true }), '2024-06-01')).toBe(false)
    expect(isOverdue(t('1', { dueDate: '2024-06-01' }), '2024-06-01')).toBe(false)
    expect(isOverdue(t('1'), '2024-06-01')).toBe(false)
  })
})

describe('formatDate', () => {
  it('converte YYYY-MM-DD in DD/MM/YYYY', () => {
    expect(formatDate('2024-03-09')).toBe('09/03/2024')
  })
})

describe('sortByDueDate', () => {
  it('ordina per data e mette le attività senza data in fondo, senza modificare l\'originale', () => {
    const input = [t('a'), t('b', { dueDate: '2024-05-02' }), t('c', { dueDate: '2024-05-01' })]
    expect(sortByDueDate(input).map((x) => x.id)).toEqual(['c', 'b', 'a'])
    expect(input.map((x) => x.id)).toEqual(['a', 'b', 'c'])
  })
})

describe('filterTasks', () => {
  const tasks = [
    t('1', { title: 'Studiare React' }),
    t('2', { title: 'Comprare latte', category: 'Personale', completed: true }),
  ]
  const base = { status: 'all', category: 'all', search: '' }

  it('filtra per stato', () => {
    expect(filterTasks(tasks, { ...base, status: 'done' }).map((x) => x.id)).toEqual(['2'])
    expect(filterTasks(tasks, { ...base, status: 'active' }).map((x) => x.id)).toEqual(['1'])
  })
  it('filtra per categoria', () => {
    expect(filterTasks(tasks, { ...base, category: 'Personale' }).map((x) => x.id)).toEqual(['2'])
  })
  it('cerca ignorando maiuscole e spazi', () => {
    expect(filterTasks(tasks, { ...base, search: '  REACT ' }).map((x) => x.id)).toEqual(['1'])
  })
})

describe('reorderById', () => {
  it('sposta un elemento nella posizione di un altro', () => {
    const list = [t('a'), t('b'), t('c')]
    expect(reorderById(list, 'a', 'c').map((x) => x.id)).toEqual(['b', 'c', 'a'])
    expect(reorderById(list, 'c', 'a').map((x) => x.id)).toEqual(['c', 'a', 'b'])
  })
  it('restituisce la stessa lista se gli id non sono validi', () => {
    const list = [t('a'), t('b')]
    expect(reorderById(list, 'x', 'a')).toBe(list)
  })
})
