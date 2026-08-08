import fs from "fs";
import path from "path";
import { DashboardSummary, Devices, DeviceSummary, FillEntry, TrendData } from "./interface/device";
import { prisma } from "./prisma";

function getJakartaYMD(date: Date | string = new Date()) {
  const d = new Date(date);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const y = +parts.find((p) => p.type === "year")!.value;
  const m = +parts.find((p) => p.type === "month")!.value;
  const day = +parts.find((p) => p.type === "day")!.value;

  return { y, m, day };
}


function getJakartaHour(date: Date | string): number {
  const d = new Date(date);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(d);

  let hour = parseInt(parts.find((p) => p.type === "hour")!.value, 10);
  if (hour === 24) hour = 0;
  return hour;
}


function getJakartaDayIndex(date: Date | string): number {
  const d = new Date(date);
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
  }).format(d);

  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[weekday];
}


function jakartaMidnightUTC(y: number, m: number, day: number): Date {
  return new Date(Date.UTC(y, m - 1, day, 0, 0, 0) - 7 * 60 * 60 * 1000);
}

function startOfJakartaDay(date: Date | string = new Date()): Date {
  const { y, m, day } = getJakartaYMD(date);
  return jakartaMidnightUTC(y, m, day);
}

// ---------------------------------------------------------------------------

export async function appendFillEvent({
  deviceId,
  counter,
}: {
  deviceId: string;
  counter: number;
}) {
  return prisma.counter.create({
    data: { deviceId, counter },
  });
}

export async function getAllEntries() {
  return prisma.counter.findMany({
    include: { device: true },
    orderBy: { timestamp: "asc" },
  });
}

export async function summarize() {
  const DAILY_TARGET = 100;

  const startOfToday = startOfJakartaDay();
  const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
  const endOfYesterday = startOfToday;
  const sevenDaysAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [todaysEntries, yesterdayEntries, weekEntries, devices] = await Promise.all([
    prisma.counter.findMany({
      where: { timestamp: { gte: startOfToday } },
      include: { device: true },
      orderBy: { timestamp: "asc" },
    }),

    prisma.counter.findMany({
      where: {
        timestamp: {
          gte: startOfYesterday,
          lt: endOfYesterday,
        },
      },
    }),

    prisma.counter.findMany({
      where: { timestamp: { gte: sevenDaysAgo } },
    }),

    prisma.device.findMany({
      where: { isActive: true },
      include: {
        counters: {
          where: { timestamp: { gte: startOfToday } },
        },
        _count: { select: { counters: true } },
      },
    }),
  ]);

  const totalToday = todaysEntries.reduce((total, entry) => total + entry.counter, 0);
  const dailyProgress = Math.min((totalToday / DAILY_TARGET) * 100, 100);

  const hours =
    new Set(todaysEntries.map((e) => getJakartaHour(e.timestamp))).size || 1;

  const avgPerHour = +(totalToday / hours).toFixed(1);

  const hourlyMap: Record<string, number> = {};

  todaysEntries.forEach((e) => {
    const h = getJakartaHour(e.timestamp);
    const label = `${String(h).padStart(2, "0")}:00`;
    hourlyMap[label] = (hourlyMap[label] || 0) + e.counter;
  });

  const hourlyTrend = Object.entries(hourlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, value]) => ({ label, value: Math.min(value, 100) }));

  // Tren mingguan (7 hari terakhir)
  // index harus sama persis dengan getDay()/getJakartaDayIndex(): 0=Sunday..6=Saturday
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weeklyMap: Record<string, number> = {};

  weekEntries.forEach((e) => {
    const label = dayNames[getJakartaDayIndex(e.timestamp)];
    weeklyMap[label] = (weeklyMap[label] || 0) + e.counter;
  });

  const weeklyUsage = dayNames.map((label) => ({
    label,
    value: weeklyMap[label] || 0,
  }));

  // Status device: "online" jika ada event dalam 10 menit terakhir
  const now = Date.now();

  const deviceList = devices.map((d) => {
    const lastEvent = d.counters[d.counters.length - 1];

    const lastSeen = lastEvent ? new Date(lastEvent.timestamp).getTime() : 0;

    const todayCount = d.counters.reduce((total, entry) => total + entry.counter, 0);

    return {
      id: d.id,
      name: d.name,
      project: d.project,
      todayCount,
      status: now - lastSeen < 10 * 60 * 1000 ? "online" : "offline",
    };
  });

  const recentFills = [...todaysEntries]
    .reverse()
    .slice(0, 5)
    .map((e) => ({
      id: e.id,
      deviceId: e.deviceId,
      deviceName: e.device.name,
      counter: e.counter,
      timestamp: e.timestamp,
    }));

  const totalYesterday = yesterdayEntries.reduce((total, entry) => total + entry.counter, 0);

  const changePercent =
    totalYesterday === 0 ? null : (totalToday - totalYesterday) / totalYesterday;

  return {
    totalToday,
    avgPerHour,
    totalYesterday,
    changePercent,
    dailyProgress,
    dailyTarget: DAILY_TARGET,
    hourlyTrend,
    weeklyUsage,
    devices: deviceList,
    recentFills,
  };
}

export async function registerDevice({ name, project, location }: Devices) {
  return prisma.device.create({
    data: { name, project, location },
  });
}

export async function getAllDevices() {
  return prisma.device.findMany({ orderBy: { createdAt: "desc" } });
}