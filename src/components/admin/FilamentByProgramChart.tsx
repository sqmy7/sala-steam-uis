import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface ProgramUsage {
  program: string
  grams: number
}

export default function FilamentByProgramChart({ data }: { data: ProgramUsage[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="mb-2 text-sm font-semibold text-slate-200">Consumo de filamento por carrera / proyecto</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="program" stroke="#64748b" fontSize={11} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis stroke="#64748b" fontSize={12} unit="g" />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', color: '#e2e8f0' }} />
            <Bar dataKey="grams" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
