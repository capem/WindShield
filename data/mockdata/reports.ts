// --- MOCK DATA FOR REPORT ---

export const KPI_DATA = [
	{
		label: "November",
		unavailabilityTotalTime: 3.05,
		unavailabilityTotalEnergy: 3.12,
		unavailabilityTarecTime: 1.97,
		unavailabilityTarecEnergy: 0.88,
		unavailabilitySgreTime: 1.08,
		unavailabilitySgreEnergy: 2.24,
		electricalLosses: 1249.5,
		powerBoost: 456.67,
		avgTurbinePerformance: 100.13,
		mtbf: 11.56,
		mttr: 4.14,
		mtti: 2.44,
	},
	{
		label: "2025",
		unavailabilityTotalTime: 2.77,
		unavailabilityTotalEnergy: 2.77,
		unavailabilityTarecTime: 0.53,
		unavailabilityTarecEnergy: 0.53,
		unavailabilitySgreTime: 2.24,
		unavailabilitySgreEnergy: 2.24,
		electricalLosses: 10903.27,
		powerBoost: 12431.66,
		avgTurbinePerformance: 100.05,
		mtbf: 12.67,
		mttr: 6.44,
		mtti: 3.63,
	},
];

export const PRODUCTION_DATA = [
	{ month: "Jan 25", production: 75, cumulative: 75, budget: 80 },
	{ month: "Feb 25", production: 68, cumulative: 143, budget: 70 },
	{ month: "Mar 25", production: 92, cumulative: 235, budget: 90 },
	{ month: "Apr 25", production: 85, cumulative: 320, budget: 85 },
	{ month: "May 25", production: 105, cumulative: 425, budget: 100 },
	{ month: "Jun 25", production: 115, cumulative: 540, budget: 110 },
	{ month: "Jul 25", production: 125, cumulative: 665, budget: 120 },
	{ month: "Aug 25", production: 120, cumulative: 785, budget: 115 },
	{ month: "Sep 25", production: 100, cumulative: 885, budget: 95 },
	{ month: "Oct 25", production: 95, cumulative: 980, budget: 90 },
	{ month: "Nov 25", production: 88, cumulative: 1068, budget: 85 },
	{ month: "Dec 25", production: 0, cumulative: 0, budget: 90 },
];

export const LOCAL_FACTOR_DATA = [
	{ month: "Jan 25", localFactor: 98, budget: 97 },
	{ month: "Feb 25", localFactor: 97, budget: 97 },
	{ month: "Mar 25", localFactor: 99, budget: 98 },
	{ month: "Apr 25", localFactor: 96, budget: 97 },
	{ month: "May 25", localFactor: 98, budget: 98 },
	{ month: "Jun 25", localFactor: 99, budget: 98 },
	{ month: "Jul 25", localFactor: 99.5, budget: 99 },
	{ month: "Aug 25", localFactor: 99, budget: 99 },
	{ month: "Sep 25", localFactor: 97, budget: 98 },
	{ month: "Oct 25", localFactor: 98, budget: 98 },
	{ month: "Nov 25", localFactor: 98.5, budget: 98 },
	{ month: "Dec 25", localFactor: 0, budget: 98 },
];

export const WIND_ROSE_DATA = [
	{ subject: "N", A: 120, fullMark: 150 },
	{ subject: "NE", A: 98, fullMark: 150 },
	{ subject: "E", A: 86, fullMark: 150 },
	{ subject: "SE", A: 99, fullMark: 150 },
	{ subject: "S", A: 85, fullMark: 150 },
	{ subject: "SW", A: 65, fullMark: 150 },
	{ subject: "W", A: 50, fullMark: 150 },
	{ subject: "NW", A: 80, fullMark: 150 },
];

export const ALARM_CATEGORY_DATA = [
	{ category: "Generator", duration: 120, frequency: 15, mtbf: 450, mtti: 4.5 },
	{ category: "Gearbox", duration: 80, frequency: 8, mtbf: 600, mtti: 6.2 },
	{ category: "Hydraulics", duration: 60, frequency: 25, mtbf: 300, mtti: 2.1 },
	{ category: "Yaw System", duration: 40, frequency: 12, mtbf: 500, mtti: 3.5 },
	{
		category: "Pitch System",
		duration: 90,
		frequency: 18,
		mtbf: 400,
		mtti: 4.0,
	},
	{ category: "Control", duration: 30, frequency: 30, mtbf: 250, mtti: 1.5 },
];

export const ALARM_CODE_DATA = [
	{ code: "111", duration: 50, frequency: 10 },
	{ code: "222", duration: 45, frequency: 8 },
	{ code: "333", duration: 40, frequency: 12 },
	{ code: "444", duration: 35, frequency: 6 },
	{ code: "555", duration: 30, frequency: 15 },
	{ code: "666", duration: 25, frequency: 5 },
	{ code: "777", duration: 20, frequency: 9 },
	{ code: "888", duration: 15, frequency: 4 },
];

export const STOPS_DATA = [
	{ turbine: "T01", duration: 450, frequency: 5 },
	{ turbine: "T02", duration: 120, frequency: 2 },
	{ turbine: "T03", duration: 300, frequency: 4 },
	{ turbine: "T04", duration: 80, frequency: 1 },
	{ turbine: "T05", duration: 600, frequency: 6 },
	{ turbine: "T06", duration: 200, frequency: 3 },
	{ turbine: "T07", duration: 150, frequency: 2 },
	{ turbine: "T08", duration: 90, frequency: 1 },
	{ turbine: "T09", duration: 400, frequency: 5 },
	{ turbine: "T10", duration: 100, frequency: 2 },
];

