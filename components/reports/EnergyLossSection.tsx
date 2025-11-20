import React from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { COLORS, CustomTooltip } from "./Shared";
import { ENERGY_LOSS_DATA } from "./reportsData";

const EnergyLossSection = React.memo(() => {
	return (
		<div className="bg-white dark:bg-[#111111] p-4 rounded-xl border border-slate-200 dark:border-white/10">
			<h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
				Energy Lost in MWh
			</h3>
			<div className="h-48 bg-slate-50 dark:bg-black/50 rounded-lg p-3 border border-slate-100 dark:border-white/10 flex flex-col">
				<div className="flex-1 min-h-0 w-full">
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
								isAnimationActive={false}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
});

export default EnergyLossSection;
