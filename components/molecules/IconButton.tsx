import { LucideIcon } from "lucide-react";

interface IconProps {
  icon: LucideIcon;
  badge?: boolean;
}


export default function IconButton({ icon: Icon, badge = false } : IconProps) {
  return (
    <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50">
      <Icon size={18} className="text-ink" />
      {badge && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-danger" />}
    </button>
  )
}
