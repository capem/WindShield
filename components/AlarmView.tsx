import type React from "react";
import { useMemo, useState } from "react";
import type { AvailabilityAlarm } from "../availabilityTypes";

interface AlarmViewProps {
	data: AvailabilityAlarm[];
}

const AlarmView: React.FC<AlarmViewProps> = ({ data }) => {
	const [sortConfig, setSortConfig] = useState<{
		key: keyof AvailabilityAlarm;
		direction: "asc" | "desc";
	} | null>({ key: "timeOn", direction: "desc" });

	const [filter, setFilter] = useState({
		alarmType: "all",
		dateRange: { start: "", end: "" },
	});

	// Apply sorting and filtering
	const processedData = useMemo(() => {
		let filteredData = [...data];

		// Apply filters
		if (filter.alarmType !== "all") {
			filteredData = filteredData.filter((alarm) =>
				filter.alarmType === "excusable"
					? alarm.excusableEnergyLost > 0
					: alarm.nonExcusableEnergyLost > 0,
			);
		}

		if (filter.dateRange.start && filter.dateRange.end) {
			const startDate = new Date(filter.dateRange.start);
			const endDate = new Date(filter.dateRange.end);
			filteredData = filteredData.filter(
				(alarm) => alarm.timeOn >= startDate && alarm.timeOn <= endDate,
			);
		}

		// Apply sorting
		if (sortConfig !== null) {
			filteredData.sort((a, b) => {
				const aValue = a[sortConfig.key];
				const bValue = b[sortConfig.key];

				if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
				if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
				return 0;
			});
		}

		return filteredData;
	}, [data, filter, sortConfig]);

	const requestSort = (key: keyof AvailabilityAlarm) => {
		let direction: "asc" | "desc" = "asc";
		if (
			sortConfig &&
			sortConfig.key === key &&
			sortConfig.direction === "asc"
		) {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof AvailabilityAlarm) => {
		if (!sortConfig || sortConfig.key !== key) {
			return <i className="fa-solid fa-sort ml-2"></i>;
		}
		return sortConfig.direction === "asc" ? (
			<i className="fa-solid fa-sort-up ml-2"></i>
		) : (
			<i className="fa-solid fa-sort-down ml-2"></i>
		);
	};

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleString();
	};

	const formatDuration = (hours: number) => {
		const h = Math.floor(hours);
		const m = Math.floor((hours - h) * 60);
		return `${h}h ${m}m`;
	};

	return (
		<div>
			{/* Filters */}
			<div className="mb-4 flex flex-wrap gap-4">
				<div>
					<label
						htmlFor="alarm-type"
						className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
					>
						Alarm Type
					</label>
					<select
						id="alarm-type"
						className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white transition-theme"
						value={filter.alarmType}
						onChange={(e) =>
							setFilter({ ...filter, alarmType: e.target.value })
						}
					>
						<option value="all">All Alarms</option>
						<option value="excusable">Excusable</option>
						<option value="non-excusable">Non-Excusable</option>
					</select>
				</div>

				<div>
					<label
						htmlFor="start-date"
						className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
					>
						Start Date
					</label>
					<input
						id="start-date"
						type="date"
						className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white transition-theme"
						value={filter.dateRange.start}
						onChange={(e) =>
							setFilter({
								...filter,
								dateRange: { ...filter.dateRange, start: e.target.value },
							})
						}
					/>
				</div>

				<div>
					<label
						htmlFor="end-date"
						className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
					>
						End Date
					</label>
					<input
						id="end-date"
						type="date"
						className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white transition-theme"
						value={filter.dateRange.end}
						onChange={(e) =>
							setFilter({
								...filter,
								dateRange: { ...filter.dateRange, end: e.target.value },
							})
						}
					/>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full text-sm text-left text-slate-600 dark:text-gray-400">
					<thead className="bg-slate-50 dark:bg-gray-900 text-xs text-slate-700 dark:text-gray-300 uppercase">
						<tr>
							<th
								scope="col"
								className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => requestSort("timeOn")}
							>
								Time On {getSortIcon("timeOn")}
							</th>
							<th
								scope="col"
								className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => requestSort("timeOff")}
							>
								Time Off {getSortIcon("timeOff")}
							</th>
							<th
								scope="col"
								className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => requestSort("duration")}
							>
								Duration {getSortIcon("duration")}
							</th>
							<th
								scope="col"
								className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => requestSort("alarmName")}
							>
								Alarm Name {getSortIcon("alarmName")}
							</th>
							<th
								scope="col"
								className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => requestSort("alarmCode")}
							>
								Alarm Code {getSortIcon("alarmCode")}
							</th>
							<th
								scope="col"
								className="px-6 py-3 cursor-pointer text-right hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => requestSort("nonExcusableEnergyLost")}
							>
								Non-Excusable Energy Lost (kWh){" "}
								{getSortIcon("nonExcusableEnergyLost")}
							</th>
							<th
								scope="col"
								className="px-6 py-3 cursor-pointer text-right hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => requestSort("excusableEnergyLost")}
							>
								Excusable Energy Lost (kWh) {getSortIcon("excusableEnergyLost")}
							</th>
							<th
								scope="col"
								className="px-6 py-3 cursor-pointer text-right hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => requestSort("totalEnergyLost")}
							>
								Total Energy Lost (kWh) {getSortIcon("totalEnergyLost")}
							</th>
						</tr>
					</thead>
					<tbody>
						{processedData.map((alarm) => (
							<tr
								key={alarm.id}
								className="border-b dark:border-gray-800 bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-gray-900/50 transition-colors"
							>
								<td className="px-6 py-4">{formatDate(alarm.timeOn)}</td>
								<td className="px-6 py-4">
									{alarm.timeOff ? formatDate(alarm.timeOff) : "Active"}
								</td>
								<td className="px-6 py-4">{formatDuration(alarm.duration)}</td>
								<td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
									{alarm.alarmName}
								</td>
								<td className="px-6 py-4">{alarm.alarmCode}</td>
								<td className="px-6 py-4 text-right">
									{alarm.nonExcusableEnergyLost.toFixed(2)}
								</td>
								<td className="px-6 py-4 text-right">
									{alarm.excusableEnergyLost.toFixed(2)}
								</td>
								<td className="px-6 py-4 text-right font-medium">
									{alarm.totalEnergyLost.toFixed(2)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AlarmView;
