import {
	type Alarm,
	AlarmSeverity,
	type Turbine,
	TurbineStatus,
} from "../../types";

// --- CSV PARSING & DATA MAPPING UTILITIES ---

export const parseCSV = (text: string): Record<string, string>[] => {
	try {
		const lines = text.trim().split(/\r\n|\n/);
		if (lines.length < 2) return [];

		const headers = lines[0].split(",").map((h) => h.trim());
		const data = lines
			.slice(1)
			.map((line) => {
				const values = line.split(",").map((v) => v.trim());
				if (values.length === headers.length) {
					return headers.reduce(
						(obj, header, index) => {
							obj[header] = values[index];
							return obj;
						},
						{} as Record<string, string>,
					);
				}
				return null;
			})
			.filter((row): row is Record<string, string> => row !== null);

		return data;
	} catch (error) {
		console.error("Error parsing CSV:", error);
		return [];
	}
};

export const mapCsvRowToTurbine = (row: Record<string, string>): Turbine => {
	const statusMap: { [key: string]: TurbineStatus } = {
		producing: TurbineStatus.Producing,
		available: TurbineStatus.Available,
		offline: TurbineStatus.Offline,
		stopped: TurbineStatus.Stopped,
		maintenance: TurbineStatus.Maintenance,
		fault: TurbineStatus.Fault,
		warning: TurbineStatus.Warning,
		curtailment: TurbineStatus.Curtailment,
	};
	const getNumber = (key: string): number | null => {
		const val = parseFloat(row[key]);
		return Number.isNaN(val) ? null : val;
	};
	return {
		id: `T ${String(row["Turbine ID"]).padStart(3, "0")}`,
		status: statusMap[row.Status?.toLowerCase() || ""] || TurbineStatus.Offline,
		maxPower: getNumber("MaxPower(MW)") || 2.3,
		activePower: getNumber("ActivePower(MW)"),
		reactivePower: getNumber("ReactivePower(MVar)"),
		windSpeed: getNumber("WindSpeed(m/s)"),
		direction: getNumber("Direction(°)"),
		temperature: getNumber("Temperature(°C)"),
		rpm: getNumber("RPM"),
	};
};

// --- WIND FARM LAYOUT & MOCK DATA GENERATION ---

export const layout = {
	"North Zone": [
		{ name: "Line 12", ids: Array.from({ length: 18 }, (_, i) => i + 1) },
		{ name: "Line 11", ids: Array.from({ length: 18 }, (_, i) => 36 - i) },
		{ name: "Line 10", ids: Array.from({ length: 18 }, (_, i) => i + 37) },
		{ name: "Line 9", ids: Array.from({ length: 19 }, (_, i) => 73 - i) },
		{ name: "Line 8", ids: Array.from({ length: 14 }, (_, i) => i + 74) },
	],
	"Tah Zone": [
		{ name: "Line 7", ids: Array.from({ length: 7 }, (_, i) => 94 - i) },
		{ name: "Line 6", ids: Array.from({ length: 6 }, (_, i) => i + 95) },
		{ name: "Line 5", ids: Array.from({ length: 6 }, (_, i) => 106 - i) },
		{ name: "Line 4", ids: Array.from({ length: 6 }, (_, i) => i + 107) },
		{ name: "Line 3", ids: Array.from({ length: 6 }, (_, i) => 118 - i) },
		{ name: "Line 2", ids: Array.from({ length: 7 }, (_, i) => i + 119) },
		{ name: "Line 1", ids: Array.from({ length: 6 }, (_, i) => 131 - i) },
	],
};

export const SWT_2_3_101_SPECS = {
	MAX_POWER: 2.3, // MW
	RPM_RANGE: { min: 6, max: 16 },
	WIND_SPEED_CUT_IN: 3.5, // m/s (average of 3-4)
	WIND_SPEED_NOMINAL: 12.5, // m/s (average of 12-13)
	WIND_SPEED_CUT_OUT: 25, // m/s
};

