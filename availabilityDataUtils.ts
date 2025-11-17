import type { AvailabilityAlarm, TimestampData, EnergyLossCalculationParams, SummaryStats } from './availabilityTypes';

// Alarm definitions for mock data generation
const ALARM_DEFINITIONS = [
  { code: 101, name: "Generator Overheating", excusable: false },
  { code: 102, name: "Brake System Malfunction", excusable: false },
  { code: 103, name: "Pitch System Fault", excusable: false },
  { code: 104, name: "Low Oil Pressure", excusable: false },
  { code: 105, name: "Emergency Stop Activated", excusable: false },
  { code: 201, name: "Grid Connection Lost", excusable: true },
  { code: 202, name: "High Vibration Detected", excusable: false },
  { code: 301, name: "Extreme Wind Speed", excusable: true },
  { code: 302, name: "Lightning Strike", excusable: true },
  { code: 303, name: "Icing Conditions", excusable: true }
];

// Generate mock alarm data for a turbine
export const generateAlarmData = (turbineId: string): AvailabilityAlarm[] => {
  const alarms: AvailabilityAlarm[] = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Generate 5-15 random alarms in the last 30 days
  const alarmCount = Math.floor(Math.random() * 10) + 5;
  
  for (let i = 0; i < alarmCount; i++) {
    const alarmDef = ALARM_DEFINITIONS[Math.floor(Math.random() * ALARM_DEFINITIONS.length)];
    const timeOn = new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
    
    // Some alarms are still active
    const isActive = Math.random() > 0.7;
    const timeOff = isActive ? null : new Date(timeOn.getTime() + Math.random() * 24 * 60 * 60 * 1000);
    
    const duration = timeOff ? (timeOff.getTime() - timeOn.getTime()) / (1000 * 60 * 60) : (now.getTime() - timeOn.getTime()) / (1000 * 60 * 60);
    
    // Generate random wind speed for the alarm period
    const windSpeed = Math.random() * 25 + 3; // 3-28 m/s
    
    // Calculate energy loss
    const { nonExcusableEnergyLost, excusableEnergyLost } = calculateEnergyLoss({
      windSpeed,
      maxPower: 2.3, // MW
      duration,
      isExcusable: alarmDef.excusable,
      hasActiveAlarm: true
    });
    
    alarms.push({
      id: `ALM-${turbineId}-${i}`,
      turbineId,
      timeOn,
      timeOff,
      duration,
      alarmName: alarmDef.name,
      alarmCode: alarmDef.code,
      nonExcusableEnergyLost,
      excusableEnergyLost,
      totalEnergyLost: nonExcusableEnergyLost + excusableEnergyLost
    });
  }
  
  return alarms.sort((a, b) => b.timeOn.getTime() - a.timeOn.getTime());
};

// Generate mock timestamp data for a turbine
export const generateTimestampData = (turbineId: string): TimestampData[] => {
  const timestamps: TimestampData[] = [];
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Generate 10-minute intervals for the last 7 days
  for (let time = new Date(sevenDaysAgo); time <= now; time.setMinutes(time.getMinutes() + 10)) {
    // Generate random wind speed
    const averageWindSpeed = Math.random() * 25 + 3; // 3-28 m/s
    
    // Calculate potential power based on wind speed
    let averagePower = 0;
    if (averageWindSpeed >= 3.5 && averageWindSpeed <= 25) {
      // Simple power curve: 0 at 3.5 m/s, max at 12.5 m/s, decreasing to 0 at 25 m/s
      if (averageWindSpeed <= 12.5) {
        averagePower = (averageWindSpeed - 3.5) / (12.5 - 3.5) * 2300; // kW
      } else {
        averagePower = (25 - averageWindSpeed) / (25 - 12.5) * 2300; // kW
      }
    }
    
    // Randomly determine if there are active alarms (20% chance)
    const hasActiveAlarms = Math.random() < 0.2;
    const activeAlarms = hasActiveAlarms 
      ? [ALARM_DEFINITIONS[Math.floor(Math.random() * ALARM_DEFINITIONS.length)].name]
      : [];
    
    // Calculate energy produced (kWh) in this 10-minute interval
    const energyProduced = averagePower * (10 / 60); // kW * (10/60) hours
    
    // Calculate energy loss
    const { nonExcusableEnergyLost, excusableEnergyLost } = calculateEnergyLoss({
      windSpeed: averageWindSpeed,
      maxPower: 2.3, // MW
      duration: 10 / 60, // 10 minutes in hours
      isExcusable: hasActiveAlarms && activeAlarms.some(name => 
        ALARM_DEFINITIONS.find(def => def.name === name)?.excusable
      ),
      hasActiveAlarm: hasActiveAlarms
    });
    
    // Calculate undefined energy loss (periods with sufficient wind but no production and no active alarms)
    let energyLostUndefined = 0;
    if (!hasActiveAlarms && averageWindSpeed >= 3.5 && averageWindSpeed <= 25 && averagePower < 100) {
      // If wind is sufficient but production is low and no alarms, count as undefined loss
      const potentialEnergy = 2300 * (10 / 60); // Max power * time
      energyLostUndefined = potentialEnergy - energyProduced;
    }
    
    timestamps.push({
      timestamp: new Date(time),
      averagePower,
      averageWindSpeed,
      energyProduced,
      activeAlarms,
      nonExcusableEnergyLost,
      excusableEnergyLost,
      totalEnergyLost: nonExcusableEnergyLost + excusableEnergyLost,
      energyLostUndefined
    });
  }
  
  return timestamps;
};

