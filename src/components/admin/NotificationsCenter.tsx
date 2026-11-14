import { useState } from 'react'
import type { PrintQueueRequest } from '../../types/api'
import type { IncidentRead } from '../../services/printwatch'
import { formatDateTime } from '../../lib/format'

interface Props {
  pendingRequests: PrintQueueRequest[]
  openIncidents: IncidentRead[]
  onApprove: (id: number) => Promise<void>
  onReject: (id: number, note: string) => Promise<void>
  onDismissIncident: (id: number) => Promise<void>
}

export default function NotificationsCenter({ pendingRequests, openIncidents, onApprove, onReject, onDismissIncident }: Props) {
  const [busyId, setBusyId] = useState<number | null>(null)

  async function run(id: number, action: () => Promise<void>) {
    setBusyId(id)
    try {
      await action()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-semibold text-white">Centro de notificaciones</h2>

      <div className="mb-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-300">Solicitudes QR pendientes ({pendingRequests.length})</h3>
        {pendingRequests.length === 0 ? (
          <p className="text-sm text-slate-500">No hay solicitudes pendientes.</p>
        ) : (
          <ul className="space-y-2">
            {pendingRequests.map((request) => (
              <li key={request.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-950/60 px-3 py-2 text-sm">
                <span>
                  <span className="font-medium text-white">{request.student_name}</span> ({request.student_uis_code}) -{' '}
                  {request.piece_name} - {formatDateTime(request.created_at)}
                </span>
                <span className="flex gap-2">
                  <button
                    disabled={busyId === request.id}
                    onClick={() => run(request.id, () => onApprove(request.id))}
                    className="rounded bg-emerald-700 px-3 py-1 text-white hover:bg-emerald-600 disabled:opacity-50"
                  >
                    Aprobar y encolar
                  </button>
                  <button
                    disabled={busyId === request.id}
                    onClick={() => {
                      const note = window.prompt('Motivo del rechazo:') ?? ''
                      if (note) run(request.id, () => onReject(request.id, note))
                    }}
                    className="rounded bg-rose-800 px-3 py-1 text-white hover:bg-rose-700 disabled:opacity-50"
                  >
                    Rechazar
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-300">Incidentes de deteccion IA abiertos ({openIncidents.length})</h3>
        {openIncidents.length === 0 ? (
          <p className="text-sm text-slate-500">Sin incidentes abiertos.</p>
        ) : (
          <ul className="space-y-2">
            {openIncidents.map((incident) => (
              <li key={incident.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-amber-950/40 px-3 py-2 text-sm">
                <span>
                  <span className="font-medium text-amber-300">{incident.defect_class}</span> - trabajo #{incident.print_job_id} -{' '}
                  {formatDateTime(incident.opened_at)} - estado: {incident.status}
                </span>
                <button
                  disabled={busyId === incident.id}
                  onClick={() => run(incident.id, () => onDismissIncident(incident.id))}
                  className="rounded bg-slate-700 px-3 py-1 text-white hover:bg-slate-600 disabled:opacity-50"
                >
                  Marcar como revisado
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
