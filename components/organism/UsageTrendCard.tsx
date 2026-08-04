'use client'
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts'
import { Activity } from 'lucide-react'
import CardHeader from '../molecules/CardHeader'
import StatPill from '../molecules/StatPill'

interface TrendPoint {
  label: string;
  value: number;
}

interface TrendProps{
    data: TrendPoint[];
    currentPercent?:number;
}

export default function UsageTrendCard({ data, currentPercent = 0 }: TrendProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <CardHeader title="Usage Trend" icon={Activity} />
      <div className="mt-3">
        <StatPill value={`${currentPercent}%`} label="Hari ini" tone="up" />
      </div>
      <div className="mt-2 h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="label" hide />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', fontSize: 12 }}
            />
            <Line type="monotone" dataKey="value" stroke="#2354E6" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
