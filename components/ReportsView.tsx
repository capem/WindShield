import { useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ComposedChart,
	Legend,
	Line,
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
	ResponsiveContainer,
	Scatter,
	ScatterChart,
	Tooltip,
	XAxis,
	YAxis,
	ZAxis,
} from "recharts";

// --- TAREC COLOR PALETTE ---
const COLORS = {
	gold: "#CD9745", // Primary Gold
	skyBlue: "#008CD3", // Sky Blue
	lightCyan: "#63C3EA", // Light Cyan
	earthBrown: "#9E6C32", // Earth Brown
	mediumGrey: "#898989", // Medium Grey
	slateDark: "#0A0A0A", // Dark background
	slateLight: "#F8FAFC", // Light background
};

// --- MOCK DATA FOR REPORT ---

const KPI_DATA = [
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

const PRODUCTION_DATA = [
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
	{ month: "Dec 25", production: null, cumulative: null, budget: 90 },
];

const LOCAL_FACTOR_DATA = [
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
	{ month: "Dec 25", localFactor: null, budget: 98 },
];

const WIND_ROSE_DATA = [
	{ subject: "N", A: 120, fullMark: 150 },
	{ subject: "NE", A: 98, fullMark: 150 },
	{ subject: "E", A: 86, fullMark: 150 },
	{ subject: "SE", A: 99, fullMark: 150 },
	{ subject: "S", A: 85, fullMark: 150 },
	{ subject: "SW", A: 65, fullMark: 150 },
	{ subject: "W", A: 50, fullMark: 150 },
	{ subject: "NW", A: 80, fullMark: 150 },
];

const ALARM_CATEGORY_DATA = [
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

const ALARM_CODE_DATA = [
	{ code: "111", duration: 50, frequency: 10 },
	{ code: "222", duration: 45, frequency: 8 },
	{ code: "333", duration: 40, frequency: 12 },
	{ code: "444", duration: 35, frequency: 6 },
	{ code: "555", duration: 30, frequency: 15 },
	{ code: "666", duration: 25, frequency: 5 },
	{ code: "777", duration: 20, frequency: 9 },
	{ code: "777", duration: 20, frequency: 9 },
	{ code: "888", duration: 15, frequency: 4 },
];

const STOPS_DATA = [
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

const SPARES_DATA = [
	{ part: "Generator Bearing", quantity: 5, threshold: 10 },
	{ part: "Pitch Motor", quantity: 8, threshold: 10 },
	{ part: "Yaw Motor", quantity: 12, threshold: 10 },
	{ part: "Converter Module", quantity: 3, threshold: 5 },
	{ part: "Hydraulic Pump", quantity: 6, threshold: 8 },
	{ part: "Gearbox Oil Filter", quantity: 20, threshold: 15 },
	{ part: "Anemometer", quantity: 15, threshold: 10 },
	{ part: "Wind Vane", quantity: 10, threshold: 10 },
];

const ENERGY_LOSS_DATA = [
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
	{ turbine: "T19", loss: 28 },
	{ turbine: "T20", loss: 11 },
];

const CONSUMPTION_DATA = [
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

const BOOST_DATA = [
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
const TURBINE_MAP_DATA = Array.from({ length: 50 }, (_, i) => ({
	x: Math.random() * 100,
	y: Math.random() * 100,
	z: Math.random() * 100, // Value for color
	id: `T${i + 1}`,
}));

interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{
		name: string;
		value: number | string;
		color?: string;
	}>;
	label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-white/90 dark:bg-[#111111]/90 backdrop-blur-sm p-3 border border-slate-200 dark:border-white/10 shadow-xl rounded-lg text-xs">
				<p className="font-bold mb-2 text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-white/10 pb-1">
					{label}
				</p>
				{payload.map((entry) => (
					<p
						key={entry.name}
						className="flex items-center gap-2 mb-1"
						style={{ color: entry.color }}
					>
						<span
							className="w-2 h-2 rounded-full"
							style={{ backgroundColor: entry.color }}
						></span>
						<span className="font-medium">{entry.name}:</span>
						<span className="font-bold">
							{typeof entry.value === "number"
								? entry.value.toLocaleString()
								: entry.value}
						</span>
					</p>
				))}
			</div>
		);
	}
	return null;
};

const ReportsView = () => {
	const [analysisText, setAnalysisText] = useState({
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
	});

	const handleAnalysisChange = (
		section: keyof typeof analysisText,
		value: string,
	) => {
		setAnalysisText((prev) => ({ ...prev, [section]: value }));
	};

	return (
		<div className="flex flex-col h-full bg-slate-50 dark:bg-[#050505] overflow-y-auto p-4 gap-4 font-sans transition-colors duration-300">
			{/* --- HEADER --- */}
			<div className="flex items-center justify-between bg-white dark:bg-[#111111] p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
				<div className="flex items-center gap-4">
					<div
						className="px-3 py-1 rounded text-white font-bold tracking-widest text-sm"
						style={{ backgroundColor: COLORS.gold }}
					>
						TAREC
					</div>
					<div className="h-8 w-px bg-slate-200 dark:bg-white/10"></div>
					<h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
						Wind Farm Performance Report
					</h1>
				</div>
				<div className="flex items-center gap-6 text-sm">
					<div className="flex flex-col items-end">
						<span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
							Period
						</span>
						<span className="font-bold text-slate-700 dark:text-slate-200">
							October 2025
						</span>
					</div>
					<div className="h-8 w-px bg-slate-200 dark:bg-white/10"></div>
					<div className="flex flex-col items-end">
						<span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
							Farm Capacity
						</span>
						<span className="font-bold text-slate-700 dark:text-slate-200">
							100 MW
						</span>
					</div>
				</div>
			</div>

			{/* --- KPI TABLE --- */}
			<div className="bg-white dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-white/10 shadow-sm min-h-[100px]">
				<table className="w-full text-[9px] tracking-tight">
					<thead className="bg-slate-50 dark:bg-white/5">
						<tr className="border-b border-slate-100 dark:border-white/10">
							<th className="p-0.5 text-left font-bold text-slate-800 dark:text-white uppercase tracking-wider w-20">
								Key Fig.
							</th>
							<th
								colSpan={2}
								className="p-0.5 text-center font-semibold uppercase tracking-wider border-l border-slate-100 dark:border-white/10"
								style={{ color: COLORS.mediumGrey }}
							>
								Unavail.
							</th>
							<th
								colSpan={2}
								className="p-0.5 text-center font-semibold uppercase tracking-wider border-l border-slate-100 dark:border-white/10"
								style={{ color: COLORS.mediumGrey }}
							>
								TAREC
							</th>
							<th
								colSpan={2}
								className="p-0.5 text-center font-semibold uppercase tracking-wider border-l border-slate-100 dark:border-white/10"
								style={{ color: COLORS.mediumGrey }}
							>
								SGRE
							</th>
							<th
								className="p-0.5 text-center font-semibold uppercase tracking-wider border-l border-slate-100 dark:border-white/10"
								style={{ color: COLORS.mediumGrey }}
							>
								Losses
							</th>
							<th
								className="p-0.5 text-center font-semibold uppercase tracking-wider border-l border-slate-100 dark:border-white/10"
								style={{ color: COLORS.mediumGrey }}
							>
								Boost
							</th>
							<th
								className="p-0.5 text-center font-semibold uppercase tracking-wider border-l border-slate-100 dark:border-white/10"
								style={{ color: COLORS.mediumGrey }}
							>
								Perf
							</th>
							<th
								className="p-0.5 text-center font-semibold uppercase tracking-wider border-l border-slate-100 dark:border-white/10"
								style={{ color: COLORS.mediumGrey }}
							>
								MTBF
							</th>
							<th
								className="p-0.5 text-center font-semibold uppercase tracking-wider border-l border-slate-100 dark:border-white/10"
								style={{ color: COLORS.mediumGrey }}
							>
								MTTR
							</th>
							<th
								className="p-0.5 text-center font-semibold uppercase tracking-wider border-l border-slate-100 dark:border-white/10"
								style={{ color: COLORS.mediumGrey }}
							>
								MTTI
							</th>
						</tr>
						<tr className="text-[9px] text-center font-medium text-slate-500 dark:text-slate-400">
							<th className="p-0.5 border-b border-slate-100 dark:border-white/10"></th>
							<th className="p-0.5 border-b border-slate-100 dark:border-white/10 border-l border-slate-100 dark:border-white/10">
								Time %
							</th>
							<th className="p-0.5 border-b border-slate-100 dark:border-white/10">
								Energy %
							</th>
							<th className="p-0.5 border-b border-slate-100 dark:border-white/10 border-l border-slate-100 dark:border-white/10">
								Time %
							</th>
							<th className="p-0.5 border-b border-slate-100 dark:border-white/10">
								Energy %
							</th>
							<th className="p-0.5 border-b border-slate-100 dark:border-white/10 border-l border-slate-100 dark:border-white/10">
								Time %
							</th>
							<th className="p-0.5 border-b border-slate-100 dark:border-white/10">
								Energy %
							</th>
							<th className="p-0.5 border-b border-slate-100 dark:border-white/10 border-l border-slate-100 dark:border-white/10">
								(MWh)
							</th>
							<th className="p-0.5 border-b border-slate-100 dark:border-white/10 border-l border-slate-100 dark:border-white/10">
								(MWh)
							</th>
							<th className="p-0.5 border-b border-slate-100 dark:border-white/10 border-l border-slate-100 dark:border-white/10">
								(%)
							</th>
							<th className="p-0.5 border-b border-slate-100 dark:border-white/10 border-l border-slate-100 dark:border-white/10">
								(h)
							</th>
							<th className="p-0.5 border-b border-slate-100 dark:border-white/10 border-l border-slate-100 dark:border-white/10">
								(h)
							</th>
							<th className="p-0.5 border-b border-slate-100 dark:border-white/10 border-l border-slate-100 dark:border-white/10">
								(h)
							</th>
						</tr>
					</thead>
					<tbody>
						{KPI_DATA.map((row, index) => (
							<tr
								key={row.label}
								className="text-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
							>
								<td className="p-0.5 text-left border-b border-slate-100 dark:border-white/10">
									<div
										className="flex flex-col border-l-2 pl-1"
										style={{ borderColor: COLORS.gold }}
									>
										<span className="text-[9px] font-bold text-slate-800 dark:text-slate-200">
											{row.label}
										</span>
										<span className="text-[8px] font-normal text-slate-500 dark:text-slate-400">
											{index === 0 ? "1st - last day" : "Jan 1st - last mo"}
										</span>
									</div>
								</td>
								<td className="p-0.5 border-b border-slate-100 dark:border-white/10 font-medium text-slate-700 dark:text-slate-300">
									{row.unavailabilityTotalTime}
								</td>
								<td className="p-0.5 border-b border-slate-100 dark:border-white/10 font-medium text-slate-700 dark:text-slate-300">
									{row.unavailabilityTotalEnergy}
								</td>
								<td className="p-0.5 border-b border-slate-100 dark:border-white/10 text-slate-600 dark:text-slate-400">
									{row.unavailabilityTarecTime}
								</td>
								<td className="p-0.5 border-b border-slate-100 dark:border-white/10 text-slate-600 dark:text-slate-400">
									{row.unavailabilityTarecEnergy}
								</td>
								<td className="p-0.5 border-b border-slate-100 dark:border-white/10 text-slate-600 dark:text-slate-400">
									{row.unavailabilitySgreTime}
								</td>
								<td className="p-0.5 border-b border-slate-100 dark:border-white/10 text-slate-600 dark:text-slate-400">
									{row.unavailabilitySgreEnergy}
								</td>
								<td className="p-0.5 border-b border-slate-100 dark:border-white/10 font-bold text-slate-800 dark:text-slate-200">
									{row.electricalLosses.toLocaleString()}
								</td>
								<td className="p-0.5 border-b border-slate-100 dark:border-white/10 font-bold text-slate-800 dark:text-slate-200">
									{row.powerBoost.toLocaleString()}
								</td>
								<td className="p-0.5 border-b border-slate-100 dark:border-white/10 font-bold text-slate-800 dark:text-slate-200">
									{row.avgTurbinePerformance}
								</td>
								<td className="p-0.5 border-b border-slate-100 dark:border-white/10 font-bold text-slate-800 dark:text-slate-200">
									{row.mtbf}
								</td>
								<td className="p-0.5 border-b border-slate-100 dark:border-white/10 font-bold text-slate-800 dark:text-slate-200">
									{row.mttr}
								</td>
								<td className="p-0.5 border-b border-slate-100 dark:border-white/10 font-bold text-slate-800 dark:text-slate-200">
									{row.mtti}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* --- PRODUCTION & CLIMATE SECTION --- */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white dark:bg-[#111111] p-4 rounded-xl border border-slate-200 dark:border-white/10">
				<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10">
					<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
						Production (GWh)
					</h3>
					<ResponsiveContainer width="100%" height="90%">
						<ComposedChart data={PRODUCTION_DATA}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#e2e8f0"
								vertical={false}
							/>
							<XAxis
								dataKey="month"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								interval={0}
								angle={-45}
								textAnchor="end"
								height={40}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								yAxisId="left"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								tickLine={false}
								axisLine={false}
								label={{
									value: "Prod (GWh)",
									angle: -90,
									position: "insideLeft",
									fontSize: 9,
									fill: "#94a3b8",
								}}
							/>
							<YAxis
								yAxisId="right"
								orientation="right"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								tickLine={false}
								axisLine={false}
								label={{
									value: "Cumul (GWh)",
									angle: 90,
									position: "insideRight",
									fontSize: 9,
									fill: "#94a3b8",
								}}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Legend wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
							<Bar
								yAxisId="left"
								dataKey="production"
								barSize={12}
								fill={COLORS.skyBlue}
								name="Production"
								radius={[2, 2, 0, 0]}
							/>
							<Line
								yAxisId="right"
								type="monotone"
								dataKey="cumulative"
								stroke={COLORS.gold}
								strokeWidth={2}
								dot={false}
								name="Cumulative"
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>

				<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10">
					<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
						Local Factor
					</h3>
					<ResponsiveContainer width="100%" height="90%">
						<ComposedChart data={LOCAL_FACTOR_DATA}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#e2e8f0"
								vertical={false}
							/>
							<XAxis
								dataKey="month"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								interval={0}
								angle={-45}
								textAnchor="end"
								height={40}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								domain={[90, 100]}
								tickLine={false}
								axisLine={false}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Legend wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
							<Bar
								dataKey="localFactor"
								barSize={12}
								fill={COLORS.lightCyan}
								name="Local Factor"
								radius={[2, 2, 0, 0]}
							/>
							<Line
								type="monotone"
								dataKey="budget"
								stroke={COLORS.earthBrown}
								strokeWidth={2}
								dot={false}
								name="Budget"
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>

				<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10 flex flex-col items-center">
					<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
						Wind Rose
					</h3>
					<ResponsiveContainer width="100%" height="90%">
						<RadarChart
							cx="50%"
							cy="50%"
							outerRadius="70%"
							data={WIND_ROSE_DATA}
						>
							<PolarGrid stroke="#e2e8f0" />
							<PolarAngleAxis
								dataKey="subject"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
							/>
							<PolarRadiusAxis
								angle={30}
								domain={[0, 150]}
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								axisLine={false}
							/>
							<Radar
								name="Wind"
								dataKey="A"
								stroke={COLORS.skyBlue}
								fill={COLORS.skyBlue}
								fillOpacity={0.5}
							/>
							<Tooltip content={<CustomTooltip />} />
						</RadarChart>
					</ResponsiveContainer>
				</div>

				<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-4 border border-slate-100 dark:border-white/10 flex flex-col">
					<h3
						className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 border-b pb-2 uppercase tracking-wider"
						style={{ borderColor: COLORS.gold }}
					>
						Analysis
					</h3>
					<textarea
						className="flex-1 w-full text-[11px] font-mono text-slate-600 dark:text-slate-400 leading-relaxed resize-none border-none focus:ring-0 bg-transparent p-0"
						value={analysisText.production}
						onChange={(e) => handleAnalysisChange("production", e.target.value)}
					/>
				</div>
			</div>

			{/* --- ALARMS ANALYSIS SECTION --- */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white dark:bg-[#111111] p-4 rounded-xl border border-slate-200 dark:border-white/10">
				<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10">
					<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
						Duration & Freq by Category
					</h3>
					<ResponsiveContainer width="100%" height="90%">
						<ComposedChart data={ALARM_CATEGORY_DATA}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#e2e8f0"
								vertical={false}
							/>
							<XAxis
								dataKey="category"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								interval={0}
								angle={-45}
								textAnchor="end"
								height={40}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								yAxisId="left"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								tickLine={false}
								axisLine={false}
								label={{
									value: "Dur (h)",
									angle: -90,
									position: "insideLeft",
									fontSize: 9,
									fill: "#94a3b8",
								}}
							/>
							<YAxis
								yAxisId="right"
								orientation="right"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								tickLine={false}
								axisLine={false}
								label={{
									value: "Freq",
									angle: 90,
									position: "insideRight",
									fontSize: 9,
									fill: "#94a3b8",
								}}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Legend wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
							<Bar
								yAxisId="left"
								dataKey="duration"
								barSize={12}
								fill={COLORS.earthBrown}
								name="Duration"
								radius={[2, 2, 0, 0]}
							/>
							<Line
								yAxisId="right"
								type="monotone"
								dataKey="frequency"
								stroke={COLORS.skyBlue}
								strokeWidth={2}
								dot={false}
								name="Frequency"
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>

				<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10">
					<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
						MTBF & MTTI by Category
					</h3>
					<ResponsiveContainer width="100%" height="90%">
						<ComposedChart data={ALARM_CATEGORY_DATA}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#e2e8f0"
								vertical={false}
							/>
							<XAxis
								dataKey="category"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								interval={0}
								angle={-45}
								textAnchor="end"
								height={40}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								yAxisId="left"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								tickLine={false}
								axisLine={false}
								label={{
									value: "MTBF (h)",
									angle: -90,
									position: "insideLeft",
									fontSize: 9,
									fill: "#94a3b8",
								}}
							/>
							<YAxis
								yAxisId="right"
								orientation="right"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								tickLine={false}
								axisLine={false}
								label={{
									value: "MTTI (h)",
									angle: 90,
									position: "insideRight",
									fontSize: 9,
									fill: "#94a3b8",
								}}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Legend wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
							<Bar
								yAxisId="left"
								dataKey="mtbf"
								barSize={12}
								fill={COLORS.lightCyan}
								name="MTBF"
								radius={[2, 2, 0, 0]}
							/>
							<Line
								yAxisId="right"
								type="monotone"
								dataKey="mtti"
								stroke={COLORS.gold}
								strokeWidth={2}
								dot={false}
								name="MTTI"
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>

				<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10">
					<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
						Duration & Freq by Code
					</h3>
					<ResponsiveContainer width="100%" height="90%">
						<ComposedChart data={ALARM_CODE_DATA}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#e2e8f0"
								vertical={false}
							/>
							<XAxis
								dataKey="code"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								interval={0}
								angle={-45}
								textAnchor="end"
								height={40}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								yAxisId="left"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								tickLine={false}
								axisLine={false}
								label={{
									value: "Dur (h)",
									angle: -90,
									position: "insideLeft",
									fontSize: 9,
									fill: "#94a3b8",
								}}
							/>
							<YAxis
								yAxisId="right"
								orientation="right"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								tickLine={false}
								axisLine={false}
								label={{
									value: "Freq",
									angle: 90,
									position: "insideRight",
									fontSize: 9,
									fill: "#94a3b8",
								}}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Legend wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
							<Bar
								yAxisId="left"
								dataKey="duration"
								barSize={12}
								fill={COLORS.earthBrown}
								name="Duration"
								radius={[2, 2, 0, 0]}
							/>
							<Line
								yAxisId="right"
								type="monotone"
								dataKey="frequency"
								stroke={COLORS.skyBlue}
								strokeWidth={2}
								dot={false}
								name="Frequency"
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>

				<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-4 border border-slate-100 dark:border-white/10 flex flex-col">
					<h3
						className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 border-b pb-2 uppercase tracking-wider"
						style={{ borderColor: COLORS.gold }}
					>
						Analysis
					</h3>
					<textarea
						className="flex-1 w-full text-[11px] font-mono text-slate-600 dark:text-slate-400 leading-relaxed resize-none border-none focus:ring-0 bg-transparent p-0"
						value={analysisText.alarms}
						onChange={(e) => handleAnalysisChange("alarms", e.target.value)}
					/>
				</div>
			</div>

			{/* --- STOPS & SPARES SECTION --- */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-white dark:bg-[#111111] p-4 rounded-xl border border-slate-200 dark:border-white/10">
				<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10">
					<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
						Duration & Freq of Turbines Stopped
					</h3>
					<ResponsiveContainer width="100%" height="90%">
						<ComposedChart data={STOPS_DATA}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#e2e8f0"
								vertical={false}
							/>
							<XAxis
								dataKey="turbine"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								interval={0}
								angle={-45}
								textAnchor="end"
								height={40}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								yAxisId="left"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								tickLine={false}
								axisLine={false}
								label={{
									value: "Dur (h)",
									angle: -90,
									position: "insideLeft",
									fontSize: 9,
									fill: "#94a3b8",
								}}
							/>
							<YAxis
								yAxisId="right"
								orientation="right"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								tickLine={false}
								axisLine={false}
								label={{
									value: "Freq",
									angle: 90,
									position: "insideRight",
									fontSize: 9,
									fill: "#94a3b8",
								}}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Legend wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
							<Bar
								yAxisId="left"
								dataKey="duration"
								barSize={12}
								fill={COLORS.earthBrown}
								name="Duration"
								radius={[2, 2, 0, 0]}
							/>
							<Line
								yAxisId="right"
								type="monotone"
								dataKey="frequency"
								stroke={COLORS.skyBlue}
								strokeWidth={2}
								dot={false}
								name="Frequency"
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>

				<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10">
					<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
						Spare Parts (24-month total)
					</h3>
					<ResponsiveContainer width="100%" height="90%">
						<BarChart data={SPARES_DATA} layout="vertical">
							<CartesianGrid
								stroke="#e2e8f0"
								strokeDasharray="3 3"
								horizontal={true}
								vertical={false}
							/>
							<XAxis
								type="number"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								dataKey="part"
								type="category"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								width={80}
								tickLine={false}
								axisLine={false}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Legend wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
							<Bar
								dataKey="quantity"
								barSize={12}
								fill={COLORS.lightCyan}
								name="Quantity"
								radius={[0, 2, 2, 0]}
							/>
							<Line
								type="monotone"
								dataKey="threshold"
								stroke={COLORS.earthBrown}
								strokeWidth={2}
								name="Threshold"
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>

				<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-4 border border-slate-100 dark:border-white/10 flex flex-col">
					<h3
						className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 border-b pb-2 uppercase tracking-wider"
						style={{ borderColor: COLORS.gold }}
					>
						Analysis
					</h3>
					<textarea
						className="flex-1 w-full text-[11px] font-mono text-slate-600 dark:text-slate-400 leading-relaxed resize-none border-none focus:ring-0 bg-transparent p-0"
						value={analysisText.stops}
						onChange={(e) => handleAnalysisChange("stops", e.target.value)}
					/>
				</div>
			</div>

			{/* --- ENERGY LOSS SECTION --- */}
			<div className="bg-white dark:bg-[#111111] p-4 rounded-xl border border-slate-200 dark:border-white/10">
				<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
					Energy Lost in MWh
				</h3>
				<div className="h-48 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={ENERGY_LOSS_DATA}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#e2e8f0"
								vertical={false}
							/>
							<XAxis
								dataKey="turbine"
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								interval={0}
								angle={-90}
								textAnchor="end"
								height={40}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								tick={{ fontSize: 9, fill: "#94a3b8" }}
								tickLine={false}
								axisLine={false}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Bar
								dataKey="loss"
								fill={COLORS.earthBrown}
								name="Energy Loss (MWh)"
								radius={[2, 2, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* --- MAINTENANCE & COMMENTS SECTION --- */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white dark:bg-[#111111] p-4 rounded-xl border border-slate-200 dark:border-white/10">
				<div className="p-2">
					<h3
						className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 border-b pb-2 uppercase tracking-wider"
						style={{ borderColor: COLORS.gold }}
					>
						Turbine Maintenance
					</h3>
					<div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-3 font-mono">
						<div>
							<span
								className="font-bold block mb-1"
								style={{ color: COLORS.gold }}
							>
								Preventive:
							</span>
							<ul className="list-disc pl-4 space-y-1">
								<li>Ground inspections (All)</li>
								<li>NDT (All Zones)</li>
								<li>Blade and T&H Zero (selected)</li>
								<li>One-Stop inspections</li>
								<li>HV pylon and OH line annual check</li>
							</ul>
						</div>
						<div>
							<span
								className="font-bold block mb-1"
								style={{ color: COLORS.gold }}
							>
								Corrective:
							</span>
							<ul className="list-disc pl-4 space-y-1">
								<li>Cursor 34 verification</li>
								<li>MTTI = 0.5 hours</li>
								<li>MTTR = 1.50 hours</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="p-2 border-l border-slate-100 dark:border-white/10">
					<h3
						className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 border-b pb-2 uppercase tracking-wider"
						style={{ borderColor: COLORS.gold }}
					>
						Substations Maintenance
					</h3>
					<div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-3 font-mono">
						<div>
							<span
								className="font-bold block mb-1"
								style={{ color: COLORS.gold }}
							>
								Preventive:
							</span>
							<ul className="list-disc pl-4 space-y-1">
								<li>
									Degreasing and lubrication of columns (NORTH 4.0 & 20-10)
								</li>
								<li>Type B maintenance (TAH)</li>
								<li>High Pylon test</li>
								<li>MTTM = 2.85 hours</li>
							</ul>
						</div>
						<div>
							<span
								className="font-bold block mb-1"
								style={{ color: COLORS.gold }}
							>
								Corrective:
							</span>
							<ul className="list-disc pl-4 space-y-1">
								<li>Alignment/doubling of section switches (NORTH)</li>
								<li>MTTR = 10.05 hours</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="p-2 border-l border-slate-100 dark:border-white/10">
					<h3
						className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 border-b pb-2 uppercase tracking-wider"
						style={{ borderColor: COLORS.gold }}
					>
						PPDMs Maintenance
					</h3>
					<div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-3 font-mono">
						<div>
							<span
								className="font-bold block mb-1"
								style={{ color: COLORS.gold }}
							>
								Preventive:
							</span>
							<ul className="list-disc pl-4 space-y-1">
								<li>Regulatory checks of PPDMs</li>
								<li>Type A, B, PPM fire inspections</li>
								<li>Inspection of 30kV booths (2024)</li>
							</ul>
						</div>
						<div>
							<span
								className="font-bold block mb-1"
								style={{ color: COLORS.gold }}
							>
								Corrective:
							</span>
							<ul className="list-disc pl-4 space-y-1">
								<li>Checks for buried cables (Line 1)</li>
								<li>No Downtime</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="p-2 border-l border-slate-100 dark:border-white/10 flex flex-col h-full">
					<h3
						className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 border-b pb-2 uppercase tracking-wider"
						style={{ borderColor: COLORS.gold }}
					>
						Comments
					</h3>
					<textarea
						className="flex-1 w-full text-[11px] font-mono text-slate-600 dark:text-slate-400 resize-none border-none focus:ring-0 bg-transparent p-0"
						value={analysisText.comments}
						onChange={(e) => handleAnalysisChange("comments", e.target.value)}
					/>
				</div>
			</div>

			{/* --- CONSUMPTION & BOOST SECTION --- */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* Consumption */}
				<div className="bg-white dark:bg-[#111111] p-4 rounded-xl border border-slate-200 dark:border-white/10">
					<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
						Energy consumed per month (MWh)
					</h3>
					<div className="h-40 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10 mb-4">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={CONSUMPTION_DATA}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#e2e8f0"
									vertical={false}
								/>
								<XAxis
									dataKey="month"
									tick={{ fontSize: 9, fill: "#94a3b8" }}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									tick={{ fontSize: 9, fill: "#94a3b8" }}
									tickLine={false}
									axisLine={false}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Bar
									dataKey="value"
									fill={COLORS.skyBlue}
									name="Consumption"
									radius={[2, 2, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
					<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
						Energie consommée par turbine
					</h3>
					<div className="h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10 relative overflow-hidden">
						{/* Mock Map Visualization using ScatterChart */}
						<ResponsiveContainer width="100%" height="100%">
							<ScatterChart
								margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
							>
								<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
								<XAxis type="number" dataKey="x" name="Long" hide />
								<YAxis type="number" dataKey="y" name="Lat" hide />
								<ZAxis
									type="number"
									dataKey="z"
									range={[50, 400]}
									name="Value"
								/>
								<Tooltip cursor={{ strokeDasharray: "3 3" }} />
								<Scatter name="Turbines" data={TURBINE_MAP_DATA} fill="#8884d8">
									{TURBINE_MAP_DATA.map((entry) => (
										<Cell
											key={entry.id}
											fill={
												entry.z > 80
													? COLORS.earthBrown
													: entry.z > 50
														? COLORS.gold
														: COLORS.skyBlue
											}
										/>
									))}
								</Scatter>
							</ScatterChart>
						</ResponsiveContainer>
						<div className="absolute bottom-2 right-2 bg-white dark:bg-black p-1 text-[8px] rounded shadow opacity-70">
							Map Visualization
						</div>
					</div>
				</div>

				{/* Boost */}
				<div className="bg-white dark:bg-[#111111] p-4 rounded-xl border border-slate-200 dark:border-white/10">
					<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
						Boost per month (MWh)
					</h3>
					<div className="h-40 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10 mb-4">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={BOOST_DATA}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#e2e8f0"
									vertical={false}
								/>
								<XAxis
									dataKey="month"
									tick={{ fontSize: 9, fill: "#94a3b8" }}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									tick={{ fontSize: 9, fill: "#94a3b8" }}
									tickLine={false}
									axisLine={false}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Bar
									dataKey="value"
									fill={COLORS.gold}
									name="Boost"
									radius={[2, 2, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
					<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
						Boost par Turbine
					</h3>
					<div className="h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10 relative overflow-hidden">
						{/* Mock Map Visualization using ScatterChart */}
						<ResponsiveContainer width="100%" height="100%">
							<ScatterChart
								margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
							>
								<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
								<XAxis type="number" dataKey="x" name="Long" hide />
								<YAxis type="number" dataKey="y" name="Lat" hide />
								<ZAxis
									type="number"
									dataKey="z"
									range={[50, 400]}
									name="Value"
								/>
								<Tooltip cursor={{ strokeDasharray: "3 3" }} />
								<Scatter name="Turbines" data={TURBINE_MAP_DATA} fill="#8884d8">
									{TURBINE_MAP_DATA.map((entry) => (
										<Cell
											key={entry.id}
											fill={
												entry.z > 80
													? COLORS.earthBrown
													: entry.z > 50
														? COLORS.gold
														: COLORS.skyBlue
											}
										/>
									))}
								</Scatter>
							</ScatterChart>
						</ResponsiveContainer>
						<div className="absolute bottom-2 right-2 bg-white dark:bg-black p-1 text-[8px] rounded shadow opacity-70">
							Map Visualization
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReportsView;
