'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface MonteCarloPoint {
  loss: number
  probability: number
}

interface RiskChartProps {
  data: MonteCarloPoint[]
  expectedLoss?: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs">
        <p className="text-slate-300">Pérdida: <span className="text-white font-bold">${Number(label).toLocaleString()} USD</span></p>
        <p className="text-slate-300">Probabilidad: <span className="text-amber-400 font-bold">{(payload[0].value * 100).toFixed(1)}%</span></p>
      </div>
    )
  }
  return null
}

export function RiskChart({ data, expectedLoss }: RiskChartProps) {
  const formattedData = data.map(d => ({
    loss: d.loss,
    probability: d.probability,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={formattedData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="loss"
          tick={{ fill: '#64748b', fontSize: 10 }}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 10 }}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        {expectedLoss && (
          <ReferenceLine
            x={expectedLoss}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{ value: 'Esperada', fill: '#f59e0b', fontSize: 10 }}
          />
        )}
        <Area
          type="monotone"
          dataKey="probability"
          stroke="#ef4444"
          strokeWidth={2}
          fill="url(#riskGradient)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
