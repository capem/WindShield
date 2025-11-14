import type React from "react";
import { useMemo, useState } from "react";
import type { Alarm, Turbine } from "../types";
import { AlarmSeverity, TurbineStatus } from "../types";

interface TurbineDetailViewProps {
	turbine: Turbine;
	onBack: () => void;
	historicalData?: Array<Record<string, string>>;
	alarms: Alarm[];
	onAcknowledgeAlarm: (alarmId: string) => void;
	savedTurbineId?: string | null;
}

const statusConfig = {
	[TurbineStatus.Producing]: {
		text: "Producing",
		classes:
			"text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30",
	},
	[TurbineStatus.Available]: {
		text: "Available",
		classes: "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30",
	},
	[TurbineStatus.Offline]: {
		text: "Offline",
		classes: "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30",
	},
	[TurbineStatus.Stopped]: {
		text: "Stopped",
		classes:
			"text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30",
	},
	[TurbineStatus.Maintenance]: {
		text: "Maintenance",
		classes:
			"text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30",
	},
	[TurbineStatus.Fault]: {
		text: "Fault",
		classes: "text-red-800 dark:text-red-200 bg-red-200 dark:bg-red-900/40",
	},
	[TurbineStatus.Warning]: {
		text: "Warning",
		classes:
			"text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30",
	},
	[TurbineStatus.Curtailement]: {
		text: "Curtailement",
		classes:
			"text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30",
	},
};

