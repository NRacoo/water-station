export interface Device {
  id: string;
  name: string;
  status: "online" | "offline";
  todayCount: number;
}

export interface FillEntry {
  id: number;
  deviceId: string;
  deviceName: string;
  counter: number;
  timestamp: string;
}

export interface DeviceSummary {
  id: string;
  name: string;
  todayCount: number;
  lastSeen: number;
  status: "online" | "offline";
}

export interface TrendData {
  label: string;
  value: number;
}

export interface DashboardSummary {
  totalToday: number;
  avgPerHour: number;
  hourlyTrend: TrendData[];
  weeklyUsage: TrendData[];
  devices: DeviceSummary[];
  recentFills: FillEntry[];
}

export interface Devices{
  name:string;
  project:string;
  location:string;
}