export const generateTurbineData = (id: number): Turbine => {
	const statuses = [
		TurbineStatus.Producing,
		TurbineStatus.Producing,
		TurbineStatus.Producing,
		TurbineStatus.Producing,
		TurbineStatus.Available,
		TurbineStatus.Stopped,
		TurbineStatus.Offline,
		TurbineStatus.Maintenance,
		TurbineStatus.Fault,
		TurbineStatus.Warning,
		TurbineStatus.Curtailment,
	];
	const status = statuses[Math.floor(Math.random() * statuses.length)];
	const maxPower = SWT_2_3_101_SPECS.MAX_POWER;
	let activePower: number | null = null,
		windSpeed: number | null = null,
		rpm: number | null = null,
		temperature: number | null = null,
		reactivePower: number | null = null,
		direction: number | null = null;

	if (status === TurbineStatus.Producing) {
		activePower = Math.random() * (maxPower - 0.1) + 0.1; // Range 0.1 to 2.3
		const powerRatio = activePower / maxPower;

		// Realistic wind speed based on power output
		windSpeed =
			SWT_2_3_101_SPECS.WIND_SPEED_CUT_IN +
			powerRatio ** 0.7 *
				(SWT_2_3_101_SPECS.WIND_SPEED_NOMINAL -
					SWT_2_3_101_SPECS.WIND_SPEED_CUT_IN);
		windSpeed += (Math.random() - 0.5) * 0.5; // Add some noise
		if (windSpeed > SWT_2_3_101_SPECS.WIND_SPEED_CUT_OUT)
			windSpeed = SWT_2_3_101_SPECS.WIND_SPEED_CUT_OUT; // Cap at cut-out speed

		// Realistic RPM based on power output
		rpm =
			SWT_2_3_101_SPECS.RPM_RANGE.min +
			powerRatio *
				(SWT_2_3_101_SPECS.RPM_RANGE.max - SWT_2_3_101_SPECS.RPM_RANGE.min);
		rpm += (Math.random() - 0.5) * 0.5; // Add some noise
		if (rpm > SWT_2_3_101_SPECS.RPM_RANGE.max)
			rpm = SWT_2_3_101_SPECS.RPM_RANGE.max;
		if (rpm < SWT_2_3_101_SPECS.RPM_RANGE.min)
			rpm = SWT_2_3_101_SPECS.RPM_RANGE.min;

		temperature = 10 + Math.random() * 15;
		reactivePower = activePower * 0.1;
		direction = Math.floor(Math.random() * 360);
	} else if (status === TurbineStatus.Available) {
		activePower = 0.0;
		windSpeed = Math.random() * SWT_2_3_101_SPECS.WIND_SPEED_CUT_IN; // Wind speed below cut-in
		rpm = 0;
		temperature = 10 + Math.random() * 8;
		reactivePower = 0.0;
		direction = Math.floor(Math.random() * 360);
	} else if (status === TurbineStatus.Stopped) {
		activePower = 0.0;
		// Could be high wind (above cut-out) or very low wind
		windSpeed =
			Math.random() > 0.5
				? Math.random() * (SWT_2_3_101_SPECS.WIND_SPEED_CUT_IN - 1)
				: SWT_2_3_101_SPECS.WIND_SPEED_CUT_OUT + Math.random() * 5;
		rpm = 0;
		temperature = 10 + Math.random() * 8;
		reactivePower = 0.0;
		direction = Math.floor(Math.random() * 360);
	}

	return {
		id: `T ${String(id).padStart(3, "0")}`,
		status,
		maxPower,
		activePower:
			activePower !== null ? parseFloat(activePower.toFixed(2)) : null,
		reactivePower:
			reactivePower !== null ? parseFloat(reactivePower.toFixed(1)) : null,
		windSpeed: windSpeed !== null ? parseFloat(windSpeed.toFixed(1)) : null,
		direction,
		temperature: temperature !== null ? Math.round(temperature) : null,
		rpm: rpm !== null ? parseFloat(rpm.toFixed(1)) : null,
	};
};

