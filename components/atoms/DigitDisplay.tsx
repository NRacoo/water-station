// Elemen signature dashboard ini: angka counter ditampilkan
// gaya "meteran digital" (mono, tracking lebar, background gelap)
// untuk menegaskan bahwa ini adalah data dari alat fisik (ESP32).

interface DigitProps{
    value:number;
    digits?:number;
}


export default function DigitDisplay({ value, digits = 5 }: DigitProps) {
  const padded = String(value).padStart(digits, '0').split('')
  return (
    <div className="inline-flex gap-1 rounded-lg bg-ink px-3 py-2 shadow-inner">
      {padded.map((d, i) => (
        <span
          key={i}
          className="font-mono text-2xl font-bold text-aqua tracking-widest w-[1ch] text-center"
        >
          {d}
        </span>
      ))}
    </div>
  )
}
