import { useState } from 'react'
import type { RoomStatus } from '../../types/api'
import { closeRoom, openRoom } from '../../services/staff'
import { formatDateTime } from '../../lib/format'

export default function RoomSwitchControl({
  status,
  canWrite,
  onChanged,
}: {
  status: RoomStatus | null
  canWrite: boolean
  onChanged: () => void
}) {
  const [busy, setBusy] = useState(false)

  async function toggle() {
    setBusy(true)
    try {
      if (status?.is_open) await closeRoom()
      else await openRoom()
      onChanged()
    } finally {
      setBusy(false)
    }
  }

  if (!status) return null

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
        status.is_open ? 'border-emerald-700 bg-emerald-950/40' : 'border-rose-800 bg-rose-950/40'
      }`}
    >
      <div>
        <p className="font-semibold text-white">{status.is_open ? 'Sala Abierta' : 'Sala Cerrada'}</p>
        {status.shift && (
          <p className="text-xs text-slate-400">
            {status.is_open
              ? `Abierta por ${status.shift.opened_by_name} - ${formatDateTime(status.shift.opened_at)}`
              : `Ultimo cierre por ${status.shift.closed_by_name ?? '—'} - ${formatDateTime(status.shift.closed_at)}`}
          </p>
        )}
      </div>
      {canWrite && (
        <button
          disabled={busy}
          onClick={toggle}
          className={`rounded px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50 ${
            status.is_open ? 'bg-rose-800 hover:bg-rose-700' : 'bg-emerald-700 hover:bg-emerald-600'
          }`}
        >
          {status.is_open ? 'Cerrar sala' : 'Abrir sala'}
        </button>
      )}
    </div>
  )
}
