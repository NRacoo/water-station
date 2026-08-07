import { Filter, Calendar, Download, Search, LifeBuoy, LayoutGrid, Loader2 } from 'lucide-react'
import Button from '../atoms/Button'
import { useState } from 'react'

export default function ToolbarFilters() {
  const [isDownloading, setIsDownloading] = useState(false)

  async function handleDownload() {
    if (isDownloading) return
    setIsDownloading(true)

    try {
      const res = await fetch('/api/export')
      if (!res.ok) throw new Error(`Gagal mengunduh data (HTTP ${res.status})`)

      const blob = await res.blob()

      const disposition = res.headers.get('Content-Disposition') || ''
      const match = disposition.match(/filename="(.+)"/)
      const filename = match ? match[1] : 'water-station-log.xlsx'

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Gagal mengunduh data. Coba lagi beberapa saat.')
    } finally {
      setIsDownloading(false)
    }
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" icon={isDownloading ? Loader2 : Download} onClick={() => handleDownload()} className={isDownloading ?  'opacity-70 cursor-wait [&>svg]:animate-spin' : 'cursor-pointer'}>
          {isDownloading ? 'Preparing your file' : 'Download Data' }
        </Button>
      </div>
    </div>
  )
}
