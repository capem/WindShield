export enum TurbineStatus {
  Producing = 'producing',
  Available = 'available',
  Offline = 'offline',
  Stopped = 'stopped',
}

export interface Turbine {
  id: string;
  status: TurbineStatus;
  activePower: number | null;
  maxPower: number;
  reactivePower: number | null;
  windSpeed: number | null;
  direction: number | null;
  temperature: number | null;
  rpm: number | null;
}