import { useCallback, useState } from "react";
import AlarmsSection from "./reports/AlarmsSection";
import ConsumptionSection from "./reports/ConsumptionSection";
import EnergyLossSection from "./reports/EnergyLossSection";
import MaintenanceSection from "./reports/MaintenanceSection";
import ProductionSection from "./reports/ProductionSection";
import { COLORS } from "./reports/Shared";
import StopsSection from "./reports/StopsSection";
import { KPI_DATA } from "./reports/reportsData";

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

	const handleProductionChange = useCallback((value: string) => {
		setAnalysisText((prev) => ({ ...prev, production: value }));
	}, []);

	const handleAlarmsChange = useCallback((value: string) => {
		setAnalysisText((prev) => ({ ...prev, alarms: value }));
	}, []);

	const handleStopsChange = useCallback((value: string) => {
		setAnalysisText((prev) => ({ ...prev, stops: value }));
	}, []);

	const handleCommentsChange = useCallback((value: string) => {
		setAnalysisText((prev) => ({ ...prev, comments: value }));
	}, []);

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

			{/* --- SECTIONS --- */}
			<ProductionSection
				analysisText={analysisText.production}
				onAnalysisChange={handleProductionChange}
			/>
			<AlarmsSection
				analysisText={analysisText.alarms}
				onAnalysisChange={handleAlarmsChange}
			/>
			<StopsSection
				analysisText={analysisText.stops}
				onAnalysisChange={handleStopsChange}
			/>
			<EnergyLossSection />
			<MaintenanceSection
				analysisText={analysisText.comments}
				onAnalysisChange={handleCommentsChange}
			/>
			<ConsumptionSection />
		</div>
	);
};

export default ReportsView;