const PowerGauge: React.FC<{ power: number; nominalMaxPower: number }> = ({
	power,
	nominalMaxPower,
}) => {
	const GAUGE_MAX_POWER_FACTOR = 1.15;
	const GAUGE_RADIUS = 75;
	const GAUGE_WIDTH = 18;
	const VIEW_BOX_WIDTH = 180;
	const VIEW_BOX_HEIGHT = 110;
	const CX = VIEW_BOX_WIDTH / 2;
	const CY = VIEW_BOX_HEIGHT - 15;

	const gaugeMax = nominalMaxPower * GAUGE_MAX_POWER_FACTOR;
	const clampedPower = Math.max(0, Math.min(power, gaugeMax));
	const powerPercentage =
		nominalMaxPower > 0 ? (power / nominalMaxPower) * 100 : 0;

	const getAngle = (value: number) => (value / gaugeMax) * 180 - 90;

	const needleAngle = getAngle(clampedPower);
	const nominalMaxAngle = getAngle(nominalMaxPower);

	const polarToCartesian = (
		centerX: number,
		centerY: number,
		radius: number,
		angleInDegrees: number,
	) => {
		const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
		return {
			x: centerX + radius * Math.cos(angleInRadians),
			y: centerY + radius * Math.sin(angleInRadians),
		};
	};

	const describeArc = (
		x: number,
		y: number,
		radius: number,
		startAngle: number,
		endAngle: number,
	) => {
		const start = polarToCartesian(x, y, radius, endAngle);
		const end = polarToCartesian(x, y, radius, startAngle);
		const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
		return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
	};

	const powerValueColor =
		power > nominalMaxPower ? "text-amber-500" : "text-green-500";
	const majorTicksValues = [0, 0.5, 1.0, 1.5, 2.0, 2.5];

	return (
		<div className="relative w-full">
			<svg
				viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}
				className="w-full overflow-visible"
			>
				<title>Power Gauge</title>
				<defs>
					<linearGradient
						id="gaugeGreenGradient"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="0%"
					>
						<stop offset="0%" stopColor="#10b981" />
						<stop offset="100%" stopColor="#34d399" />
					</linearGradient>
					<linearGradient
						id="gaugeAmberGradient"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="0%"
					>
						<stop offset="0%" stopColor="#f59e0b" />
						<stop offset="100%" stopColor="#fbbf24" />
					</linearGradient>
					<radialGradient id="hubGradient">
						<stop offset="0%" stopColor="#f9fafb" />
						<stop offset="100%" stopColor="#d1d5db" />
					</radialGradient>
					<filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
						<feDropShadow
							dx="0"
							dy="2"
							stdDeviation="2"
							floodColor="#000"
							floodOpacity="0.1"
						/>
					</filter>
				</defs>

				<g filter="url(#shadow)">
					{/* Gauge Background Arc */}
					<path
						d={describeArc(CX, CY, GAUGE_RADIUS, -90, 90)}
						strokeWidth={GAUGE_WIDTH}
						className="stroke-slate-200 dark:stroke-gray-700"
						fill="none"
					/>

					{/* Gauge Value Arcs */}
					<path
						d={describeArc(
							CX,
							CY,
							GAUGE_RADIUS,
							-90,
							Math.min(needleAngle, nominalMaxAngle),
						)}
						strokeWidth={GAUGE_WIDTH}
						stroke="url(#gaugeGreenGradient)"
						fill="none"
						style={{
							transition:
								"stroke-dasharray 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
						}}
					/>
					{clampedPower > nominalMaxPower && (
						<path
							d={describeArc(
								CX,
								CY,
								GAUGE_RADIUS,
								nominalMaxAngle,
								needleAngle,
							)}
							strokeWidth={GAUGE_WIDTH}
							stroke="url(#gaugeAmberGradient)"
							fill="none"
							style={{
								transition:
									"stroke-dasharray 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
							}}
						/>
					)}
				</g>

				{/* Ticks and Labels */}
				{majorTicksValues.map((value) => {
					if (value > gaugeMax) return null;
					const angle = getAngle(value);
					const labelPos = polarToCartesian(CX, CY, GAUGE_RADIUS + 10, angle);
					return (
						<text
							key={`tick-label-${value}`}
							x={labelPos.x}
							y={labelPos.y}
							textAnchor="middle"
							alignmentBaseline="central"
							className="text-[8px] font-semibold fill-slate-700 dark:fill-gray-300"
						>
							{value.toFixed(1)}
						</text>
					);
				})}

				{/* Needle */}
				<g
					transform={`rotate(${needleAngle} ${CX} ${CY})`}
					style={{
						transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
					}}
				>
					<path
						d={`M ${CX} ${CY - GAUGE_RADIUS + GAUGE_WIDTH / 2 - 2} L ${CX} ${CY - 6}`}
						className="stroke-slate-700 dark:stroke-white"
						strokeWidth="2"
						strokeLinecap="round"
						filter="url(#shadow)"
					/>
				</g>
				<circle
					cx={CX}
					cy={CY}
					r="6"
					fill="url(#hubGradient)"
					className="stroke-slate-400 dark:stroke-gray-600"
					strokeWidth="0.5"
				/>
				<circle
					cx={CX}
					cy={CY}
					r="3"
					className="fill-slate-700 dark:fill-gray-400"
				/>
			</svg>
			<div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
				<p className={`text-5xl font-bold ${powerValueColor}`}>
					{power.toFixed(2)}
					<span className="text-xl font-medium text-slate-600 dark:text-slate-400 ml-1">
						MW
					</span>
				</p>
				<p className="text-sm text-slate-700 dark:text-slate-300 font-semibold mt-1">
					{powerPercentage.toFixed(0)}% of nominal
				</p>
			</div>
		</div>
	);
};

const MetricCard: React.FC<{
	title: string;
	value: string;
	icon: React.ReactNode;
	color: string;
}> = ({ title, value, icon, color }) => (
	<div className="bg-white dark:bg-black rounded-lg p-4 shadow-sm border border-slate-200 dark:border-gray-700 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 transition-theme">
		<div
			className={`p-3 rounded-full ${color.replace("text-", "bg-").replace("-500", "-100")} dark:bg-opacity-20`}
		>
			<div
				className={`${color} text-xl w-6 h-6 flex items-center justify-center`}
			>
				{icon}
			</div>
		</div>
		<div className="flex-1">
			<p className="text-sm font-medium text-slate-600 dark:text-gray-400 capitalize tracking-normal">
				{title}
			</p>
			<p className="text-xl font-bold text-slate-800 dark:text-white">
				{value}
			</p>
		</div>
	</div>
);

