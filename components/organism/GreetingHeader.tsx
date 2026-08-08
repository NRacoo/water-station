import { Plus } from 'lucide-react'
import Button from '../atoms/Button'

interface GreetingProps{
  name:string;
  onCheckNew?: () => void,
  className?:string
}

export default function GreetingHeader({ name, onCheckNew, className="hidden" } : GreetingProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Good Morning, {name}!
        </h1>
        <p className="mt-1 text-sm text-muted">
          Berikut ringkasan aktivitas water station hari ini.
        </p>
      </div>
    </div>
  )
}
