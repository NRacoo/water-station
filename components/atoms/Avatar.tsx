const tones = {
  primary: "bg-primary text-white",
  aqua: "bg-aqua text-white",
  slate: "bg-slate-200 text-ink",
} as const;

type Tone = keyof typeof tones;

interface AvatarProps {
  initials: string;
  size?: number;
  tone?: Tone;
}

export default function Avatar({
  initials,
  size = 40,
  tone = "primary",
}: AvatarProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`flex items-center justify-center rounded-full font-display font-semibold text-sm ${tones[tone]}`}
    >
      {initials}
    </div>
  );
}