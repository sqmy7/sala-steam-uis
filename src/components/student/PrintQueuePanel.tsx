import { useEffect, useState } from 'react'
import { listPublicQueue } from '../../services/public'
import type { PublicQueueEntry } from '../../types/api'

export default function PrintQueuePanel() {
  const [entries, setEntries] = useState<PublicQueueEntry[]>([])

  useEffect(() => {
    let active = true
    const load = () => listPublicQueue().then((data) => active && setEntries(data)).catch(() => {})
    load()
    const interval = setInterval(load, 15_000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-semibold text-white">Cola de turnos (estilo EPS)</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-slate-500">No hay turnos en espera.</p>
      ) : (
        <ol className="space-y-2">
          {entries.map((entry, index) => (
            <li
              key={entry.id}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 font-semibold text-slate-200">
                  {index + 1}
                </span>
                <span>
                  <span className="font-medium text-white">{entry.student_name}</span>
                  <span className="text-slate-400"> - {entry.piece_name}</span>
                </span>
              </span>
              <span className="text-slate-400">{entry.estimated_minutes ? `~${entry.estimated_minutes} min` : '—'}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
