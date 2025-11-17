import type React from "react";
import { useMemo, useState } from "react";
import type { TimestampData } from "../availabilityTypes";

interface TimestampViewProps {
	data: TimestampData[];
}

const TimestampView: React.FC<TimestampViewProps> = ({ data }) => {
	const [sortConfig, setSortConfig] = useState<{
		key: keyof TimestampData;
		direction: "asc" | "desc";
	} | null>({ key: "timestamp", direction: "desc" });

	const [filter, setFilter] = useState({
		dateRange: { start: "", end: "" },
		minWindSpeed: 0,
		hasAlarms: "all", // 'all', 'yes', 'no'
	});

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 50;

	// Apply sorting and filtering
	const processedData = useMemo(() => {
		let filteredData = [...data];

		// Apply filters
		if (filter.dateRange.start && filter.dateRange.end) {
			const startDate = new Date(filter.dateRange.start);
			const endDate = new Date(filter.dateRange.end);
			filteredData = filteredData.filter(
				(item) => item.timestamp >= startDate && item.timestamp <= endDate,
			);
		}

		if (filter.minWindSpeed > 0) {
			filteredData = filteredData.filter(
				(item) => item.averageWindSpeed >= filter.minWindSpeed,
			);
		}

		if (filter.hasAlarms === "yes") {
			filteredData = filteredData.filter(
				(item) => item.activeAlarms.length > 0,
			);
		} else if (filter.hasAlarms === "no") {
			filteredData = filteredData.filter(
				(item) => item.activeAlarms.length === 0,
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

	// Pagination
	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return processedData.slice(startIndex, startIndex + itemsPerPage);
	}, [processedData, currentPage]);

	const totalPages = Math.ceil(processedData.length / itemsPerPage);

	const requestSort = (key: keyof TimestampData) => {
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

	const getSortIcon = (key: keyof TimestampData) => {
		if (!sortConfig || sortConfig.key !== key) {
			return <i className="fa-solid fa-sort ml-2"></i>;
		}
		return sortConfig.direction === "asc" ? (
			<i className="fa-solid fa-sort-up ml-2"></i>
		) : (
			<i className="fa-solid fa-sort-down ml-2"></i>
		);
	};

	const formatTimestamp = (date: Date) => {
		return new Date(date).toLocaleString();
	};

	return (
		<div>
			{/* Filters */}
			<div className="mb-4 flex flex-wrap gap-4">
				<div>
					<label
						htmlFor="start-date"
						className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
					>
						Start Date
					</label>
					<input
						id="start-date"
						type="datetime-local"
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
						type="datetime-local"
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

				<div>
					<label
						htmlFor="min-wind-speed"
						className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
					>
						Min Wind Speed (m/s)
					</label>
					<input
						id="min-wind-speed"
						type="number"
						min="0"
						step="0.1"
						className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white transition-theme"
						value={filter.minWindSpeed}
						onChange={(e) =>
							setFilter({
								...filter,
								minWindSpeed: parseFloat(e.target.value) || 0,
							})
						}
					/>
				</div>

				<div>
					<label
						htmlFor="active-alarms"
						className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
					>
						Active Alarms
					</label>
					<select
						id="active-alarms"
						className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white transition-theme"
						value={filter.hasAlarms}
						onChange={(e) =>
							setFilter({
								...filter,
								hasAlarms: e.target.value as "all" | "yes" | "no",
							})
						}
					>
						<option value="all">All</option>
						<option value="yes">Has Alarms</option>
						<option value="no">No Alarms</option>
					</select>
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
								onClick={() => requestSort("timestamp")}
							>
								Timestamp {getSortIcon("timestamp")}
							</th>
							<th
								scope="col"
								className="px-6 py-3 cursor-pointer text-right hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => requestSort("averagePower")}
							>
								Average Power (kW) {getSortIcon("averagePower")}
							</th>
							<th
								scope="col"
								className="px-6 py-3 cursor-pointer text-right hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => requestSort("averageWindSpeed")}
							>
								Average Wind Speed (m/s) {getSortIcon("averageWindSpeed")}
							</th>
							<th
								scope="col"
								className="px-6 py-3 cursor-pointer text-right hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => requestSort("energyProduced")}
							>
								Energy Produced (kWh) {getSortIcon("energyProduced")}
							</th>
							<th scope="col" className="px-6 py-3">
								Active Alarms
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
							<th
								scope="col"
								className="px-6 py-3 cursor-pointer text-right hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => requestSort("energyLostUndefined")}
							>
								Energy Lost Undefined (kWh) {getSortIcon("energyLostUndefined")}
							</th>
						</tr>
					</thead>
					<tbody>
						{paginatedData.map((item) => (
							<tr
								key={item.timestamp.toString()}
								className="border-b dark:border-gray-800 bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-gray-900/50 transition-colors"
							>
								<td className="px-6 py-4">{formatTimestamp(item.timestamp)}</td>
								<td className="px-6 py-4 text-right">
									{item.averagePower.toFixed(2)}
								</td>
								<td className="px-6 py-4 text-right">
									{item.averageWindSpeed.toFixed(2)}
								</td>
								<td className="px-6 py-4 text-right">
									{item.energyProduced.toFixed(2)}
								</td>
								<td className="px-6 py-4">
									{item.activeAlarms.length > 0
										? item.activeAlarms.join(", ")
										: "None"}
								</td>
								<td className="px-6 py-4 text-right">
									{item.nonExcusableEnergyLost.toFixed(2)}
								</td>
								<td className="px-6 py-4 text-right">
									{item.excusableEnergyLost.toFixed(2)}
								</td>
								<td className="px-6 py-4 text-right font-medium">
									{item.totalEnergyLost.toFixed(2)}
								</td>
								<td className="px-6 py-4 text-right">
									{item.energyLostUndefined.toFixed(2)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="mt-4 flex items-center justify-between">
					<div className="text-sm text-slate-700 dark:text-slate-300">
						Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
						{Math.min(currentPage * itemsPerPage, processedData.length)} of{" "}
						{processedData.length} entries
					</div>
					<div className="flex gap-2">
						<button
							type="button"
							className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 dark:border-gray-700 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
							disabled={currentPage === 1}
						>
							Previous
						</button>
						<span className="px-3 py-1 text-sm">
							{currentPage} of {totalPages}
						</span>
						<button
							type="button"
							className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 dark:border-gray-700 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							onClick={() =>
								setCurrentPage(Math.min(totalPages, currentPage + 1))
							}
							disabled={currentPage === totalPages}
						>
							Next
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default TimestampView;
