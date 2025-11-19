import type React from "react";
import { useMemo } from "react";
import type { Turbine } from "../types";
import { TurbineStatus } from "../types";

interface TurbineListProps {
	turbines: Turbine[];
	onSelect: (id: string) => void;
	layout: Record<string, { name: string; ids: number[] }[]>;
}

const TurbineList: React.FC<TurbineListProps> = ({
	turbines,
	onSelect,
	layout,
}) => {
	const turbineZoneMap = useMemo(() => {
		const map: Record<string, string> = {};
		const entries = Object.entries(layout) as [
			string,
			{ name: string; ids: number[] }[],
		][];
		entries.forEach(([zoneName, lines]) => {
			lines.forEach((line) => {
				line.ids.forEach((id) => {
					map[`T ${String(id).padStart(3, "0")}`] = zoneName;
				});
			});
		});
		return map;
	}, [layout]);

	const getStatusColor = (status: TurbineStatus) => {
		switch (status) {
			case TurbineStatus.Producing:
				return "text-green-500";
			case TurbineStatus.Available:
				return "text-blue-500";
			case TurbineStatus.Offline:
				return "text-red-500";
			case TurbineStatus.Stopped:
				return "text-yellow-500";
			case TurbineStatus.Maintenance:
				return "text-purple-500";
			case TurbineStatus.Fault:
				return "text-red-600";
			case TurbineStatus.Warning:
				return "text-orange-500";
			case TurbineStatus.Curtailment:
				return "text-indigo-500";
			default:
				return "text-gray-500";
		}
	};

	const getStatusIcon = (status: TurbineStatus) => {
		switch (status) {
			case TurbineStatus.Producing:
				return "fa-circle-check";
			case TurbineStatus.Available:
				return "fa-circle-info";
			case TurbineStatus.Stopped:
				return "fa-circle-pause";
			case TurbineStatus.Offline:
				return "fa-circle-xmark";
			case TurbineStatus.Maintenance:
				return "fa-wrench";
			case TurbineStatus.Fault:
				return "fa-triangle-exclamation";
			case TurbineStatus.Warning:
				return "fa-exclamation-triangle";
			case TurbineStatus.Curtailment:
				return "fa-hand";
			default:
				return "fa-circle-question";
		}
	};

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left border-collapse">
				<thead>
					<tr className="text-xs font-semibold text-slate-500 dark:text-gray-400 border-b border-slate-200 dark:border-gray-800 uppercase tracking-wider">
						<th className="py-4 pl-4">Turbine</th>
						<th className="py-4">Status</th>
						<th className="py-4 text-right">Power (kW)</th>
						<th className="py-4 text-right">Wind (m/s)</th>
						<th className="py-4 text-right">Temp (°C)</th>
						<th className="py-4 text-right pr-4">RPM</th>
					</tr>
				</thead>
				<tbody className="text-sm">
					{turbines.map((turbine) => {
						const zone = turbineZoneMap[turbine.id] || "Unknown Zone";
						const statusColor = getStatusColor(turbine.status);
						const statusIcon = getStatusIcon(turbine.status);

						return (
							<tr
								key={turbine.id}
								onClick={() => onSelect(turbine.id)}
								className="border-b border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors group"
							>
								<td className="py-3 pl-4">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-500 dark:text-gray-400 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
											<i className="fa-solid fa-wind"></i>
										</div>
										<div>
											<div className="font-bold text-slate-900 dark:text-white">
												{turbine.id}
											</div>
											<div className="text-xs text-slate-500 dark:text-gray-500">
												{zone}
											</div>
										</div>
									</div>
								</td>
								<td className="py-3">
									<div className={`flex items-center gap-2 ${statusColor}`}>
										<i className={`fa-solid ${statusIcon}`}></i>
										<span className="font-medium">{turbine.status}</span>
									</div>
								</td>
								<td className="py-3 text-right font-mono font-medium text-slate-900 dark:text-white">
									{turbine.activePower !== null
										? (turbine.activePower * 1000).toFixed(0)
										: "-"}
								</td>
								<td className="py-3 text-right font-mono font-medium text-slate-900 dark:text-white">
									{turbine.windSpeed !== null
										? turbine.windSpeed.toFixed(1)
										: "-"}
								</td>
								<td className="py-3 text-right font-mono font-medium text-slate-900 dark:text-white">
									{turbine.temperature !== null
										? turbine.temperature.toFixed(1)
										: "-"}
								</td>
								<td className="py-3 text-right pr-4 font-mono font-medium text-slate-900 dark:text-white">
									{turbine.rpm !== null ? turbine.rpm.toFixed(1) : "-"}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default TurbineList;
