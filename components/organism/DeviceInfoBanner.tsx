import { Droplets } from 'lucide-react'
import Badge from '../atoms/Badge'
import IconCircle from '../atoms/IconCircle'

export default function DeviceInfoBanner() {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-primary p-5 text-white shadow-card">
      <div className="flex items-center justify-between">
        <IconCircle icon={Droplets} tone="white" />
        <Badge tone="ink">Live</Badge>
      </div>
      <div className="mt-4">
        <h3 className="font-display text-base font-bold">Status Sensor IR</h3>
        <p className="mt-1 text-sm text-white/80">
          Sensor mendeteksi setiap kali gelas/botol diletakkan di area pengisian,
          data dikirim otomatis ke API Next.js.
        </p>
      </div>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
        <div className="h-full w-2/3 rounded-full bg-white" />
      </div>
    </div>
  )
}
