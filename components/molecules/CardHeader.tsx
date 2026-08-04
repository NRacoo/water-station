import { ReactNode } from "react";
import { LucideIcon } from "lucide-react"

interface CardHeaderProps {
  title: string;
  action?: ReactNode;
  icon?: LucideIcon;
}

export default function CardHeader({ title, action, icon: Icon }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-muted" />}
        <h3 className="font-display text-[15px] font-semibold text-ink">{title}</h3>
      </div>
      {action}
    </div>
  )
}
