import { LucideIcon } from "lucide-react";
import React, { ReactNode } from "react";

const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    ghost: 'bg-white text-ink border border-slate-200 hover:bg-slate-50',
    subtle: 'bg-primary-light text-primary hover:bg-primary/10',
} as const 

type ButtonVariants = keyof typeof variants;

interface ButtonProps{
    children: ReactNode;
    variant?:ButtonVariants;
    icon: LucideIcon;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
    opacity?: string
}


export default function Button({ children, variant = 'primary', icon: Icon, onClick, className = '', opacity }: ButtonProps) {
  const base = 'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold font-display transition-colors'
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className} opacity-${opacity}`}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  )
}
