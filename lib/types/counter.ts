export interface Counter {
  id: string;
  deviceId: string;
  counter: number;
}

export interface MappedCounter extends Counter {
  deviceName: string;
}