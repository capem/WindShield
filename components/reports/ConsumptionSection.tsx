import React from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Scatter,
	ScatterChart,
	Tooltip,
	XAxis,
	YAxis,
	ZAxis,
} from "recharts";
import { COLORS, CustomTooltip } from "./Shared";
import { BOOST_DATA, CONSUMPTION_DATA, TURBINE_MAP_DATA } from "./reportsData";

const ConsumptionSection = React.memo(() => {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
			{/* Consumption */}
			<div className="bg-white dark:bg-[#111111] p-4 rounded-xl border border-slate-200 dark:border-white/10">
				<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
					Energy consumed per month (MWh)
				</h3>
				<div className="h-40 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10 mb-4 flex flex-col">
					<div className="flex-1 min-h-0 w-full">
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
									isAnimationActive={false}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
				<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
					Energie consommée par turbine
				</h3>
				<div className="h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10 relative overflow-hidden flex flex-col">
					{/* Mock Map Visualization using ScatterChart */}
					<div className="flex-1 min-h-0 w-full">
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
								<Scatter
									name="Turbines"
									data={TURBINE_MAP_DATA}
									fill="#8884d8"
									isAnimationActive={false}
								>
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
					</div>
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
				<div className="h-40 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10 mb-4 flex flex-col">
					<div className="flex-1 min-h-0 w-full">
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
									isAnimationActive={false}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
				<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
					Boost par Turbine
				</h3>
				<div className="h-64 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10 relative overflow-hidden flex flex-col">
					{/* Mock Map Visualization using ScatterChart */}
					<div className="flex-1 min-h-0 w-full">
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
								<Scatter
									name="Turbines"
									data={TURBINE_MAP_DATA}
									fill="#8884d8"
									isAnimationActive={false}
								>
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
					</div>
					<div className="absolute bottom-2 right-2 bg-white dark:bg-black p-1 text-[8px] rounded shadow opacity-70">
						Map Visualization
					</div>
				</div>
			</div>
		</div>
	);
});

export default ConsumptionSection;
