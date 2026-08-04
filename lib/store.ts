// lib/store.ts
// -----------------------------------------------------------------------
// Penyimpanan sederhana berbasis file JSON untuk log counter dari ESP32.
//
// CATATAN PENTING:
// File-based storage ini cocok untuk development/self-hosted (mis. dijalankan
// di Raspberry Pi / VPS / laptop yang selalu nyala). Kalau nanti deploy ke
// platform serverless (Vercel dkk), filesystem-nya read-only/temporary,
// sehingga data TIDAK akan persist. Untuk production, ganti fungsi-fungsi
// di bawah ini dengan koneksi ke database sungguhan (Postgres/Supabase/
// Turso/SQLite via Prisma) — struktur data (array of {timestamp, deviceId,
// counter}) bisa dipakai langsung sebagai skema tabel "fills".
// -----------------------------------------------------------------------

import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "log.json");

export interface FillEntry {
  id: number;
  deviceId: string;
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

function readLog(): FillEntry[] {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as FillEntry[];
  } catch {
    return [];
  }
}

function writeLog(entries: FillEntry[]): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(entries, null, 2));
}

export function appendFillEvent({
  deviceId,
  counter,
}: {
  deviceId: string;
  counter: number;
}): FillEntry {
  const entries = readLog();

  const newEntry: FillEntry = {
    id: entries.length + 1,
    deviceId,
    counter,
    timestamp: new Date().toISOString(),
  };

  entries.push(newEntry);
  writeLog(entries);

  return newEntry;
}

export function getAllEntries(): FillEntry[] {
  return readLog();
}

export function summarize(entries: FillEntry[]): DashboardSummary {
  const today = new Date().toDateString();

  const todaysEntries = entries.filter(
    (e) => new Date(e.timestamp).toDateString() === today
  );

  // Total & rata-rata
  const totalToday = todaysEntries.length;

  const hours =
    new Set(
      todaysEntries.map((e) => new Date(e.timestamp).getHours())
    ).size || 1;

  const avgPerHour = Number((totalToday / hours).toFixed(1));

  // Tren per jam
  const hourlyMap: Record<string, number> = {};

  todaysEntries.forEach((e) => {
    const hour = new Date(e.timestamp).getHours();
    const label = `${String(hour).padStart(2, "0")}:00`;

    hourlyMap[label] = (hourlyMap[label] ?? 0) + 1;
  });

  const hourlyTrend: TrendData[] = Object.entries(hourlyMap).map(
    ([label, value]) => ({
      label,
      value,
    })
  );

  // Tren mingguan
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const weeklyMap: Record<string, number> = {};

  entries.forEach((e) => {
    const day = new Date(e.timestamp);
    const label = dayNames[day.getDay()];

    weeklyMap[label] = (weeklyMap[label] ?? 0) + 1;
  });

  const weeklyUsage: TrendData[] = dayNames.map((label) => ({
    label,
    value: weeklyMap[label] ?? 0,
  }));

  // Ringkasan device
  const now = Date.now();

  const deviceMap: Record<
    string,
    {
      id: string;
      name: string;
      todayCount: number;
      lastSeen: number;
    }
  > = {};

  entries.forEach((e) => {
    if (!deviceMap[e.deviceId]) {
      deviceMap[e.deviceId] = {
        id: e.deviceId,
        name: e.deviceId,
        todayCount: 0,
        lastSeen: 0,
      };
    }

    deviceMap[e.deviceId].lastSeen = Math.max(
      deviceMap[e.deviceId].lastSeen,
      new Date(e.timestamp).getTime()
    );

    if (new Date(e.timestamp).toDateString() === today) {
      deviceMap[e.deviceId].todayCount++;
    }
  });

  const devices: DeviceSummary[] = Object.values(deviceMap).map((device) => ({
    ...device,
    status:
      now - device.lastSeen < 10 * 60 * 1000 ? "online" : "offline",
  }));

  const recentFills = [...entries].reverse().slice(0, 5);

  return {
    totalToday,
    avgPerHour,
    hourlyTrend,
    weeklyUsage,
    devices,
    recentFills,
  };
}