import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#34d399', '#38bdf8', '#f59e0b', '#f43f5e', '#a78bfa', '#94a3b8']

export interface DonutDatum {
  name: string
  value: number
}

export default function DonutChart({ title, data }: { title: string; data: DonutDatum[] }) {
  const hasData = data.some((item) => item.value > 0)
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="mb-2 text-sm font-semibold text-slate-200">{title}</h3>
      <div className="h-56">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', color: '#e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#cbd5e1' }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="flex h-full items-center justify-center text-sm text-slate-500">Sin datos en este periodo</p>
        )}
      </div>
    </div>
  )
}
