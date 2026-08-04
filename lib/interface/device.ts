import { DeviceSummary, TrendData } from "../store";

export interface Device {
  id: string;
  name: string;
  status: "online" | "offline";
  todayCount: number;
}

export interface FillEntry {
  id: number;
  deviceId: string;
  counter: number;
  timestamp: string;
}