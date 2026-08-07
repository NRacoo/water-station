import React from "react"


export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <style>{`
        @keyframes hairline-breathe {
          0%, 100% { transform: scaleX(0.18); opacity: 0.35; }
          50%      { transform: scaleX(1);    opacity: 1;    }
        }
        @keyframes label-breathe {
          0%, 100% { opacity: 0.45; letter-spacing: 0.32em; }
          50%      { opacity: 0.9;  letter-spacing: 0.4em;  }
        }
        .dl-hairline {
          animation: hairline-breathe 2.6s cubic-bezier(0.45, 0, 0.55, 1) infinite;
          transform-origin: center;
        }
        .dl-label {
          animation: label-breathe 2.6s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .dl-hairline, .dl-label { animation: none; opacity: 0.7; }
        }
      `}</style>

      <div className="flex flex-col items-center gap-5">
        <div className="dl-hairline h-px w-16 bg-current text-muted" />
        <p className="dl-label font-display text-[11px] uppercase tracking-[0.35em] text-muted">
          Memuat data dashboard
        </p>
      </div>
    </div>
  )
}