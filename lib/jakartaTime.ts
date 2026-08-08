const JAKARTA_TZ = "Asia/Jakarta";

function getJakartaHour(date: Date | string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: JAKARTA_TZ,
    hour: "2-digit",
    hour12: false,
  }).formatToParts(new Date(date));

  return Number(
    parts.find((part) => part.type === "hour")?.value
  );
}

function getJakartaDay(date: Date | string): number {
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: JAKARTA_TZ,
    weekday: "short",
  }).format(new Date(date));

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return dayMap[day];
}