const HistoricalChart: React.FC<{
	title: string;
	data: number[];
	unit: string;
	color: string;
	maxVal: number;
}> = ({ title, data, unit, color, maxVal }) => {
	const width = 300;
	const height = 120;
	const [hoverData, setHoverData] = useState<{
		x: number;
		y: number;
		value: number;
		index: number;
	} | null>(null);

	if (!data || data.length === 0)
		return (
			<div className="bg-white dark:bg-black rounded-lg p-6 shadow-sm border border-slate-200 dark:border-gray-700 flex flex-col items-center justify-center h-[180px] transition-theme">
				<i className="fa-solid fa-chart-line text-3xl text-slate-300 dark:text-gray-600 mb-3"></i>
				<p className="text-slate-500 dark:text-gray-400">
					No historical data available.
				</p>
			</div>
		);

	const maxDataVal =
		maxVal > 0 ? maxVal : Math.max(...data) > 0 ? Math.max(...data) : 1;
	const minDataVal = Math.min(...data);
	const avgDataVal = data.reduce((sum, val) => sum + val, 0) / data.length;

	const points = data
		.map((val, i) => {
			const x = data.length > 1 ? (i / (data.length - 1)) * width : width / 2;
			const y = height - (val / maxDataVal) * height;
			return `${x},${y}`;
		})
		.join(" ");

	const areaPath = `M${points} L${width},${height} L0,${height} Z`;
	const linePath = `M${points}`;

	const gradientId = `gradient-${color.replace(/\s/g, "-")}`;

	const handleMouseMove = (event: React.MouseEvent<SVGRectElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const index = Math.round((x / rect.width) * (data.length - 1));
		const value = data[index];
		const pointX = (index / (data.length - 1)) * width;
		const pointY = height - (value / maxDataVal) * height;
		setHoverData({ x: pointX, y: pointY, value, index });
	};

	const handleMouseLeave = () => {
		setHoverData(null);
	};

	return (
		<div className="bg-white dark:bg-black rounded-lg p-6 shadow-sm border border-slate-200 dark:border-gray-700 transition-theme">
			<div className="flex justify-between items-baseline mb-4">
				<h4 className="font-semibold text-slate-700 dark:text-gray-300">
					{title}
				</h4>
				<p className="text-sm font-bold" style={{ color: color }}>
					{data[data.length - 1].toFixed(1)}{" "}
					<span className="font-medium text-slate-500 dark:text-gray-400">
						{unit}
					</span>
				</p>
			</div>

			{/* Statistics Summary */}
			<div className="flex justify-between text-xs text-slate-500 dark:text-gray-400 mb-3">
				<span>
					Min: {minDataVal.toFixed(1)} {unit}
				</span>
				<span>
					Avg: {avgDataVal.toFixed(1)} {unit}
				</span>
				<span>
					Max: {maxDataVal.toFixed(0)} {unit}
				</span>
			</div>

			<div className="relative">
				<svg
					viewBox={`0 0 ${width} ${height}`}
					className="w-full h-auto"
					preserveAspectRatio="none"
				>
					<title>Historical Chart</title>
					<defs>
						<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor={color} stopOpacity="0.3" />
							<stop offset="100%" stopColor={color} stopOpacity="0.05" />
						</linearGradient>
					</defs>
					<path d={areaPath} fill={`url(#${gradientId})`} />
					<path d={linePath} fill="none" stroke={color} strokeWidth="2" />
					{hoverData && (
						<g>
							<line
								x1={hoverData.x}
								y1="0"
								x2={hoverData.x}
								y2={height}
								stroke={color}
								strokeWidth="1"
								strokeDasharray="3,3"
							/>
							<circle
								cx={hoverData.x}
								cy={hoverData.y}
								r="4"
								fill="white"
								stroke={color}
								strokeWidth="2"
							/>
						</g>
					)}
				</svg>
				<button
					type="button"
					className="absolute inset-0 w-full h-full cursor-default"
					style={{ top: 0, left: 0 }}
					onMouseMove={handleMouseMove}
					onMouseLeave={handleMouseLeave}
					aria-label="Chart interaction area"
				/>
				{hoverData && (
					<div
						className="absolute p-3 text-xs bg-gray-900 text-white rounded-md shadow-lg pointer-events-none transition-opacity transition-theme z-10"
						style={{
							left: `${hoverData.x}px`,
							top: `${hoverData.y}px`,
							transform: `translate(-50%, -120%) translateX(${hoverData.x / width > 0.5 ? "-20px" : "20px"})`,
						}}
					>
						<p className="font-bold">
							{hoverData.value.toFixed(2)} {unit}
						</p>
						<p className="text-slate-300">~{24 - hoverData.index}h ago</p>
					</div>
				)}
				<div className="absolute top-0 left-0 text-xs text-slate-400">
					{maxDataVal.toFixed(0)}
				</div>
				<div className="absolute bottom-0 left-0 text-xs text-slate-400">0</div>
				<div className="absolute -bottom-5 right-0 text-xs text-slate-400">
					Now
				</div>
				<div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-slate-400">
					12h ago
				</div>
				<div className="absolute -bottom-5 left-0 text-xs text-slate-400">
					24h ago
				</div>
			</div>
		</div>
	);
};

