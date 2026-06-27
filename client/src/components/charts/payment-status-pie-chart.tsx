'use client'

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { ChartEmptyState } from '@/components/charts/chart-empty-state'

interface PaymentStatusPieChartProps {
  data: { name: string; value: number; fill: string }[]
}

export function PaymentStatusPieChart({ data }: PaymentStatusPieChartProps) {
  if (!data.length) {
    return <ChartEmptyState message="No payment records yet" />
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          dataKey="value"
          label={({ name, value }) => `${name}: ${value}`}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value} payment(s)`, 'Count']}
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid var(--border)',
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
