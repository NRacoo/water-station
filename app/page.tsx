"use client"
import ConnectedDevicesCard from "@/components/organism/ConnectedDevice";
import DeviceDetailCard from "@/components/organism/DeviceDetailCard";
import DeviceInfoBanner from "@/components/organism/DeviceInfoBanner";
import GreetingHeader from "@/components/organism/GreetingHeader";
import LiveCounterCard from "@/components/organism/LiveCounterCard";
import RecentFillsCard from "@/components/organism/RecentsFillsCard";
import ToolbarFilters from "@/components/organism/ToolbarFilter";
import UsageTrendCard from "@/components/organism/UsageTrendCard";
import WeeklyUsageCard from "@/components/organism/WeeklyUsageCard";
import DashboardLayout from "@/components/templates/DashboardLayout";
import type { DashboardSummary } from "@/lib/interface/device";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface CounterResponse extends DashboardSummary {
  status: string;
}

const POLL_INTERVAL_MS = 5000; 

export default function Home() {
  const [active, setActive] = useState("Dashboard");
  const [summary, setSummary] = useState<DashboardSummary | null>(null)

  useEffect(() => { 
    let cancelled = false; 
    async function load() { 
      try { 
        const res = await fetch("/api/counter", { cache: "no-store", }); 
        if (!res.ok) { throw new Error("Failed to fetch dashboard data"); } 
        const json: CounterResponse = await res.json(); 
        if (!cancelled) { const { status, ...dashboard } = json; 
        if (status) { setSummary(dashboard); } } } 
      catch (error) { 
        console.error("Gagal memuat data counter:", error); } } load(); 
        const interval = setInterval(load, POLL_INTERVAL_MS); 
        return () => { cancelled = true; clearInterval(interval); }; 
      }, []);

  if (!summary) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface">
        <Loader2 className="mb-4 h-6 w-6 animate-spin text-foreground" />
        <p className="font-display text-sm text-muted">Load Dashboard Data</p>
      </div>
    )
  }



  return (
      <DashboardLayout
        header={<GreetingHeader name="People"/>}
        toolbar={<ToolbarFilters/>}
        rowOne={
          <>
          <LiveCounterCard total={summary.totalToday} changePercent={summary.changePercent}/>
          <DeviceInfoBanner/>
          <UsageTrendCard data={summary.hourlyTrend} currentPercent={summary.dailyProgress}/>
          <RecentFillsCard fills={summary.recentFills}/>
          </>
        }
        rowTwo = {
          <>
            <DeviceDetailCard device={summary.devices[0]}/>
            <WeeklyUsageCard data={summary.weeklyUsage}/>
            <ConnectedDevicesCard devices={summary.devices}/>
          </>
        }
      />
  );
}
