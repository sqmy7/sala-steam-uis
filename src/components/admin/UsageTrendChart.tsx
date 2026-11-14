import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface UsagePoint {
  date: string
  hours: number
}

export default function UsageTrendChart({ data }: { data: UsagePoint[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="mb-2 text-sm font-semibold text-slate-200">Evolucion del uso de la sala (horas de impresion)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', color: '#e2e8f0' }} />
            <Area type="monotone" dataKey="hours" stroke="#34d399" fill="#34d399" fillOpacity={0.25} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
