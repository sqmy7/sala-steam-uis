import { useEffect, useState } from 'react'
import { listPublicPrintHistory } from '../../services/public'
import type { PublicPrintHistoryEntry } from '../../types/api'
import { formatDate, formatDurationSeconds } from '../../lib/format'

const STATUS_LABEL: Record<string, string> = {
  completed: 'Completada',
  failed: 'Fallida',
  cancelled: 'Cancelada',
}

export default function PrintHistoryTable() {
  const [history, setHistory] = useState<PublicPrintHistoryEntry[]>([])

  useEffect(() => {
    listPublicPrintHistory(50).then(setHistory).catch(() => {})
  }, [])

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-semibold text-white">Log permanente de impresiones</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-1 pr-3">Fecha</th>
              <th className="py-1 pr-3">Pieza</th>
              <th className="py-1 pr-3">Estudiante</th>
              <th className="py-1 pr-3">Impresora</th>
              <th className="py-1 pr-3">Duracion</th>
              <th className="py-1 pr-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {history.map((entry) => (
              <tr key={entry.job_id}>
                <td className="py-1.5 pr-3 whitespace-nowrap">{formatDate(entry.started_at)}</td>
                <td className="py-1.5 pr-3">{entry.file_name}</td>
                <td className="py-1.5 pr-3">{entry.student_name ?? '—'}</td>
                <td className="py-1.5 pr-3">{entry.printer_name}</td>
                <td className="py-1.5 pr-3">{formatDurationSeconds(entry.printed_s)}</td>
                <td className="py-1.5 pr-3">
                  {entry.had_incident && entry.status !== 'completed' ? (
                    <span className="rounded bg-rose-900/60 px-2 py-0.5 text-xs text-rose-200">
                      Fallida por deteccion IA
                    </span>
                  ) : (
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-xs">
                      {STATUS_LABEL[entry.status] ?? entry.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={6} className="py-3 text-center text-slate-500">
                  Todavia no hay impresiones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
