"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface ChartData {
  name: string
  enrollments: number
}

export function AnalyticsChart({ data }: { data: ChartData[] }) {
  return (
    <div className="h-[300px] w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--hairline-soft)" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--canvas)', 
              borderColor: 'var(--hairline)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              fontSize: '14px',
              fontWeight: 500
            }}
            itemStyle={{ color: 'var(--ink)' }}
            labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px' }}
            cursor={{ stroke: 'var(--hairline)', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          <Line 
            type="monotone" 
            dataKey="enrollments" 
            stroke="var(--ink)" 
            strokeWidth={2}
            dot={{ fill: 'var(--canvas)', stroke: 'var(--ink)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: 'var(--ink)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
