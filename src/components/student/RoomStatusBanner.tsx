import { useEffect, useState } from 'react'
import { getRoomStatus } from '../../services/public'
import type { RoomStatus } from '../../types/api'
import { formatDateTime } from '../../lib/format'

export default function RoomStatusBanner() {
  const [status, setStatus] = useState<RoomStatus | null>(null)

  useEffect(() => {
    let active = true
    const load = () => getRoomStatus().then((data) => active && setStatus(data)).catch(() => {})
    load()
    const interval = setInterval(load, 20_000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  if (!status) return null

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-3 ${
        status.is_open ? 'border-emerald-700 bg-emerald-950/40' : 'border-rose-800 bg-rose-950/40'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${status.is_open ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        <span className="text-lg font-semibold text-white">{status.is_open ? 'Sala Abierta' : 'Sala Cerrada'}</span>
      </div>
      {status.shift && (
        <span className="text-sm text-slate-300">
          {status.is_open
            ? `Encargado en turno: ${status.shift.opened_by_name} - desde ${formatDateTime(status.shift.opened_at)}`
            : `Ultimo cierre: ${status.shift.closed_by_name ?? '—'} - ${formatDateTime(status.shift.closed_at)}`}
        </span>
      )}
    </div>
  )
}
