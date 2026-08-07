import { Router } from 'lucide-react'
import CardHeader from '../molecules/CardHeader'
import DeviceStatusRow from '../molecules/DeviceStatusRow'
import { Device } from '@/lib/interface/device';


interface ConnectedDevicesCardProps {
  devices: Device[];
}

export default function ConnectedDevicesCard({ devices } : ConnectedDevicesCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <CardHeader
        title="Connected Devices"
        icon={Router}
      />
      <div className="mt-4 flex flex-col gap-4">
        {devices.map((d) => (
          <DeviceStatusRow key={d.id} name={d.name} status={d.status} todayCount={d.todayCount} />
        ))}
      </div>
    </div>
  )
}