export const allTurbineIds = Object.values(layout).flatMap((zone) =>
	zone.flatMap((line) => line.ids),
);
export const initialTurbines: Turbine[] =
	allTurbineIds.map(generateTurbineData);

// --- MOCK ANALYTICS DATA GENERATION ---
export const generateMockAnalyticsData = (
	turbines: Turbine[],
): Record<string, Array<Record<string, unknown>>> => {
	const data: Record<string, Array<Record<string, unknown>>> = {};
	const now = new Date();
	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

	const currentDate = new Date(startOfMonth);

	while (currentDate <= now) {
		for (const turbine of turbines) {
			if (!data[turbine.id]) data[turbine.id] = [];

			for (let hour = 0; hour < 24; hour++) {
				const timestamp = new Date(currentDate);
				timestamp.setHours(hour);

				if (timestamp > now) continue;

				const mockTurbineState = generateTurbineData(
					parseInt(turbine.id.replace("T", "").trim(), 10),
				);

				data[turbine.id].push({
					Timestamp: timestamp.toISOString(),
					"Turbine ID": parseInt(turbine.id.replace("T", "").trim(), 10),
					Status: mockTurbineState.status,
					"ActivePower(MW)": mockTurbineState.activePower,
					"ReactivePower(MVar)": mockTurbineState.reactivePower,
					"WindSpeed(m/s)": mockTurbineState.windSpeed,
					"Direction(°)": mockTurbineState.direction,
					"Temperature(°C)": mockTurbineState.temperature,
					RPM: mockTurbineState.rpm,
					"MaxPower(MW)": mockTurbineState.maxPower,
				});
			}
		}
		currentDate.setDate(currentDate.getDate() + 1);
	}
	return data;
};

// --- ALARM DATA & LOGIC ---

export const ALARM_DEFINITIONS: {
	[code: number]: { description: string; severity: AlarmSeverity };
} = {
	101: {
		description: "Generator Overheating",
		severity: AlarmSeverity.Warning,
	},
	102: {
		description: "Brake System Malfunction",
		severity: AlarmSeverity.Critical,
	},
	103: { description: "Pitch System Fault", severity: AlarmSeverity.Warning },
	104: { description: "Low Oil Pressure", severity: AlarmSeverity.Warning },
	105: {
		description: "Emergency Stop Activated",
		severity: AlarmSeverity.Critical,
	},
	201: {
		description: "Grid Connection Lost",
		severity: AlarmSeverity.Critical,
	},
	202: {
		description: "High Vibration Detected",
		severity: AlarmSeverity.Warning,
	},
	301: { description: "Communication Link Down", severity: AlarmSeverity.Info },
};

export const generateInitialAlarms = (turbines: Turbine[]): Alarm[] => {
	const alarms: Alarm[] = [];
	let alarmIdCounter = 0;
	const now = Date.now();

	turbines.forEach((turbine) => {
		// ~15% chance of having any alarm
		if (Math.random() < 0.15) {
			const alarmCode =
				Object.keys(ALARM_DEFINITIONS)[
					Math.floor(Math.random() * Object.keys(ALARM_DEFINITIONS).length)
				];
			const definition = ALARM_DEFINITIONS[parseInt(alarmCode, 10)];
			const isHistorical = Math.random() > 0.4; // 60% are historical

			const timeOn = new Date(now - Math.random() * 24 * 60 * 60 * 1000); // Sometime in the last 24 hours
			let timeOff: Date | null = null;

			if (isHistorical) {
				timeOff = new Date(
					timeOn.getTime() + Math.random() * 2 * 60 * 60 * 1000,
				); // Lasted up to 2 hours
			}

			alarms.push({
				id: `ALM-${++alarmIdCounter}`,
				turbineId: turbine.id,
				code: parseInt(alarmCode, 10),
				...definition,
				timeOn,
				timeOff,
				acknowledged: isHistorical ? true : Math.random() > 0.5, // 50% of active alarms are unacknowledged
			});
		}
	});
	return alarms;
};