export const SPARES_DATA = [
	{ part: "Generator Bearing", quantity: 5, threshold: 10 },
	{ part: "Pitch Motor", quantity: 8, threshold: 10 },
	{ part: "Yaw Motor", quantity: 12, threshold: 10 },
	{ part: "Converter Module", quantity: 3, threshold: 5 },
	{ part: "Hydraulic Pump", quantity: 6, threshold: 8 },
	{ part: "Gearbox Oil Filter", quantity: 20, threshold: 15 },
	{ part: "Anemometer", quantity: 15, threshold: 10 },
	{ part: "Wind Vane", quantity: 10, threshold: 10 },
];

export const ENERGY_LOSS_DATA = [
	{ turbine: "T01", loss: 45 },
	{ turbine: "T02", loss: 12 },
	{ turbine: "T03", loss: 30 },
	{ turbine: "T04", loss: 8 },
	{ turbine: "T05", loss: 60 },
	{ turbine: "T06", loss: 20 },
	{ turbine: "T07", loss: 15 },
	{ turbine: "T08", loss: 9 },
	{ turbine: "T09", loss: 40 },
	{ turbine: "T10", loss: 10 },
	{ turbine: "T11", loss: 5 },
	{ turbine: "T12", loss: 25 },
	{ turbine: "T13", loss: 18 },
	{ turbine: "T14", loss: 7 },
	{ turbine: "T15", loss: 35 },
	{ turbine: "T16", loss: 22 },
	{ turbine: "T17", loss: 14 },
	{ turbine: "T18", loss: 6 },
	{ turbine: "T19", loss: 28 },
	{ turbine: "T20", loss: 11 },
];

export const CONSUMPTION_DATA = [
	{ month: "Jan", value: 150 },
	{ month: "Feb", value: 80 },
	{ month: "Mar", value: 220 },
	{ month: "Apr", value: 130 },
	{ month: "May", value: 110 },
	{ month: "Jun", value: 90 },
	{ month: "Jul", value: 100 },
	{ month: "Aug", value: 80 },
	{ month: "Sep", value: 90 },
	{ month: "Oct", value: 160 },
	{ month: "Nov", value: 0 },
	{ month: "Dec", value: 0 },
];

export const BOOST_DATA = [
	{ month: "Jan", value: 800 },
	{ month: "Feb", value: 600 },
	{ month: "Mar", value: 1200 },
	{ month: "Apr", value: 1500 },
	{ month: "May", value: 600 },
	{ month: "Jun", value: 2500 },
	{ month: "Jul", value: 3200 },
	{ month: "Aug", value: 2200 },
	{ month: "Sep", value: 1100 },
	{ month: "Oct", value: 800 },
	{ month: "Nov", value: 0 },
	{ month: "Dec", value: 0 },
];

// Generate mock coordinates for scatter plot map
export const TURBINE_MAP_DATA = Array.from({ length: 50 }, (_, i) => ({
	x: Math.random() * 100,
	y: Math.random() * 100,
	z: Math.random() * 100, // Value for color
	id: `T${i + 1}`,
}));

// Mock analysis text for reports
export const INITIAL_ANALYSIS_TEXT = {
	production: `The load factor for October was 33%.
In October 2025, the wind farm prevented CO2 emissions of around 35k tonnes (*).
The availability target was achieved (>98%) during October.

The predominant wind directions are:
- NNE: 30%
- NE: 25%
- ENE: 7%

The wind speed is representing 100% of the time for the farm:
- [3, 7]: 24%
- [7, 11]: 30%`,
	alarms: `The total downtime corresponds to 5.05%, broken down mainly into the following categories:
System (2.47%): TAREC (1097 - Remote stop - Owner) and TAREC (1001 - Manual stop) are the main alarms of the month.
Hydraulics (1.45%): The name of the alarm (2101 - Hydraulic level error) is a common error.
Converter (0.74%): Low voltage induced the turbines to return in the alarm (3101 - Converter fault external).`,
	stops: `The spare downtime converges to 5.05%, broken down mainly into the following categories:
System (2.47%): TAREC (1097 - Remote stop - Owner) and TAREC (1001 - Manual stop) are the main alarms of the month.
Hydraulics (1.45%): The name of the alarm (2101 - Hydraulic level error) is a common error.
Converter (0.74%): Low voltage induced the turbines to return in the alarm (3101 - Converter fault external).`,
	comments: `TAREC is consolidating its position among the best wind farms in terms of energy.
- Reviewing of the estimation (MWh) & Turbine
- Reviewing of the HMI display panel and installation of signage`,
};

export const MAINTENANCE_DATA = {
	turbine: {
		preventive: [
			"Ground inspections (All)",
			"NDT (All Zones)",
			"Blade and T&H Zero (selected)",
			"One-Stop inspections",
			"HV pylon and OH line annual check",
		],
		corrective: [
			"Cursor 34 verification",
			"MTTI = 0.5 hours",
			"MTTR = 1.50 hours",
		],
	},
	substations: {
		preventive: [
			"Degreasing and lubrication of columns (NORTH 4.0 & 20-10)",
			"Type B maintenance (TAH)",
			"High Pylon test",
			"MTTM = 2.85 hours",
		],
		corrective: [
			"Alignment/doubling of section switches (NORTH)",
			"MTTR = 10.05 hours",
		],
	},
	ppdms: {
		preventive: [
			"Regulatory checks of PPDMs",
			"Type A, B, PPM fire inspections",
			"Inspection of 30kV booths (2024)",
		],
		corrective: ["Checks for buried cables (Line 1)", "No Downtime"],
	},
};
