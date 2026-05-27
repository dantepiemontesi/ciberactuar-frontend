'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface GaugeScoreProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

export function GaugeScore({ score, size = 'md' }: GaugeScoreProps) {
  const clampedScore = Math.max(0, Math.min(100, score))
  
  // Color based on score
  const getColor = (s: number) => {
    if (s >= 70) return '#10b981' // emerald
    if (s >= 40) return '#f59e0b' // amber
    return '#ef4444' // red
  }
  
  const getLabel = (s: number) => {
    if (s >= 70) return 'Seguro'
    if (s >= 40) return 'En Riesgo'
    return 'Peligro'
  }

  const color = getColor(clampedScore)
  const remaining = 100 - clampedScore

  const data = [
    { value: clampedScore, color },
    { value: remaining, color: '#1e293b' },
  ]

  const dimensions = {
    sm: { height: 120, outerR: 50, innerR: 35, fontSize: 'text-xl' },
    md: { height: 160, outerR: 70, innerR: 50, fontSize: 'text-3xl' },
    lg: { height: 200, outerR: 90, innerR: 65, fontSize: 'text-4xl' },
  }

  const dim = dimensions[size]

  return (
    <div className="relative flex flex-col items-center">
      <div style={{ height: dim.height, width: dim.height * 1.2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="70%"
              startAngle={180}
              endAngle={0}
              outerRadius={dim.outerR}
              innerRadius={dim.innerR}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Score overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className={`${dim.fontSize} font-bold`} style={{ color }}>
            {clampedScore}
          </span>
          <span className="text-slate-400 text-xs">/ 100</span>
          <span className="text-xs font-medium mt-1" style={{ color }}>
            {getLabel(clampedScore)}
          </span>
        </div>
      </div>
    </div>
  )
    }
