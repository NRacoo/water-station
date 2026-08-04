import { Filter, Calendar, Download, Search, LifeBuoy, LayoutGrid } from 'lucide-react'
import Button from '../atoms/Button'

export default function ToolbarFilters() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" icon={Filter}>Filter</Button>
        <Button variant="ghost" icon={Calendar}>Monthly</Button>
        <Button variant="ghost" icon={Download}>Download Data</Button>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white">
          <Search size={16} className="text-ink" />
        </button>
        <Button variant="ghost" icon={LifeBuoy}>Support</Button>
        <Button variant="ghost" icon={LayoutGrid}>Content Layout</Button>
      </div>
    </div>
  )
}