// Calculate energy loss based on parameters
export const calculateEnergyLoss = (params: EnergyLossCalculationParams): {
  nonExcusableEnergyLost: number;
  excusableEnergyLost: number;
} => {
  const { windSpeed, maxPower, duration, isExcusable, hasActiveAlarm } = params;
  
  // If wind speed is outside the operational range, no energy loss
  if (windSpeed < 3.5 || windSpeed > 25) {
    return { nonExcusableEnergyLost: 0, excusableEnergyLost: 0 };
  }
  
  // Calculate potential energy (kWh)
  let potentialPower = 0;
  
  // Simple power curve: 0 at 3.5 m/s, max at 12.5 m/s, decreasing to 0 at 25 m/s
  if (windSpeed <= 12.5) {
    potentialPower = (windSpeed - 3.5) / (12.5 - 3.5) * maxPower; // MW
  } else {
    potentialPower = (25 - windSpeed) / (25 - 12.5) * maxPower; // MW
  }
  
  const potentialEnergy = potentialPower * duration; // MWh
  const potentialEnergyKWh = potentialEnergy * 1000; // kWh
  
  // If there's no active alarm, no energy loss
  if (!hasActiveAlarm) {
    return { nonExcusableEnergyLost: 0, excusableEnergyLost: 0 };
  }
  
  // Calculate energy loss based on whether it's excusable or not
  if (isExcusable) {
    return { nonExcusableEnergyLost: 0, excusableEnergyLost: potentialEnergyKWh };
  } else {
    return { nonExcusableEnergyLost: potentialEnergyKWh, excusableEnergyLost: 0 };
  }
};

// Calculate summary statistics
export const calculateSummaryStats = (
  alarmData: AvailabilityAlarm[],
  timestampData: TimestampData[]
): SummaryStats => {
  const totalNonExcusableLoss = alarmData.reduce((sum, alarm) => sum + alarm.nonExcusableEnergyLost, 0);
  const totalExcusableLoss = alarmData.reduce((sum, alarm) => sum + alarm.excusableEnergyLost, 0);
  const totalLoss = totalNonExcusableLoss + totalExcusableLoss;
  
  const totalUndefinedLoss = timestampData.reduce((sum, item) => sum + item.energyLostUndefined, 0);
  
  const totalEnergyProduced = timestampData.reduce((sum, item) => sum + item.energyProduced, 0);
  
  const activeAlarmsCount = alarmData.filter(alarm => !alarm.timeOff).length;
  
  return {
    totalNonExcusableLoss,
    totalExcusableLoss,
    totalLoss,
    totalUndefinedLoss,
    totalEnergyProduced,
    activeAlarmsCount,
    availabilityPercentage: totalEnergyProduced > 0 
      ? ((totalEnergyProduced / (totalEnergyProduced + totalLoss)) * 100).toFixed(2)
      : '0.00'
  };
};