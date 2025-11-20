import React from "react";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { COLORS, CustomTooltip } from "./Shared";
import {
	LOCAL_FACTOR_DATA,
	PRODUCTION_DATA,
	WIND_ROSE_DATA,
} from "./reportsData";

interface ProductionSectionProps {
	analysisText: string;
	onAnalysisChange: (value: string) => void;
}

const ProductionCharts = React.memo(() => {
	return (
		<>
			<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10 flex flex-col">
				<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
					Production (GWh)
				</h3>
				<div className="flex-1 min-h-0 w-full">
					<ResponsiveContainer width="100%" height="100%">
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
								isAnimationActive={false}
							/>
							<Line
								yAxisId="right"
								type="monotone"
								dataKey="cumulative"
								stroke={COLORS.gold}
								strokeWidth={2}
								dot={false}
								name="Cumulative"
								isAnimationActive={false}
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10 flex flex-col">
				<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
					Local Factor
				</h3>
				<div className="flex-1 min-h-0 w-full">
					<ResponsiveContainer width="100%" height="100%">
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
								isAnimationActive={false}
							/>
							<Line
								type="monotone"
								dataKey="budget"
								stroke={COLORS.earthBrown}
								strokeWidth={2}
								dot={false}
								name="Budget"
								isAnimationActive={false}
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10 flex flex-col items-center">
				<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
					Wind Rose
				</h3>
				<div className="flex-1 min-h-0 w-full">
					<ResponsiveContainer width="100%" height="100%">
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
								isAnimationActive={false}
							/>
							<Tooltip content={<CustomTooltip />} />
						</RadarChart>
					</ResponsiveContainer>
				</div>
			</div>
		</>
	);
});

const ProductionSection = React.memo(
	({ analysisText, onAnalysisChange }: ProductionSectionProps) => {
		return (
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white dark:bg-[#111111] p-4 rounded-xl border border-slate-200 dark:border-white/10">
				<ProductionCharts />

				<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-4 border border-slate-100 dark:border-white/10 flex flex-col">
					<h3
						className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 border-b pb-2 uppercase tracking-wider"
						style={{ borderColor: COLORS.gold }}
					>
						Analysis
					</h3>
					<textarea
						className="flex-1 w-full text-[11px] font-mono text-slate-600 dark:text-slate-400 leading-relaxed resize-none border-none focus:ring-0 bg-transparent p-0"
						value={analysisText}
						onChange={(e) => onAnalysisChange(e.target.value)}
					/>
				</div>
			</div>
		);
	},
);

export default ProductionSection;
