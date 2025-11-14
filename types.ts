export enum TurbineStatus {
  Producing = 'producing',
  Available = 'available',
  Offline = 'offline',
  Stopped = 'stopped',
  Maintenance = 'maintenance',
  Fault = 'fault',
  Warning = 'warning',
  Curtailement = 'curtailement',
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

export enum AlarmSeverity {
  Critical = 'Critical',
  Warning = 'Warning',
  Info = 'Info',
}

export interface Alarm {
  id: string;
  turbineId: string;
  code: number;
  description: string;
  severity: AlarmSeverity;
  timeOn: Date;
  timeOff: Date | null;
  acknowledged: boolean;
}