const SWT_2_3_101_SPECS = {
	RPM_RANGE: { min: 6, max: 16 },
	WIND_SPEED_CUT_OUT: 25,
};

const generateHistoricalData = (
	turbine: Turbine,
): { power: number[]; wind: number[]; rpm: number[] } => {
	const dataPoints = 24;
	const power: number[] = [];
	const wind: number[] = [];
	const rpm: number[] = [];

	if (turbine.status !== TurbineStatus.Producing) {
		return {
			power: Array(dataPoints).fill(0),
			wind: Array(dataPoints).fill(turbine.windSpeed ?? 0),
			rpm: Array(dataPoints).fill(0),
		};
	}

	for (let i = 0; i < dataPoints; i++) {
		const factor =
			Math.sin((i / dataPoints) * Math.PI * 2 - Math.PI / 2) * 0.4 + 0.6; // Simulate daily cycle
		const randomFluctuation = 1 + (Math.random() - 0.5) * 0.2;

		const p = Math.max(
			0,
			Math.min(
				turbine.maxPower,
				(turbine.activePower ?? 0) * factor * randomFluctuation,
			),
		);
		power.push(p);

		const w = Math.max(
			0,
			Math.min(
				SWT_2_3_101_SPECS.WIND_SPEED_CUT_OUT,
				(turbine.windSpeed ?? 0) * factor * randomFluctuation,
			),
		); // Cap at cut-out speed
		wind.push(w);

		let r = 0;
		if (p > 0.1) {
			// Only have RPM if producing power
			const powerRatio = p / turbine.maxPower;
			r =
				SWT_2_3_101_SPECS.RPM_RANGE.min +
				powerRatio *
					(SWT_2_3_101_SPECS.RPM_RANGE.max - SWT_2_3_101_SPECS.RPM_RANGE.min); // Base RPM on generated power for consistency
			r *= randomFluctuation;
		}
		r = Math.max(0, Math.min(SWT_2_3_101_SPECS.RPM_RANGE.max, r)); // Cap RPM between 0 and max
		rpm.push(r);
	}
	return { power, wind, rpm };
};

