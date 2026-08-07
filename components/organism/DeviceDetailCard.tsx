import { Cpu } from 'lucide-react'
import CardHeader from "../molecules/CardHeader"
import Avatar from '../atoms/Avatar'
import { Device } from '@/lib/interface/device'

interface DeviceDetailCardProps{
    device?: Device
}

export default function DeviceDetailCard({ device } : DeviceDetailCardProps) {
  if (!device) return null
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <CardHeader
        title="Device Information"
        icon={Cpu}
      />
      <div className="mt-4 flex items-center gap-3">
        <Avatar initials="ESP" tone="primary" size={44} />
        <div>
          <p className="font-display text-sm font-semibold text-ink">{device.name}</p>
          <p className="text-xs text-muted">{device.id}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-muted">Sensor Type</p>
          <p className="font-display font-semibold text-ink">IR Obstacle Sensor</p>
        </div>
        <div>
          <p className="text-xs text-muted">Board</p>
          <p className="font-display font-semibold text-ink">ESP32 Dev Kit</p>
        </div>
        <div>
          <p className="text-xs text-muted">Debounce Delay</p>
          <p className="font-display font-semibold text-ink">30 second</p>
        </div>
        <div>
          <p className="text-xs text-muted">Fills Hari Ini</p>
          <p className="font-display font-semibold text-ink">{device.todayCount}</p>
        </div>
      </div>
    </div>
  )
}
