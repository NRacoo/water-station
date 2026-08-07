import { ReactNode } from "react";

interface DashboardLayoutProps {
  header?: ReactNode;
  toolbar: ReactNode;
  rowOne: ReactNode;
  rowTwo: ReactNode;
}

export default function DashboardLayout({ header, toolbar, rowOne, rowTwo }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-surface px-4 py-5 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-350 flex-col gap-6">
        {header}
        <div className="wave-divider rounded-full" />
        {toolbar}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {rowOne}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.6fr_1fr]">
          {rowTwo}
        </div>
      </div>
    </div>
  )
}
