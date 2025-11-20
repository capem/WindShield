import React from "react";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { COLORS, CustomTooltip } from "./Shared";
import { ALARM_CATEGORY_DATA, ALARM_CODE_DATA } from "./reportsData";

interface AlarmsSectionProps {
	analysisText: string;
	onAnalysisChange: (value: string) => void;
}

const AlarmsCharts = React.memo(() => {
	return (
		<>
			<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10 flex flex-col">
				<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
					Duration & Freq by Category
				</h3>
				<div className="flex-1 min-h-0 w-full">
					<ResponsiveContainer width="100%" height="100%">
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
								isAnimationActive={false}
							/>
							<Line
								yAxisId="right"
								type="monotone"
								dataKey="frequency"
								stroke={COLORS.skyBlue}
								strokeWidth={2}
								dot={false}
								name="Frequency"
								isAnimationActive={false}
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10 flex flex-col">
				<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
					MTBF & MTTI by Category
				</h3>
				<div className="flex-1 min-h-0 w-full">
					<ResponsiveContainer width="100%" height="100%">
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
								isAnimationActive={false}
							/>
							<Line
								yAxisId="right"
								type="monotone"
								dataKey="mtti"
								stroke={COLORS.gold}
								strokeWidth={2}
								dot={false}
								name="MTTI"
								isAnimationActive={false}
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div className="lg:col-span-1 h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10 flex flex-col">
				<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
					Duration & Freq by Code
				</h3>
				<div className="flex-1 min-h-0 w-full">
					<ResponsiveContainer width="100%" height="100%">
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
								isAnimationActive={false}
							/>
							<Line
								yAxisId="right"
								type="monotone"
								dataKey="frequency"
								stroke={COLORS.skyBlue}
								strokeWidth={2}
								dot={false}
								name="Frequency"
								isAnimationActive={false}
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>
			</div>
		</>
	);
});

const AlarmsSection = React.memo(
	({ analysisText, onAnalysisChange }: AlarmsSectionProps) => {
		return (
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white dark:bg-[#111111] p-4 rounded-xl border border-slate-200 dark:border-white/10">
				<AlarmsCharts />

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

export default AlarmsSection;
