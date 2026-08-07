import fs from "fs";
import path from "path";
import { DashboardSummary, Devices, DeviceSummary, FillEntry, TrendData } from "./interface/device";
import { prisma } from "./prisma";


export async function appendFillEvent({
  deviceId,
  counter,
}: {
  deviceId: string
  counter: number
}) {
  return prisma.counter.create({
    data: { deviceId, counter },
  })
}


export async function getAllEntries() {
  return prisma.counter.findMany({
    include: { device: true },
    orderBy: { timestamp: 'asc' },
  })
}


export async function summarize() {
  const DAILY_TARGET = 100;
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)

  const endOfYesterday = new Date(startOfToday)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const [todaysEntries, yesterdayEntries, weekEntries, devices] = await Promise.all([
    prisma.counter.findMany({
      where: { timestamp: { gte: startOfToday } },
      include:{ device: true },
      orderBy: { timestamp: 'asc' },
    }),

    prisma.counter.findMany({
      where:{
        timestamp:{
          gte:startOfYesterday,
          lt:endOfYesterday,
        }
      }
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
  ])

  const totalToday = todaysEntries.reduce(
    (total, entry) => total + entry.counter, 0
  )
  const dailyProgress = Math.min(
    (totalToday/DAILY_TARGET) * 100, 100
  )

  const hours =
    new Set(
      todaysEntries.map((e) => new Date(e.timestamp).getHours())
    ).size || 1

  const avgPerHour = +(totalToday / hours).toFixed(1)

  const hourlyMap: Record<string, number> = {}

  todaysEntries.forEach((e) => {
    const h = new Date(e.timestamp).getHours()
    const label = `${String(h).padStart(2, '0')}:00`
    hourlyMap[label] = (hourlyMap[label] || 0) + e.counter;
  })

  const hourlyTrend = Object.entries(hourlyMap).map(
    ([label, value]) => ({ label, value: Math.min(value, 100) })
  )

  // Tren mingguan (7 hari terakhir)
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
  const weeklyMap: Record<string, number> = {}

  weekEntries.forEach((e) => {
    const label = dayNames[new Date(e.timestamp).getDay()]
    weeklyMap[label] = (weeklyMap[label] || 0) + e.counter
  })

  const weeklyUsage = dayNames.map((label) => ({
    label,
    value: weeklyMap[label] || 0,
  }))

  // Status device: "online" jika ada event dalam 10 menit terakhir
  const now = Date.now()

  const deviceList = devices.map((d) => {
    const lastEvent = d.counters[d.counters.length - 1]

    const lastSeen = lastEvent
      ? new Date(lastEvent.timestamp).getTime()
      : 0

    const todayCount = d.counters.reduce((total, entry) => total + entry.counter, 0)

    return {
      id: d.id,
      name: d.name,
      project: d.project,
      todayCount,
      status:
        now - lastSeen < 10 * 60 * 1000
          ? 'online'
          : 'offline',
    }
  })

  const recentFills = [...todaysEntries]
    .reverse()
    .slice(0, 5)
    .map((e) => ({
      id: e.id,
      deviceId: e.deviceId,
      deviceName: e.device.name,
      counter:e.counter,
      timestamp: e.timestamp,
    }))


    const totalYesterday = yesterdayEntries.reduce(
      (total, entry) => total + entry.counter,
      0
    )

    const changePercent =
    totalYesterday === 0
      ? null
      : (totalToday - totalYesterday) / totalYesterday

  return {
    totalToday,
    avgPerHour,
    totalYesterday,
    changePercent,
    dailyProgress,
    dailyTarget:DAILY_TARGET,
    hourlyTrend,
    weeklyUsage,
    devices: deviceList,
    recentFills,
  }
}
export async function registerDevice({name, project, location} : Devices){
  return prisma.device.create({
    data:{
      name, project, location
    }
  })
}

export async function getAllDevices() {
  return prisma.device.findMany({ orderBy: { createdAt: "desc"} });
}