import { History } from 'lucide-react'
import CardHeader from '../molecules/CardHeader'
import ProgressRow from '../molecules/ProgressRow'
import { FillEntry } from '@/lib/interface/device';


interface RecentFillsCardProps {
  fills: FillEntry[];
}

function formatTime(iso:string) : string{
  const d = new Date(iso)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export default function RecentFillsCard({ fills }: RecentFillsCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <CardHeader title="Recent Fills" icon={History} action={<span className="text-xs font-semibold text-primary">Report</span>} />
      <div className="mt-4 flex flex-col gap-4">
        {fills.map((f, i) => (
          <ProgressRow
            key={f.id}
            date={`${formatTime(f.timestamp)} — ${f.deviceId}`}
            percent={Math.max(90 - i * 15, 10)}
          />
        ))}
      </div>
    </div>
  )
}
