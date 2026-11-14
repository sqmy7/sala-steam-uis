import type { PrinterRead } from '../../services/printwatch'

export interface Filters {
  days: number
  printerId: number | null
}

const RANGES = [
  { label: 'Dia', days: 1 },
  { label: 'Semana', days: 7 },
  { label: 'Mes', days: 30 },
  { label: 'Semestre', days: 180 },
  { label: 'Año', days: 365 },
]

export default function FiltersBar({
  filters,
  onChange,
  printers,
  lastSync,
}: {
  filters: Filters
  onChange: (filters: Filters) => void
  printers: PrinterRead[]
  lastSync: Date | null
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
      <div className="flex items-center gap-2">
        {RANGES.map((range) => (
          <button
            key={range.days}
            onClick={() => onChange({ ...filters, days: range.days })}
            className={`rounded px-3 py-1 text-sm ${
              filters.days === range.days ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 text-sm">
        <select
          value={filters.printerId ?? ''}
          onChange={(event) => onChange({ ...filters, printerId: event.target.value ? Number(event.target.value) : null })}
          className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-slate-200"
        >
          <option value="">Todas las impresoras</option>
          {printers.map((printer) => (
            <option key={printer.id} value={printer.id}>
              {printer.name}
            </option>
          ))}
        </select>
        <span className="text-slate-500">
          Ultima sincronizacion: {lastSync ? lastSync.toLocaleTimeString('es-CO') : '—'}
        </span>
      </div>
    </div>
  )
}
