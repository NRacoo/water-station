'use client'
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, ReferenceLine } from 'recharts'
import { BarChart3 } from 'lucide-react'
import CardHeader from '../molecules/CardHeader'
import Badge from '../atoms/Badge'


interface WeeklyPoint {
  label: string;
  value: number;
}

interface WeeklyProps{
    data: WeeklyPoint[];
}

export default function WeeklyUsageCard({ data }: WeeklyProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <CardHeader
        title="Weekly Fill Report"
        icon={BarChart3}
      />
      <div className="mt-2 flex items-center gap-2">
        <Badge tone="primary">Fills</Badge>
        <Badge tone="aqua">Target 100/hari</Badge>
      </div>
      <div className="mt-3 h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%">
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
            <ReferenceLine y={100} stroke="#94A3B8" strokeDasharray="4 4" />
            <Tooltip
              cursor={{ fill: '#EAF0FE' }}
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', fontSize: 12 }}
            />
            <Bar dataKey="value" radius={[8, 8, 8, 8]} fill="#BFD3FB" activeBar={{ fill: '#2354E6' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
