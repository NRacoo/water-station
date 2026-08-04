import { LucideIcon } from "lucide-react";

const tones = {
primary: 'bg-primary-light text-primary',
aqua: 'bg-aqua-light text-aqua-dark',
white: 'bg-white/15 text-white',
} as const

type IconTone = keyof typeof tones;

interface IconProps{
    icon:LucideIcon;
    tone?:IconTone;
    size?:number;
}

export default function IconCircle({ icon: Icon, tone = 'primary', size = 40 }: IconProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`flex items-center justify-center rounded-full ${tones[tone]}`}
    >
      <Icon size={size * 0.45} />
    </div>
  )
}
