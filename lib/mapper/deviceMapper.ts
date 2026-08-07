import type { Counter } from "../types/counter";

const deviceMap: Record<string, string> = {
  "cf7bcb3d-5456-4b83-a1d5-a6e1f9f81768": "Water Station 01",
};

export function mapCounterDevice(counter: Counter) {
  return {
    ...counter,
    deviceName: deviceMap[counter.deviceId] ?? counter.deviceId,
  };
}

export function mapCountersDevice(counters: Counter[]) {
  return counters.map(mapCounterDevice);
}