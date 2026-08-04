
interface RowProps{
    label?: string;
    date: string;
    percent: number;
}


export default function ProgressRow({ label, date, percent }: RowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
        <span className="text-xs font-bold font-mono">{percent}%</span>
      </div>
      <div className="flex-1">
        <p className="font-display text-sm font-semibold text-ink">{date}</p>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  )
}