const AlarmHistory: React.FC<{
	alarms: Alarm[];
	onAcknowledge: (id: string) => void;
}> = ({ alarms, onAcknowledge }) => {
	const [sortConfig, setSortConfig] = useState<{
		key: string;
		direction: "asc" | "desc";
	} | null>(null);
	const [filter, setFilter] = useState<"all" | "active" | "critical">("all");

	const filteredAlarms = useMemo(() => {
		if (filter === "active") {
			return alarms.filter((alarm) => !alarm.timeOff);
		} else if (filter === "critical") {
			return alarms.filter(
				(alarm) => alarm.severity === AlarmSeverity.Critical,
			);
		}
		return alarms;
	}, [alarms, filter]);

	const sortedAlarms = useMemo(() => {
		const sortableAlarms = [...filteredAlarms];

		const severityOrder = {
			[AlarmSeverity.Critical]: 1,
			[AlarmSeverity.Warning]: 2,
			[AlarmSeverity.Info]: 3,
		};

		if (sortConfig !== null) {
			sortableAlarms.sort((a, b) => {
				let aVal: number | string | Date, bVal: number | string | Date;

				switch (sortConfig.key) {
					case "severity":
						aVal = severityOrder[a.severity];
						bVal = severityOrder[b.severity];
						break;
					case "description":
						aVal = a.description;
						bVal = b.description;
						break;
					case "timeOn":
						aVal = a.timeOn.getTime();
						bVal = b.timeOn.getTime();
						break;
					default:
						return 0;
				}

				if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
				if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
				return 0;
			});
		} else {
			sortableAlarms.sort((a, b) => {
				if (!a.timeOff && b.timeOff) return -1; // Active alarms first
				if (a.timeOff && !b.timeOff) return 1;
				return b.timeOn.getTime() - a.timeOn.getTime(); // Then by most recent
			});
		}
		return sortableAlarms;
	}, [filteredAlarms, sortConfig]);

	const requestSort = (key: string) => {
		if (sortConfig && sortConfig.key === key) {
			// If same key, toggle direction or remove sort
			if (sortConfig.direction === "desc") {
				setSortConfig(null); // Return to default sort
			} else {
				setSortConfig({ key, direction: "desc" });
			}
		} else {
			setSortConfig({ key, direction: "asc" });
		}
	};

	const getSortIcon = (key: string) => {
		if (!sortConfig || sortConfig.key !== key) {
			return <i className="fa-solid fa-sort sort-icon ml-1 text-xs"></i>;
		}
		if (sortConfig.direction === "asc") {
			return (
				<i className="fa-solid fa-sort-up sort-icon active ml-1 text-xs"></i>
			);
		}
		return (
			<i className="fa-solid fa-sort-down sort-icon active ml-1 text-xs"></i>
		);
	};

	const severityConfig = {
		[AlarmSeverity.Critical]: {
			icon: "fa-triangle-exclamation",
			color: "text-red-600 dark:text-red-400",
			bg: "bg-red-50 dark:bg-red-900/20",
			border: "border-l-red-500",
		},
		[AlarmSeverity.Warning]: {
			icon: "fa-triangle-exclamation",
			color: "text-yellow-600 dark:text-yellow-400",
			bg: "bg-yellow-50 dark:bg-yellow-900/20",
			border: "border-l-yellow-500",
		},
		[AlarmSeverity.Info]: {
			icon: "fa-circle-info",
			color: "text-blue-600 dark:text-blue-400",
			bg: "bg-blue-50 dark:bg-blue-900/20",
			border: "border-l-blue-500",
		},
	};

	const formatDuration = (start: Date, end: Date | null): string => {
		const endDate = end || new Date();
		const diffMs = endDate.getTime() - start.getTime();
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
		if (diffHours > 0) return `${diffHours}h ${diffMins}m`;
		return `${diffMins}m`;
	};

	const activeCount = alarms.filter((alarm) => !alarm.timeOff).length;
	const criticalCount = alarms.filter(
		(alarm) => alarm.severity === AlarmSeverity.Critical && !alarm.timeOff,
	).length;

	if (alarms.length === 0) {
		return (
			<div className="bg-white dark:bg-black rounded-lg p-8 shadow-sm border border-slate-200 dark:border-gray-700 text-center transition-theme">
				<i className="fa-solid fa-check-circle text-4xl text-green-500 mb-4"></i>
				<p className="text-slate-600 dark:text-gray-400 font-medium">
					No alarms recorded for this turbine.
				</p>
				<p className="text-sm text-slate-500 dark:text-gray-500 mt-2">
					System is operating normally.
				</p>
			</div>
		);
	}

	return (
		<div className="bg-white dark:bg-black rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden transition-theme">
			{/* Alarm Summary Bar */}
			<div className="bg-slate-50 dark:bg-gray-900 px-6 py-3 border-b border-slate-200 dark:border-gray-700">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
					<div className="flex gap-4 text-sm">
						<div className="flex items-center gap-2">
							<span className="font-medium text-slate-700 dark:text-gray-300">
								Total:
							</span>
							<span className="font-bold text-slate-800 dark:text-white">
								{alarms.length}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="font-medium text-slate-700 dark:text-gray-300">
								Active:
							</span>
							<span
								className={`font-bold ${activeCount > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
							>
								{activeCount}
							</span>
						</div>
						{criticalCount > 0 && (
							<div className="flex items-center gap-2">
								<span className="font-medium text-slate-700 dark:text-gray-300">
									Critical:
								</span>
								<span className="font-bold text-red-600 dark:text-red-400">
									{criticalCount}
								</span>
							</div>
						)}
					</div>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => setFilter("all")}
							className={`px-3 py-1 text-xs font-medium rounded-md transition-theme ${
								filter === "all"
									? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
									: "text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800"
							}`}
						>
							All
						</button>
						<button
							type="button"
							onClick={() => setFilter("active")}
							className={`px-3 py-1 text-xs font-medium rounded-md transition-theme ${
								filter === "active"
									? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
									: "text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800"
							}`}
						>
							Active
						</button>
						<button
							type="button"
							onClick={() => setFilter("critical")}
							className={`px-3 py-1 text-xs font-medium rounded-md transition-theme ${
								filter === "critical"
									? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
									: "text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800"
							}`}
						>
							Critical
						</button>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full text-sm text-left text-slate-600 dark:text-gray-400">
					<thead className="bg-slate-50 dark:bg-gray-900 text-xs text-slate-700 dark:text-gray-300 uppercase border-b border-slate-200 dark:border-gray-700">
						<tr>
							<th
								scope="col"
								className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => requestSort("severity")}
							>
								<div className="flex items-center">
									Severity {getSortIcon("severity")}
								</div>
							</th>
							<th
								scope="col"
								className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => requestSort("description")}
							>
								<div className="flex items-center">
									Description {getSortIcon("description")}
								</div>
							</th>
							<th
								scope="col"
								className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => requestSort("timeOn")}
							>
								<div className="flex items-center">
									Start Time {getSortIcon("timeOn")}
								</div>
							</th>
							<th scope="col" className="px-6 py-3">
								Duration
							</th>
							<th scope="col" className="px-6 py-3">
								Status
							</th>
							<th scope="col" className="px-6 py-3 text-right">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{sortedAlarms.map((alarm) => {
							const config = severityConfig[alarm.severity];
							const isActive = !alarm.timeOff;
							return (
								<tr
									key={alarm.id}
									className={`border-b border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-900/50 transition-colors ${isActive ? config.bg : ""} ${isActive ? config.border : "border-l-transparent"} border-l-4`}
								>
									<td className="px-6 py-4 font-medium">
										<div className={`flex items-center gap-2 ${config.color}`}>
											<i className={`fa-solid ${config.icon}`}></i>
											<span className="font-semibold">{alarm.severity}</span>
										</div>
									</td>
									<td className="px-6 py-4">
										<div>
											<p className="font-medium text-slate-800 dark:text-white">
												{alarm.description}
											</p>
											<p className="text-xs text-slate-500 dark:text-gray-500 mt-1">
												Code: {alarm.code}
											</p>
										</div>
									</td>
									<td className="px-6 py-4 text-slate-700 dark:text-gray-300">
										<div>
											<p>{alarm.timeOn.toLocaleDateString()}</p>
											<p className="text-xs text-slate-500 dark:text-gray-500">
												{alarm.timeOn.toLocaleTimeString()}
											</p>
										</div>
									</td>
									<td className="px-6 py-4 font-medium text-slate-700 dark:text-gray-300">
										{formatDuration(alarm.timeOn, alarm.timeOff)}
									</td>
									<td className="px-6 py-4">
										{isActive ? (
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
													alarm.acknowledged
														? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
														: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
												}`}
											>
												<span
													className={`w-2 h-2 mr-1.5 rounded-full ${alarm.acknowledged ? "bg-green-400" : "bg-yellow-400 animate-pulse"}`}
												></span>
												{alarm.acknowledged ? "Acknowledged" : "New"}
											</span>
										) : (
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-gray-800 dark:text-gray-300">
												Resolved
											</span>
										)}
									</td>
									<td className="px-6 py-4 text-right">
										{isActive && !alarm.acknowledged && (
											<button
												type="button"
												onClick={() => onAcknowledge(alarm.id)}
												className="font-medium text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300 bg-violet-100 hover:bg-violet-200 dark:bg-violet-900/30 dark:hover:bg-violet-900/50 px-3 py-1.5 rounded-md transition-colors text-xs"
											>
												Acknowledge
											</button>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

const TurbineDetailView: React.FC<TurbineDetailViewProps> = ({
	turbine,
	onBack,
	historicalData,
	alarms,
	onAcknowledgeAlarm,
	savedTurbineId,
}) => {
	const chartData = useMemo(() => {
		if (historicalData && historicalData.length > 0) {
			const reversedData = [...historicalData].reverse();
			return {
				power: reversedData.map((d) => parseFloat(d["ActivePower(MW)"]) || 0),
				wind: reversedData.map((d) => parseFloat(d["WindSpeed(m/s)"]) || 0),
				rpm: reversedData.map((d) => parseFloat(d.RPM) || 0),
			};
		}
		return generateHistoricalData(turbine);
	}, [turbine, historicalData]);

	const config = statusConfig[turbine.status];

	return (
		<div className="animate-fade-in px-4 py-6 lg:px-8 max-w-7xl mx-auto">
			{/* Enhanced Header Section */}
			<div className="mb-8">
				<button
					type="button"
					onClick={onBack}
					className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors"
				>
					<i className="fa-solid fa-arrow-left"></i>
					{savedTurbineId
						? `Back to Dashboard (from ${savedTurbineId})`
						: "Back to Dashboard"}
				</button>

				<div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-gray-700 transition-theme">
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
						<div>
							<div className="flex items-center gap-3 mb-2">
								<h1 className="text-3xl font-bold text-slate-800 dark:text-white">
									Turbine {turbine.id}
								</h1>
								<span
									className={`text-sm font-semibold px-3 py-1 rounded-full ${config.classes}`}
								>
									{config.text}
								</span>
							</div>
							<p className="text-slate-600 dark:text-gray-400">
								Detailed operational metrics and performance data
							</p>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
							<span className="text-sm text-slate-600 dark:text-gray-400">
								Live Data
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Primary Metrics Section with Power Gauge */}
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-4">
					<div className="w-1 h-6 bg-violet-500 rounded-full"></div>
					<h2 className="text-xl font-bold text-slate-800 dark:text-white">
						Primary Metrics
					</h2>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Power Gauge with Integrated Metrics */}
					<div className="lg:col-span-2 bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-slate-200 dark:border-gray-700 transition-theme">
						<div className="flex flex-col lg:flex-row items-center gap-6">
							<div className="w-full lg:w-1/2">
								<PowerGauge
									power={turbine.activePower ?? 0}
									nominalMaxPower={turbine.maxPower}
								/>
							</div>
							<div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
								<MetricCard
									title="Reactive Power"
									value={
										turbine.reactivePower !== null
											? `${turbine.reactivePower} MVar`
											: "—"
									}
									icon={<i className="fa-solid fa-bolt-lightning"></i>}
									color="text-blue-500"
								/>
								<MetricCard
									title="Apparent Power"
									value={
										turbine.activePower !== null &&
										turbine.reactivePower !== null
											? `${Math.sqrt(turbine.activePower ** 2 + turbine.reactivePower ** 2).toFixed(2)} MVA`
											: "—"
									}
									icon={<i className="fa-solid fa-bolt"></i>}
									color="text-amber-500"
								/>
								<MetricCard
									title="Capacity Factor"
									value={
										turbine.activePower !== null && turbine.maxPower > 0
											? `${((turbine.activePower / turbine.maxPower) * 100).toFixed(1)}%`
											: "—"
									}
									icon={<i className="fa-solid fa-chart-line"></i>}
									color="text-violet-500"
								/>
								<MetricCard
									title="Power Factor"
									value={
										turbine.activePower !== null &&
										turbine.reactivePower !== null
											? `${(turbine.activePower / Math.sqrt(turbine.activePower ** 2 + turbine.reactivePower ** 2)).toFixed(3)}`
											: "—"
									}
									icon={<i className="fa-solid fa-wave-square"></i>}
									color="text-emerald-500"
								/>
							</div>
						</div>
					</div>

					{/* Key Performance Indicator */}
					<div className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 rounded-xl p-6 border border-violet-200 dark:border-violet-700 transition-theme">
						<h3 className="text-lg font-semibold text-slate-700 dark:text-gray-300 mb-4">
							Performance
						</h3>
						<div className="space-y-4">
							<div>
								<p className="text-sm font-medium text-slate-600 dark:text-gray-400 mb-1">
									Efficiency
								</p>
								<p className="text-xl font-bold text-slate-800 dark:text-white">
									{turbine.activePower && turbine.maxPower > 0
										? `${(95 + Math.random() * 3).toFixed(1)}%`
										: "—"}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-slate-600 dark:text-gray-400 mb-1">
									Availability
								</p>
								<p className="text-xl font-bold text-slate-800 dark:text-white">
									98.5%
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Secondary Metrics Section */}
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-4">
					<div className="w-1 h-6 bg-blue-500 rounded-full"></div>
					<h2 className="text-xl font-bold text-slate-800 dark:text-white">
						Environmental & Mechanical Metrics
					</h2>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					<MetricCard
						title="Wind Speed"
						value={
							turbine.windSpeed !== null ? `${turbine.windSpeed} m/s` : "—"
						}
						icon={<i className="fa-solid fa-wind"></i>}
						color="text-pink-500"
					/>
					<MetricCard
						title="Direction"
						value={turbine.direction !== null ? `${turbine.direction}°` : "—"}
						icon={<i className="fa-solid fa-compass"></i>}
						color="text-teal-500"
					/>
					<MetricCard
						title="Temperature"
						value={
							turbine.temperature !== null ? `${turbine.temperature}°C` : "—"
						}
						icon={<i className="fa-solid fa-temperature-half"></i>}
						color="text-orange-500"
					/>
					<MetricCard
						title="Rotor Speed"
						value={turbine.rpm !== null ? `${turbine.rpm} RPM` : "—"}
						icon={<i className="fa-solid fa-arrows-spin"></i>}
						color="text-indigo-500"
					/>
					<MetricCard
						title="Max Power"
						value={`${turbine.maxPower} MW`}
						icon={<i className="fa-solid fa-gauge-high"></i>}
						color="text-cyan-500"
					/>
					<MetricCard
						title="Turbine Type"
						value="SWT-2.3-101"
						icon={<i className="fa-solid fa-tag"></i>}
						color="text-purple-500"
					/>
				</div>
			</div>

			{/* Historical Performance Section */}
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-4">
					<div className="w-1 h-6 bg-green-500 rounded-full"></div>
					<h2 className="text-xl font-bold text-slate-800 dark:text-white">
						Historical Performance
					</h2>
					<div className="ml-auto flex gap-2">
						<button
							type="button"
							className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-md transition-theme"
						>
							24h
						</button>
						<button
							type="button"
							className="px-3 py-1 text-xs font-medium text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-md transition-theme"
						>
							7d
						</button>
						<button
							type="button"
							className="px-3 py-1 text-xs font-medium text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-md transition-theme"
						>
							30d
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<HistoricalChart
						title="Power Output"
						data={chartData.power}
						unit="MW"
						color="#10b981"
						maxVal={turbine.maxPower}
					/>
					<HistoricalChart
						title="Wind Speed"
						data={chartData.wind}
						unit="m/s"
						color="#ec4899"
						maxVal={30}
					/>
					<HistoricalChart
						title="Rotor Speed"
						data={chartData.rpm}
						unit="RPM"
						color="#6366f1"
						maxVal={SWT_2_3_101_SPECS.RPM_RANGE.max + 4}
					/>
				</div>
			</div>

			{/* Alarm History Section */}
			<div>
				<div className="flex items-center gap-2 mb-4">
					<div className="w-1 h-6 bg-red-500 rounded-full"></div>
					<h2 className="text-xl font-bold text-slate-800 dark:text-white">
						Alarm History & Status
					</h2>
					<div className="ml-auto flex gap-2">
						<button
							type="button"
							className="px-3 py-1 text-xs font-medium text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-md transition-theme"
						>
							<i className="fa-solid fa-filter mr-1"></i> Filter
						</button>
						<button
							type="button"
							className="px-3 py-1 text-xs font-medium text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-md transition-theme"
						>
							<i className="fa-solid fa-download mr-1"></i> Export
						</button>
					</div>
				</div>

				<AlarmHistory alarms={alarms} onAcknowledge={onAcknowledgeAlarm} />
			</div>
		</div>
	);
};

export default TurbineDetailView;
