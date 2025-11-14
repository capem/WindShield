import type React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AnalyticsView from "./components/AnalyticsView";
import Header from "./components/Header";
import SettingsView from "./components/SettingsView";
import Sidebar from "./components/Sidebar";
import TurbineCard from "./components/TurbineCard";
import TurbineDetailView from "./components/TurbineDetailView";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import type { Alarm, Turbine } from "./types";
import { AlarmSeverity, TurbineStatus } from "./types";

// --- CSV PARSING & DATA MAPPING UTILITIES ---

const parseCSV = (text: string): Record<string, string>[] => {
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

const mapCsvRowToTurbine = (row: Record<string, string>): Turbine => {
	const statusMap: { [key: string]: TurbineStatus } = {
		producing: TurbineStatus.Producing,
		available: TurbineStatus.Available,
		offline: TurbineStatus.Offline,
		stopped: TurbineStatus.Stopped,
		maintenance: TurbineStatus.Maintenance,
		fault: TurbineStatus.Fault,
		warning: TurbineStatus.Warning,
		curtailement: TurbineStatus.Curtailement,
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

const layout = {
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

const SWT_2_3_101_SPECS = {
	MAX_POWER: 2.3, // MW
	RPM_RANGE: { min: 6, max: 16 },
	WIND_SPEED_CUT_IN: 3.5, // m/s (average of 3-4)
	WIND_SPEED_NOMINAL: 12.5, // m/s (average of 12-13)
	WIND_SPEED_CUT_OUT: 25, // m/s
};

const generateTurbineData = (id: number): Turbine => {
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
		TurbineStatus.Curtailement,
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

const allTurbineIds = Object.values(layout).flatMap((zone) =>
	zone.flatMap((line) => line.ids),
);
const initialTurbines: Turbine[] = allTurbineIds.map(generateTurbineData);

// --- MOCK ANALYTICS DATA GENERATION ---
const generateMockAnalyticsData = (
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

const ALARM_DEFINITIONS: {
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

const generateInitialAlarms = (turbines: Turbine[]): Alarm[] => {
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

// --- UI COMPONENTS ---

const iconColorMap: { [key: string]: string } = {
	"text-violet-600":
		"bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/50 dark:to-violet-800/60",
	"text-cyan-500":
		"bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/50 dark:to-cyan-800/60",
	"text-purple-600":
		"bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/60",
	"text-green-600":
		"bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/60",
	"text-pink-500":
		"bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/50 dark:to-pink-800/60",
	"text-orange-500":
		"bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/60",
};

const SummaryCard: React.FC<{
	title: string;
	value: string;
	unit: string;
	icon: React.ReactNode;
	color: string;
}> = ({ title, value, unit, icon, color }) => (
	<div className="bg-white dark:bg-black p-4 rounded-xl shadow-sm flex items-start justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 transition-theme-fast">
		<div>
			<p className="text-sm text-slate-500 dark:text-gray-400">{title}</p>
			<p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
				{value}{" "}
				<span className="text-xl font-medium text-slate-500 dark:text-slate-400">
					{unit}
				</span>
			</p>
		</div>
		<div
			className={`p-3 rounded-lg ${iconColorMap[color] || "bg-slate-100 dark:bg-slate-700"}`}
		>
			<div
				className={`${color} text-2xl w-7 h-7 flex items-center justify-center`}
			>
				{icon}
			</div>
		</div>
	</div>
);

const TurbineStatusSummaryCard: React.FC<{
	counts: {
		producing: number;
		available: number;
		stopped: number;
		offline: number;
		maintenance: number;
		fault: number;
		warning: number;
		curtailement: number;
	};
	className?: string;
}> = ({ counts, className }) => {
	const statusItems = [
		{
			name: "Producing",
			count: counts.producing,
			icon: <i className="fa-solid fa-circle-check"></i>,
			color: "text-green-500",
		},
		{
			name: "Available",
			count: counts.available,
			icon: <i className="fa-solid fa-circle-info"></i>,
			color: "text-blue-500",
		},
		{
			name: "Stopped",
			count: counts.stopped,
			icon: <i className="fa-solid fa-circle-pause"></i>,
			color: "text-yellow-500",
		},
		{
			name: "Offline",
			count: counts.offline,
			icon: <i className="fa-solid fa-circle-xmark"></i>,
			color: "text-red-500",
		},
		{
			name: "Maintenance",
			count: counts.maintenance,
			icon: <i className="fa-solid fa-wrench"></i>,
			color: "text-purple-500",
		},
		{
			name: "Fault",
			count: counts.fault,
			icon: <i className="fa-solid fa-triangle-exclamation"></i>,
			color: "text-red-600",
		},
		{
			name: "Warning",
			count: counts.warning,
			icon: <i className="fa-solid fa-exclamation-triangle"></i>,
			color: "text-orange-500",
		},
		{
			name: "Curtailement",
			count: counts.curtailement,
			icon: <i className="fa-solid fa-hand"></i>,
			color: "text-indigo-500",
		},
	];

	return (
		<div
			className={`bg-white dark:bg-black p-4 rounded-xl shadow-sm h-full flex flex-col ${className} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 transition-theme-fast`}
		>
			<p className="text-sm text-slate-500 dark:text-gray-400 font-medium mb-4">
				Turbine Status
			</p>
			<div className="flex-grow flex flex-col justify-around">
				{statusItems.map((item) => (
					<div
						key={item.name}
						className="flex justify-between items-center py-1"
					>
						<div
							className={`flex items-center gap-3 font-medium ${item.color}`}
						>
							<span className="text-lg w-5 text-center">{item.icon}</span>
							<span className="text-sm text-slate-700 dark:text-slate-300 font-semibold">
								{item.name}
							</span>
						</div>
						<span className="font-bold text-lg text-slate-800 dark:text-white">
							{item.count}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

function AppContent() {
	const { isDarkMode, toggleDarkMode } = useTheme();
	const [turbines, setTurbines] = useState<Turbine[]>(initialTurbines);
	const [alarms, setAlarms] = useState<Alarm[]>(() =>
		generateInitialAlarms(initialTurbines),
	);
	const [currentTime, setCurrentTime] = useState(new Date());
	const [selectedTurbineId, setSelectedTurbineId] = useState<string | null>(
		null,
	);
	const [savedTurbineId, setSavedTurbineId] = useState<string | null>(null);
	const [isCompactView, setIsCompactView] = useState(false);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
	const [allHistoricalData, setAllHistoricalData] = useState<Record<
		string,
		Array<Record<string, unknown>>
	> | null>(null);
	const [analyticsData, setAnalyticsData] = useState<Record<
		string,
		Array<Record<string, unknown>>
	> | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [scrollPosition, setScrollPosition] = useState(0);
	const mainContentRef = useRef<HTMLElement>(null);
	const [activeView, setActiveView] = useState("dashboard");

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		setAnalyticsData(generateMockAnalyticsData(initialTurbines));
		return () => clearInterval(timer);
	}, []);

	useLayoutEffect(() => {
		if (mainContentRef.current) {
			if (selectedTurbineId === null) {
				// We are returning to the dashboard, restore scroll position
				mainContentRef.current.scrollTop = scrollPosition;
			} else {
				// We are going to the detail view, scroll to top
				mainContentRef.current.scrollTop = 0;
			}
		}
	}, [selectedTurbineId, scrollPosition]);

	// Scroll to top when view changes
	useEffect(() => {
		if (mainContentRef.current) {
			mainContentRef.current.scrollTop = 0;
		}
	}, []);

	const handleSelectTurbine = (turbineId: string) => {
		if (mainContentRef.current) {
			setScrollPosition(mainContentRef.current.scrollTop);
		}
		setSelectedTurbineId(turbineId);
		setSavedTurbineId(null); // Clear any saved turbine when selecting a new one
	};

	const handleCloseDetailView = () => {
		setSelectedTurbineId(null);
		setSavedTurbineId(null); // Clear saved turbine when explicitly closing
	};

	const handleNavigate = (viewId: string) => {
		// If we're in turbine detail view and navigating away, save the turbine context
		if (selectedTurbineId) {
			setSavedTurbineId(selectedTurbineId);
			setSelectedTurbineId(null);
		}
		setActiveView(viewId);
	};

	const handleRestoreTurbineDetail = () => {
		if (savedTurbineId) {
			setSelectedTurbineId(savedTurbineId);
			setSavedTurbineId(null);
			setActiveView("dashboard"); // Switch to dashboard context
		}
	};

	const handleAcknowledgeAlarm = (alarmId: string) => {
		setAlarms((currentAlarms) => {
			const alarmIndex = currentAlarms.findIndex(
				(alarm) => alarm.id === alarmId,
			);

			if (alarmIndex === -1 || currentAlarms[alarmIndex].acknowledged) {
				return currentAlarms;
			}

			const newAlarms = [...currentAlarms];

			newAlarms[alarmIndex] = {
				...currentAlarms[alarmIndex],
				acknowledged: true,
			};

			return newAlarms;
		});
	};

	const handleToggleSidebar = () => {
		setIsSidebarCollapsed(!isSidebarCollapsed);
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result as string;
			const parsedData = parseCSV(text);
			if (parsedData.length === 0) {
				alert(
					"Could not parse CSV file. Please ensure it has headers and is formatted correctly.",
				);
				return;
			}

			const dataByTurbine = parsedData.reduce(
				(acc, row) => {
					if (row["Turbine ID"]) {
						const turbineId = `T ${String(row["Turbine ID"]).padStart(3, "0")}`;
						if (!acc[turbineId]) acc[turbineId] = [];
						acc[turbineId].push(row);
					}
					return acc;
				},
				{} as Record<string, Array<Record<string, string>>>,
			);

			Object.values(dataByTurbine).forEach((rows) => {
				rows.sort(
					(a, b) =>
						new Date(b.Timestamp as string).getTime() -
						new Date(a.Timestamp as string).getTime(),
				);
			});

			const latestTurbineData = Object.values(dataByTurbine).map((rows) =>
				mapCsvRowToTurbine(rows[0] as Record<string, string>),
			);

			const finalTurbines = allTurbineIds.map((id) => {
				const idStr = `T ${String(id).padStart(3, "0")}`;
				const found = latestTurbineData.find((t) => t.id === idStr);
				return (
					found || {
						id: idStr,
						status: TurbineStatus.Offline,
						maxPower: 2.3,
						activePower: null,
						reactivePower: null,
						windSpeed: null,
						direction: null,
						temperature: null,
						rpm: null,
					}
				);
			});

			setTurbines(finalTurbines);
			setAllHistoricalData(dataByTurbine);
			setAnalyticsData(dataByTurbine); // Also use uploaded data for analytics
			setUploadedFileName(file.name);
			setAlarms(generateInitialAlarms(finalTurbines));
		};
		reader.onerror = () => alert("Error reading file.");
		reader.readAsText(file);
		event.target.value = "";
	};

	const selectedTurbine = turbines.find((t) => t.id === selectedTurbineId);
	const historicalDataForSelectedTurbine =
		selectedTurbineId && (allHistoricalData || analyticsData)
			? (allHistoricalData || analyticsData)?.[selectedTurbineId]
			: undefined;
	const alarmsForSelectedTurbine = alarms.filter(
		(a) => a.turbineId === selectedTurbineId,
	);
	const unacknowledgedAlarms = alarms.filter(
		(a) => !a.timeOff && !a.acknowledged,
	);

	const renderDashboard = () => {
		// --- COHERENT DATA CALCULATIONS ---
		const onlineTurbines = turbines.filter(
			(t) => t.status !== TurbineStatus.Offline,
		);
		const totalActivePower = onlineTurbines.reduce(
			(sum, t) => sum + (t.activePower || 0),
			0,
		);
		const totalReactivePower = onlineTurbines.reduce(
			(sum, t) => sum + (t.reactivePower || 0),
			0,
		);

		const turbineStatusCounts = {
			producing: turbines.filter((t) => t.status === TurbineStatus.Producing)
				.length,
			available: turbines.filter((t) => t.status === TurbineStatus.Available)
				.length,
			stopped: turbines.filter((t) => t.status === TurbineStatus.Stopped)
				.length,
			offline: turbines.filter((t) => t.status === TurbineStatus.Offline)
				.length,
			maintenance: turbines.filter(
				(t) => t.status === TurbineStatus.Maintenance,
			).length,
			fault: turbines.filter((t) => t.status === TurbineStatus.Fault).length,
			warning: turbines.filter((t) => t.status === TurbineStatus.Warning)
				.length,
			curtailement: turbines.filter(
				(t) => t.status === TurbineStatus.Curtailement,
			).length,
		};

		const totalInstalledCapacity = turbines.reduce(
			(sum, t) => sum + t.maxPower,
			0,
		);
		const loadFactor =
			totalInstalledCapacity > 0
				? (totalActivePower / totalInstalledCapacity) * 100
				: 0;

		const hoursToday = currentTime.getHours() + currentTime.getMinutes() / 60;
		const productionTodayMWh = totalActivePower * hoursToday;

		const onlineTurbinesWithWind = onlineTurbines.filter(
			(t) => t.windSpeed !== null,
		);
		const averageWindSpeed =
			onlineTurbinesWithWind.length > 0
				? onlineTurbinesWithWind.reduce(
						(sum, t) => sum + (t.windSpeed ?? 0),
						0,
					) / onlineTurbinesWithWind.length
				: 0;

		const onlineTurbinesWithTemp = onlineTurbines.filter(
			(t) => t.temperature !== null,
		);
		const averageTemperature =
			onlineTurbinesWithTemp.length > 0
				? onlineTurbinesWithTemp.reduce(
						(sum, t) => sum + (t.temperature ?? 0),
						0,
					) / onlineTurbinesWithTemp.length
				: 0;

		const summaryDataTop = [
			{
				title: "Active Power",
				value: totalActivePower.toFixed(1),
				unit: "MW",
				icon: <i className="fa-solid fa-bolt"></i>,
				color: "text-violet-600",
			},
			{
				title: "Reactive Power",
				value: totalReactivePower.toFixed(1),
				unit: "MVar",
				icon: <i className="fa-solid fa-bolt-lightning"></i>,
				color: "text-cyan-500",
			},
		];

		const summaryDataMiddle = [
			{
				title: "Average Wind Speed",
				value: averageWindSpeed.toFixed(1),
				unit: "m/s",
				icon: <i className="fa-solid fa-wind"></i>,
				color: "text-pink-500",
			},
			{
				title: "Average Temperature",
				value: averageTemperature.toFixed(0),
				unit: "°C",
				icon: <i className="fa-solid fa-temperature-half"></i>,
				color: "text-orange-500",
			},
		];

		const summaryDataBottom = [
			{
				title: "Load Factor",
				value: loadFactor.toFixed(1),
				unit: "%",
				icon: <i className="fa-solid fa-gauge-high"></i>,
				color: "text-purple-600",
			},
			{
				title: "Production (Today)",
				value: productionTodayMWh.toFixed(1),
				unit: "MWh",
				icon: <i className="fa-solid fa-chart-line"></i>,
				color: "text-green-600",
			},
		];

		const weekday = currentTime.toLocaleDateString("en-US", {
			weekday: "long",
		});
		const day = currentTime.getDate();
		const month = currentTime.toLocaleDateString("en-US", { month: "long" });
		const year = currentTime.getFullYear();
		const formattedDate = `${weekday} ${day} ${month} ${year}`;
		const formattedTime = currentTime.toLocaleTimeString("fr-FR");

		return (
			<>
				<h1 className="text-3xl font-bold text-slate-900 mb-6 dark:text-white transition-theme">
					Dashboard
				</h1>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					<div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{summaryDataTop.map((data) => (
							<SummaryCard key={data.title} {...data} />
						))}
						{summaryDataMiddle.map((data) => (
							<SummaryCard key={data.title} {...data} />
						))}
						{summaryDataBottom.map((data) => (
							<SummaryCard key={data.title} {...data} />
						))}
					</div>
					<TurbineStatusSummaryCard
						counts={turbineStatusCounts}
						className="lg:col-span-1"
					/>
				</div>

				<div className="bg-white dark:bg-black rounded-lg shadow-sm p-4 mt-6 transition-theme">
					<div className="pb-4 mb-4 border-b border-slate-200 dark:border-gray-800 flex justify-between items-center text-sm">
						<span className="font-semibold text-slate-700 dark:text-gray-300">
							{uploadedFileName ? (
								<>
									Displaying data from{" "}
									<span className="text-violet-500 font-bold">
										{uploadedFileName}
									</span>
								</>
							) : (
								<>
									{formattedDate} at {formattedTime}
								</>
							)}
						</span>
						<span className="text-slate-500 dark:text-gray-400">
							Last updated:{" "}
							{currentTime.toLocaleTimeString("fr-FR", {
								hour: "2-digit",
								minute: "2-digit",
								second: "2-digit",
							})}
						</span>
					</div>
					<div className="space-y-8">
						{Object.entries(layout).map(([zoneName, lines]) => (
							<div key={zoneName}>
								<h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b-2 border-violet-200 dark:border-violet-700">
									{zoneName}
								</h2>
								<div className="space-y-6">
									{lines.map((line) => {
										const lineTurbines = line.ids
											.map((id) =>
												turbines.find(
													(t) => t.id === `T ${String(id).padStart(3, "0")}`,
												),
											)
											.filter((t): t is Turbine => !!t);

										return (
											<div key={line.name}>
												<h3 className="text-sm font-semibold text-slate-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
													{line.name}
												</h3>
												<div
													className="grid gap-4"
													style={{
														gridTemplateColumns: `repeat(auto-fill, minmax(${isCompactView ? "10rem" : "12rem"}, 1fr))`,
													}}
												>
													{lineTurbines.map((turbine) => {
														const activeAlarms = alarms.filter(
															(a) => a.turbineId === turbine.id && !a.timeOff,
														);
														let activeAlarmSeverity: AlarmSeverity | null =
															null;
														if (activeAlarms.length > 0) {
															if (
																activeAlarms.some(
																	(a) => a.severity === AlarmSeverity.Critical,
																)
															)
																activeAlarmSeverity = AlarmSeverity.Critical;
															else if (
																activeAlarms.some(
																	(a) => a.severity === AlarmSeverity.Warning,
																)
															)
																activeAlarmSeverity = AlarmSeverity.Warning;
															else activeAlarmSeverity = AlarmSeverity.Info;
														}

														return (
															<TurbineCard
																key={turbine.id}
																turbine={turbine}
																onClick={() => handleSelectTurbine(turbine.id)}
																isCompact={isCompactView}
																activeAlarmSeverity={activeAlarmSeverity}
															/>
														);
													})}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						))}
					</div>
				</div>
			</>
		);
	};

	const renderContent = () => {
		switch (activeView) {
			case "settings":
				return (
					<SettingsView
						isCompactView={isCompactView}
						setIsCompactView={setIsCompactView}
						isSidebarCollapsed={isSidebarCollapsed}
						setIsSidebarCollapsed={setIsSidebarCollapsed}
						isDarkMode={isDarkMode}
						setIsDarkMode={toggleDarkMode}
					/>
				);
			case "analytics":
				return (
					<AnalyticsView historicalData={analyticsData} turbines={turbines} />
				);
			default:
				return renderDashboard();
		}
	};

	return (
		<div className="flex h-screen bg-slate-50 text-slate-800 font-sans dark:bg-black dark:text-white transition-theme">
			<Sidebar
				isCollapsed={isSidebarCollapsed}
				activeItem={activeView}
				onNavigate={handleNavigate}
			/>
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header
					onToggleSidebar={handleToggleSidebar}
					onUploadClick={handleUploadClick}
					unacknowledgedAlarms={unacknowledgedAlarms}
					isDarkMode={isDarkMode}
					onToggleDarkMode={toggleDarkMode}
					savedTurbineId={savedTurbineId}
					onRestoreTurbineDetail={handleRestoreTurbineDetail}
				/>
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					className="hidden"
					accept=".csv"
				/>
				<main ref={mainContentRef} className="flex-1 p-6 overflow-y-auto">
					{selectedTurbine ? (
						<TurbineDetailView
							turbine={selectedTurbine}
							onBack={handleCloseDetailView}
							historicalData={historicalDataForSelectedTurbine}
							alarms={alarmsForSelectedTurbine}
							onAcknowledgeAlarm={handleAcknowledgeAlarm}
							savedTurbineId={savedTurbineId}
						/>
					) : (
						renderContent()
					)}
				</main>
			</div>
		</div>
	);
}

function App() {
	return (
		<ThemeProvider>
			<AppContent />
		</ThemeProvider>
	);
}

export default App;
