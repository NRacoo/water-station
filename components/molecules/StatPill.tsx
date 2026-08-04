interface StatRows{
    label:string;
    value:string;
    tone?:string;
}

export default function StatPill({ label, value, tone = 'up' }: StatRows) {
  const toneClass = tone === 'up' ? 'text-success bg-emerald-50' : 'text-danger bg-red-50'
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-3xl font-bold text-ink">{value}</span>
      {label && <span className={`rounded-full px-2 py-0.5 text-xs font-semibold font-display ${toneClass}`}>{label}</span>}
    </div>
  )
}
