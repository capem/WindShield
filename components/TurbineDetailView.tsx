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
	[TurbineStatus.Curtailment]: {
		text: "Curtailment",
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
	const GAUGE_WIDTH = 20;
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
		power > nominalMaxPower ? "text-amber-500" : "text-emerald-500";
	const majorTicksValues = [0, 0.5, 1.0, 1.5, 2.0, 2.5];

	return (
		<div className="relative w-full group">
			<svg
				viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}
				className="w-full overflow-visible drop-shadow-xl"
			>
				<title>Power Gauge</title>
				<defs>
					<linearGradient
						id="gaugeGreenGradient"
						gradientUnits="userSpaceOnUse"
						x1={CX - GAUGE_RADIUS}
						y1="0"
						x2={CX + GAUGE_RADIUS}
						y2="0"
					>
						<stop offset="0%" stopColor="#10b981" />
						<stop offset="50%" stopColor="#34d399" />
						<stop offset="100%" stopColor="#059669" />
					</linearGradient>
					<linearGradient
						id="gaugeAmberGradient"
						gradientUnits="userSpaceOnUse"
						x1={CX - GAUGE_RADIUS}
						y1="0"
						x2={CX + GAUGE_RADIUS}
						y2="0"
					>
						<stop offset="0%" stopColor="#f59e0b" />
						<stop offset="100%" stopColor="#d97706" />
					</linearGradient>
					<radialGradient id="hubGradient">
						<stop offset="0%" stopColor="#f3f4f6" />
						<stop offset="90%" stopColor="#d1d5db" />
						<stop offset="100%" stopColor="#9ca3af" />
					</radialGradient>
				</defs>

				{/* Gauge Background Arc */}
				<path
					d={describeArc(CX, CY, GAUGE_RADIUS, -90, 90)}
					strokeWidth={GAUGE_WIDTH}
					className="stroke-slate-100 dark:stroke-gray-800"
					fill="none"
					strokeLinecap="round"
				/>

				{/* Gauge Value Arcs - Glow Layer */}
				<path
					d={describeArc(
						CX,
						CY,
						GAUGE_RADIUS,
						-90,
						Math.min(needleAngle, nominalMaxAngle),
					)}
					strokeWidth={GAUGE_WIDTH + 4}
					stroke="url(#gaugeGreenGradient)"
					fill="none"
					strokeLinecap="round"
					className="opacity-15 blur-sm"
				/>
				{clampedPower > nominalMaxPower && (
					<path
						d={describeArc(CX, CY, GAUGE_RADIUS, nominalMaxAngle, needleAngle)}
						strokeWidth={GAUGE_WIDTH + 4}
						stroke="url(#gaugeAmberGradient)"
						fill="none"
						strokeLinecap="round"
						className="opacity-15 blur-sm"
					/>
				)}

				{/* Gauge Value Arcs - Main Layer */}
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
					strokeLinecap="round"
				/>
				{clampedPower > nominalMaxPower && (
					<path
						d={describeArc(CX, CY, GAUGE_RADIUS, nominalMaxAngle, needleAngle)}
						strokeWidth={GAUGE_WIDTH}
						stroke="url(#gaugeAmberGradient)"
						fill="none"
						strokeLinecap="round"
					/>
				)}

				{/* Ticks and Labels */}
				{majorTicksValues.map((value) => {
					if (value > gaugeMax) return null;
					const angle = getAngle(value);
					const isMajor = true;
					const tickLength = isMajor ? 8 : 5;
					const tickStart = polarToCartesian(
						CX,
						CY,
						GAUGE_RADIUS - GAUGE_WIDTH / 2 - 2,
						angle,
					);
					const tickEnd = polarToCartesian(
						CX,
						CY,
						GAUGE_RADIUS - GAUGE_WIDTH / 2 - 2 - tickLength,
						angle,
					);
					const labelPos = polarToCartesian(CX, CY, GAUGE_RADIUS + 18, angle);

					return (
						<g key={`tick-${value}`}>
							<line
								x1={tickStart.x}
								y1={tickStart.y}
								x2={tickEnd.x}
								y2={tickEnd.y}
								className="stroke-slate-300 dark:stroke-gray-600"
								strokeWidth="1.5"
							/>
							<text
								x={labelPos.x}
								y={labelPos.y}
								textAnchor="middle"
								alignmentBaseline="central"
								className="text-[9px] font-bold fill-slate-500 dark:fill-gray-400"
							>
								{value.toFixed(1)}
							</text>
						</g>
					);
				})}

				{/* Needle */}
				<g
					transform={`rotate(${needleAngle} ${CX} ${CY})`}
					style={{
						transition: "transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
					}}
				>
					<path
						d={`M ${CX} ${CY - GAUGE_RADIUS + GAUGE_WIDTH / 2} L ${CX - 4} ${CY} L ${CX} ${CY + 8} L ${CX + 4} ${CY} Z`}
						className="fill-slate-700 dark:fill-white drop-shadow-md"
					/>
					<circle cx={CX} cy={CY} r="5" fill="url(#hubGradient)" />
				</g>
			</svg>
			<div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
				<p
					className={`text-5xl font-black tracking-tighter ${powerValueColor} drop-shadow-sm`}
				>
					{power.toFixed(2)}
					<span className="text-lg font-medium text-slate-400 dark:text-slate-500 ml-1">
						MW
					</span>
				</p>
				<div className="flex items-center justify-center gap-1 mt-1">
					<div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
					<p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">
						{powerPercentage.toFixed(0)}% Capacity
					</p>
				</div>
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
	<div className="group bg-white dark:bg-black/40 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-gray-800 flex items-center gap-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-violet-100 dark:hover:border-violet-900/30">
		<div
			className={`p-3.5 rounded-xl ${color.replace("text-", "bg-").replace("-500", "-50")} dark:bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}
		>
			<div
				className={`${color} text-xl w-6 h-6 flex items-center justify-center`}
			>
				{icon}
			</div>
		</div>
		<div className="flex-1">
			<p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-1">
				{title}
			</p>
			<p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
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
			<div className="bg-white dark:bg-black rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-gray-800 flex flex-col items-center justify-center h-[200px] transition-theme">
				<div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-gray-900 flex items-center justify-center mb-3">
					<i className="fa-solid fa-chart-line text-xl text-slate-300 dark:text-gray-600"></i>
				</div>
				<p className="text-slate-500 dark:text-gray-400 font-medium text-sm">
					No historical data available
				</p>
			</div>
		);

	const maxDataVal =
		maxVal > 0 ? maxVal : Math.max(...data) > 0 ? Math.max(...data) : 1;
	const avgDataVal = data.reduce((sum, val) => sum + val, 0) / data.length;

	// Coordinate calculation
	const getCoordinates = (val: number, i: number) => {
		const x = data.length > 1 ? (i / (data.length - 1)) * width : width / 2;
		const y = height - (val / maxDataVal) * height;
		return { x, y };
	};

	const points = data.map((val, i) => getCoordinates(val, i));

	// Simple smoothing using Catmull-Rom to Cubic Bezier conversion
	const svgPath = (
		points: { x: number; y: number }[],
		command: (
			point: { x: number; y: number },
			i: number,
			a: { x: number; y: number }[],
		) => string,
	) => {
		return points.reduce(
			(acc, point, i, a) =>
				i === 0 ? `M ${point.x},${point.y}` : `${acc} ${command(point, i, a)}`,
			"",
		);
	};

	const bezierCommand = (
		_point: { x: number; y: number },
		i: number,
		a: { x: number; y: number }[],
	) => {
		const cps = (p: { x: number; y: number }[], i: number) => {
			const p_1 = p[i - 1];
			const p_2 = p[i - 2] || p[i - 1];
			const p1 = p[i];
			const p2 = p[i + 1] || p1;

			const smoothing = 0.2;

			const line = (
				pA: { x: number; y: number },
				pB: { x: number; y: number },
			) => {
				const lengthX = pB.x - pA.x;
				const lengthY = pB.y - pA.y;
				return {
					length: Math.sqrt(lengthX ** 2 + lengthY ** 2),
					angle: Math.atan2(lengthY, lengthX),
				};
			};

			const controlPoint = (
				current: { x: number; y: number },
				previous: { x: number; y: number },
				next: { x: number; y: number },
				reverse?: boolean,
			) => {
				const p = previous || current;
				const n = next || current;
				const o = line(p, n);
				const angle = o.angle + (reverse ? Math.PI : 0);
				const length = o.length * smoothing;
				const x = current.x + Math.cos(angle) * length;
				const y = current.y + Math.sin(angle) * length;
				return { x, y };
			};

			const cp1 = controlPoint(p_1, p_2, p1);
			const cp2 = controlPoint(p1, p_1, p2, true);
			return `C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${p1.x},${p1.y}`;
		};
		return cps(a, i);
	};

	const linePath = svgPath(points, bezierCommand);
	const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

	const gradientId = `gradient-${color.replace(/[^a-zA-Z0-9]/g, "-")}`;

	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const index = Math.min(
			data.length - 1,
			Math.max(0, Math.round((x / rect.width) * (data.length - 1))),
		);
		const value = data[index];
		const point = getCoordinates(value, index);
		setHoverData({ x: point.x, y: point.y, value, index });
	};

	const handleMouseLeave = () => {
		setHoverData(null);
	};

	return (
		<div className="bg-white dark:bg-black rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-gray-800 transition-theme hover:shadow-md duration-300">
			<div className="flex justify-between items-baseline mb-6">
				<div>
					<h4 className="font-bold text-slate-700 dark:text-gray-300 text-sm uppercase tracking-wide">
						{title}
					</h4>
					<div className="flex items-baseline gap-2 mt-1">
						<p className="text-2xl font-black text-slate-900 dark:text-white">
							{data[data.length - 1].toFixed(1)}
						</p>
						<span className="font-bold text-sm text-slate-400 dark:text-gray-500">
							{unit}
						</span>
					</div>
				</div>
				<div className="flex gap-2">
					<div className="text-right">
						<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
							Max
						</p>
						<p className="text-xs font-bold text-slate-700 dark:text-gray-300">
							{maxDataVal.toFixed(0)}
						</p>
					</div>
					<div className="text-right pl-2 border-l border-slate-100 dark:border-gray-800">
						<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
							Avg
						</p>
						<p className="text-xs font-bold text-slate-700 dark:text-gray-300">
							{avgDataVal.toFixed(1)}
						</p>
					</div>
				</div>
			</div>

			<div className="relative h-[120px] w-full">
				<svg
					viewBox={`0 0 ${width} ${height}`}
					className="w-full h-full overflow-visible"
					preserveAspectRatio="none"
				>
					<title>Historical Chart</title>
					<defs>
						<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor={color} stopOpacity="0.2" />
							<stop offset="100%" stopColor={color} stopOpacity="0" />
						</linearGradient>
						<filter
							id={`glow-${gradientId}`}
							x="-50%"
							y="-50%"
							width="200%"
							height="200%"
						>
							<feGaussianBlur stdDeviation="2" result="coloredBlur" />
							<feMerge>
								<feMergeNode in="coloredBlur" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>
					</defs>

					{/* Grid lines */}
					<line
						x1="0"
						y1={height}
						x2={width}
						y2={height}
						stroke="#e2e8f0"
						strokeWidth="1"
						className="dark:stroke-gray-800"
					/>
					<line
						x1="0"
						y1={0}
						x2={width}
						y2={0}
						stroke="#e2e8f0"
						strokeWidth="1"
						strokeDasharray="4 4"
						className="dark:stroke-gray-800"
					/>
					<line
						x1="0"
						y1={height / 2}
						x2={width}
						y2={height / 2}
						stroke="#e2e8f0"
						strokeWidth="1"
						strokeDasharray="4 4"
						className="dark:stroke-gray-800"
					/>

					<path d={areaPath} fill={`url(#${gradientId})`} />
					<path
						d={linePath}
						fill="none"
						stroke={color}
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						filter={`url(#glow-${gradientId})`}
					/>

					{hoverData && (
						<g>
							<line
								x1={hoverData.x}
								y1="0"
								x2={hoverData.x}
								y2={height}
								stroke={color}
								strokeWidth="1.5"
								strokeDasharray="4 4"
								opacity="0.5"
							/>
							<circle
								cx={hoverData.x}
								cy={hoverData.y}
								r="5"
								fill="white"
								stroke={color}
								strokeWidth="3"
								className="drop-shadow-md"
							/>
						</g>
					)}
				</svg>
				{/* Interactive Overlay */}
				<div
					className="absolute inset-0 cursor-crosshair"
					onMouseMove={handleMouseMove}
					onMouseLeave={handleMouseLeave}
					role="application"
					aria-label="Chart interaction area"
				/>

				{/* Tooltip */}
				{hoverData && (
					<div
						className="absolute pointer-events-none z-10"
						style={{
							left: `${(hoverData.x / width) * 100}%`,
							top: 0,
						}}
					>
						<div
							className="absolute bottom-2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-xl border border-white/10 min-w-[100px]"
							style={{ bottom: `${height - hoverData.y + 10}px` }}
						>
							<p className="text-xs font-medium text-slate-400 mb-0.5">
								{24 - hoverData.index}h ago
							</p>
							<p className="text-lg font-bold leading-none">
								{hoverData.value.toFixed(2)}{" "}
								<span className="text-xs font-normal text-slate-400">
									{unit}
								</span>
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

const SWT_2_3_101_SPECS = {
	RPM_RANGE: { min: 6, max: 16 },
	WIND_SPEED_CUT_OUT: 25,
	MAX_POWER: 2.3,
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
					className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 mb-6 transition-colors pl-1"
				>
					<i className="fa-solid fa-arrow-left transition-transform group-hover:-translate-x-1"></i>
					{savedTurbineId
						? `Back to Dashboard (from ${savedTurbineId})`
						: "Back to Dashboard"}
				</button>

				<div className="relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 dark:border-gray-700/50 transition-theme">
					<div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>

					<div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
						<div>
							<div className="flex items-center gap-4 mb-3">
								<h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
									Turbine {turbine.id}
								</h1>
								<span
									className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm ${config.classes} ring-1 ring-inset ring-black/5 dark:ring-white/10`}
								>
									{config.text}
								</span>
							</div>
							<p className="text-slate-500 dark:text-gray-400 text-lg max-w-2xl">
								Detailed operational metrics and performance data
							</p>
						</div>
						<div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full border border-green-100 dark:border-green-900/30">
							<div className="relative flex h-3 w-3">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
							</div>
							<span className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wide">
								Live Data
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Primary Metrics Section with Power Gauge */}
			<div
				className="mb-8 animate-fade-in"
				style={{ animationDelay: "100ms", animationFillMode: "both" }}
			>
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
									{turbine.activePower !== null && turbine.maxPower > 0
										? `${((turbine.activePower / turbine.maxPower) * 0.1 + 0.9).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 1 })}`
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
			<div
				className="mb-8 animate-fade-in"
				style={{ animationDelay: "200ms", animationFillMode: "both" }}
			>
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
			<div
				className="mb-8 animate-fade-in"
				style={{ animationDelay: "300ms", animationFillMode: "both" }}
			>
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
			<div
				className="animate-fade-in"
				style={{ animationDelay: "400ms", animationFillMode: "both" }}
			>
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
