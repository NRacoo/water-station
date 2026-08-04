import { Wifi, WifiOff } from 'lucide-react'
import Avatar from '../atoms/Avatar'
import Badge from '../atoms/Badge'

interface DeviceProps{
    name:string;
    id:string;
    status:string;
    todayCount:number;
}

export default function DeviceStatusRow({ name, id, status, todayCount }:DeviceProps) {
  const online = status === 'online'
  return (
    <div className="flex items-center gap-3">
      <Avatar initials={id.slice(-2)} tone={online ? 'aqua' : 'slate'} />
      <div className="flex-1">
        <p className="font-display text-sm font-semibold text-ink">{name}</p>
        <p className="text-xs text-muted">{id}</p>
      </div>
      <div className="text-right">
        <p className="font-mono text-sm font-bold text-ink">{todayCount}</p>
        <Badge tone={online ? 'success' : 'danger'}>
          {online ? <Wifi size={11} /> : <WifiOff size={11} />}
          {online ? 'Online' : 'Offline'}
        </Badge>
      </div>
    </div>
  )
}
