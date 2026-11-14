interface KpiCardsProps {
  printHours: number | null
  occupancyPct: number | null
  filamentGrams: number
  studentsAttended: number
  loansCount: number
  successRatePct: number | null
}

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

export default function KpiCards({
  printHours,
  occupancyPct,
  filamentGrams,
  studentsAttended,
  loansCount,
  successRatePct,
}: KpiCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        label="Horas de impresion"
        value={printHours != null ? `${printHours.toFixed(1)} h` : '—'}
        hint={occupancyPct != null ? `${occupancyPct.toFixed(0)}% de ocupacion del periodo` : undefined}
      />
      <Card
        label="Filamento consumido"
        value={filamentGrams >= 1000 ? `${(filamentGrams / 1000).toFixed(2)} kg` : `${filamentGrams.toFixed(0)} g`}
      />
      <Card
        label="Estudiantes / prestamos"
        value={`${studentsAttended} / ${loansCount}`}
        hint="Estudiantes atendidos y prestamos realizados"
      />
      <Card
        label="Tasa de exito de impresion"
        value={successRatePct != null ? `${successRatePct.toFixed(0)}%` : '—'}
        hint="Completadas vs. incidentes detectados por IA"
      />
    </div>
  )
}
