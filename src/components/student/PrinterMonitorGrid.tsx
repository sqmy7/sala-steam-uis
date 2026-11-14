import { useEffect, useState } from 'react'
import { listPublicPrinters, printerSnapshotUrl } from '../../services/public'
import type { PublicPrinter } from '../../types/api'
import { elapsedSince, formatDateTime, STATUS_COLOR, STATUS_LABEL } from '../../lib/format'

function PrinterCard({ printer }: { printer: PublicPrinter }) {
  const [snapshotFailed, setSnapshotFailed] = useState(false)
  const [snapshotKey, setSnapshotKey] = useState(0)

  useEffect(() => {
    setSnapshotFailed(false)
    const interval = setInterval(() => setSnapshotKey((key) => key + 1), 4000)
    return () => clearInterval(interval)
  }, [printer.camera_id])

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex aspect-video items-center justify-center bg-black">
        {printer.camera_id && !snapshotFailed ? (
          <img
            key={snapshotKey}
            src={printerSnapshotUrl(printer.id)}
            alt={`Camara de ${printer.name}`}
            className="h-full w-full object-contain"
            onError={() => setSnapshotFailed(true)}
          />
        ) : (
          <span className="text-sm text-slate-500">Sin senal de camara</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">{printer.name}</h3>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${STATUS_COLOR[printer.status]}`}>
            {STATUS_LABEL[printer.status] ?? printer.status}
          </span>
        </div>
        {printer.current_job ? (
          <dl className="mt-3 space-y-1 text-sm text-slate-300">
            <div className="flex justify-between">
              <dt className="text-slate-500">Pieza</dt>
              <dd>{printer.current_job.file_name}</dd>
            </div>
            {printer.current_job.requester_name && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Estudiante</dt>
                <dd>{printer.current_job.requester_name}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-slate-500">Desde</dt>
              <dd>{formatDateTime(printer.current_job.started_at)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Tiempo transcurrido</dt>
              <dd>{elapsedSince(printer.current_job.started_at)}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Sin impresion activa</p>
        )}
      </div>
    </div>
  )
}

export default function PrinterMonitorGrid() {
  const [printers, setPrinters] = useState<PublicPrinter[]>([])

  useEffect(() => {
    let active = true
    const load = () => listPublicPrinters().then((data) => active && setPrinters(data)).catch(() => {})
    load()
    const interval = setInterval(load, 10_000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-white">Monitor en vivo - Creality Hi</h2>
      {printers.length === 0 ? (
        <p className="text-sm text-slate-500">No hay impresoras registradas todavia.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {printers.map((printer) => (
            <PrinterCard key={printer.id} printer={printer} />
          ))}
        </div>
      )}
    </section>
  )
}
