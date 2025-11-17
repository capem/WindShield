// For Alarm View
export interface AvailabilityAlarm {
  id: string;
  turbineId: string;
  timeOn: Date;
  timeOff: Date | null;
  duration: number; // in hours
  alarmName: string;
  alarmCode: number;
  nonExcusableEnergyLost: number; // in kWh
  excusableEnergyLost: number; // in kWh
  totalEnergyLost: number; // in kWh
}

// For 10-Minute Timestamp View
export interface TimestampData {
  timestamp: Date;
  averagePower: number; // in kW
  averageWindSpeed: number; // in m/s
  energyProduced: number; // in kWh
  activeAlarms: string[]; // comma-separated list of alarm names
  nonExcusableEnergyLost: number; // in kWh
  excusableEnergyLost: number; // in kWh
  totalEnergyLost: number; // in kWh
  energyLostUndefined: number; // in kWh
}

// For the modal component
export interface TurbineAvailabilityModalProps {
  turbineId: string;
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'alarm' | 'timestamp';
}

// For energy loss calculations
export interface EnergyLossCalculationParams {
  windSpeed: number; // in m/s
  maxPower: number; // in MW
  duration: number; // in hours
  isExcusable: boolean;
  hasActiveAlarm: boolean;
}

// For summary statistics
export interface SummaryStats {
  totalNonExcusableLoss: number;
  totalExcusableLoss: number;
  totalLoss: number;
  totalUndefinedLoss: number;
  totalEnergyProduced: number;
  activeAlarmsCount: number;
  availabilityPercentage: string;
}