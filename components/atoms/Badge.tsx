import type { ReactNode } from "react";

const tones = {
  primary: "bg-primary-light text-primary",
  success: "bg-emerald-50 text-success",
  danger: "bg-red-50 text-danger",
  ink: "bg-slate-100 text-ink",
  aqua: "bg-aqua-light text-aqua-dark",
} as const;

type BadgeTone = keyof typeof tones;

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
}

export default function Badge({
  children,
  tone = "primary",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold font-display ${tones[tone]}`}
    >
      {children}
    </span>
  );
}