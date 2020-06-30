export interface StationApp {
  id: string;
  prefix: string;
  timeseries: Timeseries[]
}

export interface Timeseries {
  id: number;
  key: string;
  lastTime: Date;
}