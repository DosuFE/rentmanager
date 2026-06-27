'use client'

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { ChartEmptyState } from '@/components/charts/chart-empty-state'

interface OccupancyDonutChartProps {
  occupied: number
  vacant: number
}

export function OccupancyDonutChart({
  occupied,
  vacant,
}: OccupancyDonutChartProps) {
  const data = [
    { name: 'Occupied', value: occupied, fill: '#171717' },
    { name: 'Vacant', value: vacant, fill: '#d4d4d4' },
  ].filter((item) => item.value > 0)

  const total = occupied + vacant

  if (!total) {
    return <ChartEmptyState message="Add rooms to see occupancy" />
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value} rooms`, 'Count']}
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid var(--border)',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
