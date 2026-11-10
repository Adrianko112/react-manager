import { describe, expect, it } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

async function addTask(user, title, { due } = {}) {
  await user.type(screen.getByLabelText('Titolo attività'), title)
  if (due) await user.type(screen.getByLabelText('Scadenza'), due)
  await user.click(screen.getByRole('button', { name: 'Aggiungi' }))
}

describe('Task Manager', () => {
  it('mostra lo stato vuoto', () => {
    render(<App />)
    expect(screen.getByText('Nessuna attività. Aggiungine una!')).toBeInTheDocument()
  })

  it('aggiunge una attività e svuota il campo', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Studiare React')
    expect(screen.getByText('Studiare React')).toBeInTheDocument()
    expect(screen.getByLabelText('Titolo attività')).toHaveValue('')
    expect(screen.getByText('0 di 1 completate')).toBeInTheDocument()
  })

  it('ignora i titoli vuoti', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Titolo attività'), '   ')
    await user.click(screen.getByRole('button', { name: 'Aggiungi' }))
    expect(screen.getByText('Nessuna attività. Aggiungine una!')).toBeInTheDocument()
  })

  it('completa ed elimina le attività', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Una')
    await user.click(screen.getByLabelText('Completa Una'))
    expect(screen.getByText('1 di 1 completate')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Elimina completate' }))
    expect(screen.queryByText('Una')).not.toBeInTheDocument()
  })

  it('modifica il titolo con doppio click', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Vecchio')
    await user.dblClick(screen.getByText('Vecchio'))
    const input = screen.getByLabelText('Modifica titolo')
    await user.clear(input)
    await user.type(input, 'Nuovo{Enter}')
    expect(screen.getByText('Nuovo')).toBeInTheDocument()
  })

  it('filtra con la ricerca', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Alpha')
    await addTask(user, 'Beta')
    await user.type(screen.getByLabelText('Cerca attività'), 'alp')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
  })

  it('evidenzia le attività scadute', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'In ritardo', { due: '2020-01-01' })
    expect(screen.getByText('Scaduta il 01/01/2020')).toBeInTheDocument()
  })

  it('ordina per scadenza', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Tardi', { due: '2099-12-31' })
    await addTask(user, 'Presto', { due: '2099-01-01' })
    await user.selectOptions(screen.getByLabelText('Ordinamento'), 'due')
    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('Presto')
    expect(items[1]).toHaveTextContent('Tardi')
  })

  it('mostra le maniglie di trascinamento solo con ordine manuale e senza filtri', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Alpha')
    expect(screen.getByLabelText('Trascina Alpha')).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText('Ordinamento'), 'due')
    expect(screen.queryByLabelText('Trascina Alpha')).not.toBeInTheDocument()
  })

  it('alterna il tema scuro e lo salva', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /tema/i }))
    expect(document.documentElement).toHaveClass('dark')
    expect(JSON.parse(localStorage.getItem('theme'))).toBe('dark')
  })

  it('salva le attività in localStorage', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Persistente')
    expect(JSON.parse(localStorage.getItem('tasks'))[0].title).toBe('Persistente')
  })

  it('elimina una singola attività lasciando le altre', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Alpha')
    await addTask(user, 'Beta')
    await user.click(screen.getByLabelText('Elimina Alpha'))
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('0 di 1 completate')).toBeInTheDocument()
  })

  it('rilegge le attività da localStorage dopo un ricaricamento', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)
    await addTask(user, 'Sopravvissuta')
    unmount()
    render(<App />)
    expect(screen.getByText('Sopravvissuta')).toBeInTheDocument()
  })

  it('filtra per stato dall\'interfaccia', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Già finita')
    await addTask(user, 'Ancora aperta')
    await user.click(screen.getByLabelText('Completa Già finita'))

    await user.click(screen.getByRole('button', { name: 'Completate' }))
    expect(screen.getByText('Già finita')).toBeInTheDocument()
    expect(screen.queryByText('Ancora aperta')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Da fare' }))
    expect(screen.getByText('Ancora aperta')).toBeInTheDocument()
    expect(screen.queryByText('Già finita')).not.toBeInTheDocument()
  })

  it('filtra per categoria dall\'interfaccia', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Lavoro uno')
    await user.selectOptions(screen.getByLabelText('Categoria'), 'Studio')
    await addTask(user, 'Studio uno')

    await user.selectOptions(screen.getByLabelText('Filtra per categoria'), 'Studio')
    expect(screen.getByText('Studio uno')).toBeInTheDocument()
    expect(screen.queryByText('Lavoro uno')).not.toBeInTheDocument()
  })

  it('riordina le attività con il trascinamento da tastiera', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Prima')
    await addTask(user, 'Seconda')
    // le nuove attività vanno in cima: ordine attuale = Seconda, Prima
    const titles = () =>
      within(screen.getByRole('list'))
        .getAllByRole('listitem')
        .map((li) => li.textContent)
    expect(titles()[0]).toContain('Seconda')

    screen.getByLabelText('Trascina Seconda').focus()
    await user.keyboard(' ')
    await user.keyboard('{ArrowDown}')
    await user.keyboard(' ')

    await waitFor(() => expect(titles()[0]).toContain('Prima'))
    expect(titles()[1]).toContain('Seconda')
  })
})
