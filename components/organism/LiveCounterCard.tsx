import { Droplets } from 'lucide-react'
import CardHeader from '../molecules/CardHeader'
import DigitDisplay from '../atoms/DigitDisplay'
import Badge from '../atoms/Badge'

interface LiveCounterProps{
    total:number;
    changePercent?: number
}

export default function LiveCounterCard({ total, changePercent = 0 }: LiveCounterProps) {
  const up = changePercent >= 0
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <CardHeader title="Total Fills Today" icon={Droplets} />
      <div className="mt-4">
        <DigitDisplay value={total} digits={5} />
      </div>
      <div className="mt-3">
        <Badge tone={up ? 'success' : 'danger'}>
          {up ? '+' : ''}{Math.round(changePercent * 100)}% vs kemarin
        </Badge>
      </div>
    </div>
  )
}
