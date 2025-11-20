import type React from "react";
import { useSearchParams } from "react-router-dom";
import MapView from "./MapView";
import TurbineCard from "./TurbineCard";
import TurbineList from "./TurbineList";
import { turbineCoordinates } from "../data/turbineCoordinates";
import { layout } from "../data/mockData";
import {
	AlarmSeverity,
	TurbineStatus,
	type Alarm,
	type Turbine,
} from "../types";

const iconColorMap: { [key: string]: string } = {
	"text-violet-600":
		"bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/50 dark:to-violet-800/60",
	"text-cyan-500":
		"bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/50 dark:to-cyan-800/60",
	"text-purple-600":
		"bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/60",
	"text-green-600":
		"bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/60",
	"text-pink-500":
		"bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/50 dark:to-pink-800/60",
	"text-orange-500":
		"bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/60",
};

const SummaryCard: React.FC<{
	title: string;
	value: string;
	unit: string;
	icon: React.ReactNode;
	color: string;
}> = ({ title, value, unit, icon, color }) => (
	<div className="bg-white dark:bg-black p-2 rounded-lg shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 transition-theme-fast">
		<div>
			<p className="text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-wide">
				{title}
			</p>
			<p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
				{value}{" "}
				<span className="text-xs font-medium text-slate-500 dark:text-slate-400">
					{unit}
				</span>
			</p>
		</div>
		<div
			className={`p-1.5 rounded-md ${iconColorMap[color] || "bg-slate-100 dark:bg-slate-700"}`}
		>
			<div
				className={`${color} text-sm w-5 h-5 flex items-center justify-center`}
			>
				{icon}
			</div>
		</div>
	</div>
);

const TurbineStatusSummaryCard: React.FC<{
	counts: {
		producing: number;
		available: number;
		stopped: number;
		offline: number;
		maintenance: number;
		fault: number;
		warning: number;
		curtailment: number;
	};
	className?: string;
}> = ({ counts, className }) => {
	const statusItems = [
		{
			name: "Producing",
			count: counts.producing,
			icon: <i className="fa-solid fa-circle-check"></i>,
			color: "text-green-500",
		},
		{
			name: "Available",
			count: counts.available,
			icon: <i className="fa-solid fa-circle-info"></i>,
			color: "text-blue-500",
		},
		{
			name: "Stopped",
			count: counts.stopped,
			icon: <i className="fa-solid fa-circle-pause"></i>,
			color: "text-yellow-500",
		},
		{
			name: "Offline",
			count: counts.offline,
			icon: <i className="fa-solid fa-circle-xmark"></i>,
			color: "text-red-500",
		},
		{
			name: "Maintenance",
			count: counts.maintenance,
			icon: <i className="fa-solid fa-wrench"></i>,
			color: "text-purple-500",
		},
		{
			name: "Fault",
			count: counts.fault,
			icon: <i className="fa-solid fa-triangle-exclamation"></i>,
			color: "text-red-600",
		},
		{
			name: "Warning",
			count: counts.warning,
			icon: <i className="fa-solid fa-exclamation-triangle"></i>,
			color: "text-orange-500",
		},
		{
			name: "Curtailment",
			count: counts.curtailment,
			icon: <i className="fa-solid fa-hand"></i>,
			color: "text-indigo-500",
		},
	];

	return (
		<div
			className={`bg-white dark:bg-black p-2 rounded-lg shadow-sm h-full flex flex-col ${className} transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 transition-theme-fast`}
		>
			<p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium mb-1 uppercase tracking-wide">
				Turbine Status
			</p>
			<div className="flex-grow grid grid-cols-2 gap-x-4 gap-y-0.5">
				{statusItems.map((item) => (
					<div key={item.name} className="flex justify-between items-center">
						<div
							className={`flex items-center gap-1.5 font-medium ${item.color}`}
						>
							<span className="text-xs w-3 text-center">{item.icon}</span>
							<span className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold">
								{item.name}
							</span>
						</div>
						<span className="font-bold text-xs text-slate-800 dark:text-white">
							{item.count}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

interface DashboardProps {
	turbines: Turbine[];
	alarms: Alarm[];
	currentTime: Date;
	uploadedFileName: string | null;
	onSelectTurbine: (id: string) => void;
	isCompactView: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
	turbines,
	alarms,
	currentTime,
	uploadedFileName,
	onSelectTurbine,
	isCompactView,
}) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const viewMode = searchParams.get("view") || "grid";
	const searchQuery = searchParams.get("search") || "";
	const statusFilter =
		(searchParams.get("status") as TurbineStatus | "All") || "All";

	const setViewMode = (mode: string) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set("view", mode);
		setSearchParams(newParams);
	};

	const setSearchQuery = (query: string) => {
		const newParams = new URLSearchParams(searchParams);
		if (query) newParams.set("search", query);
		else newParams.delete("search");
		setSearchParams(newParams);
	};

	const setStatusFilter = (status: string) => {
		const newParams = new URLSearchParams(searchParams);
		if (status !== "All") newParams.set("status", status);
		else newParams.delete("status");
		setSearchParams(newParams);
	};

	// --- COHERENT DATA CALCULATIONS ---
	const onlineTurbines = turbines.filter(
		(t) => t.status !== TurbineStatus.Offline,
	);
	const totalActivePower = onlineTurbines.reduce(
		(sum, t) => sum + (t.activePower || 0),
		0,
	);
	const totalReactivePower = onlineTurbines.reduce(
		(sum, t) => sum + (t.reactivePower || 0),
		0,
	);

	const turbineStatusCounts = {
		producing: turbines.filter((t) => t.status === TurbineStatus.Producing)
			.length,
		available: turbines.filter((t) => t.status === TurbineStatus.Available)
			.length,
		stopped: turbines.filter((t) => t.status === TurbineStatus.Stopped).length,
		offline: turbines.filter((t) => t.status === TurbineStatus.Offline).length,
		maintenance: turbines.filter((t) => t.status === TurbineStatus.Maintenance)
			.length,
		fault: turbines.filter((t) => t.status === TurbineStatus.Fault).length,
		warning: turbines.filter((t) => t.status === TurbineStatus.Warning).length,
		curtailment: turbines.filter((t) => t.status === TurbineStatus.Curtailment)
			.length,
	};

	const totalInstalledCapacity = turbines.reduce(
		(sum, t) => sum + t.maxPower,
		0,
	);
	const loadFactor =
		totalInstalledCapacity > 0
			? (totalActivePower / totalInstalledCapacity) * 100
			: 0;

	const hoursToday = currentTime.getHours() + currentTime.getMinutes() / 60;
	const productionTodayMWh = totalActivePower * hoursToday;

	const onlineTurbinesWithWind = onlineTurbines.filter(
		(t) => t.windSpeed !== null,
	);
	const averageWindSpeed =
		onlineTurbinesWithWind.length > 0
			? onlineTurbinesWithWind.reduce((sum, t) => sum + (t.windSpeed ?? 0), 0) /
				onlineTurbinesWithWind.length
			: 0;

	const onlineTurbinesWithTemp = onlineTurbines.filter(
		(t) => t.temperature !== null,
	);
	const averageTemperature =
		onlineTurbinesWithTemp.length > 0
			? onlineTurbinesWithTemp.reduce(
					(sum, t) => sum + (t.temperature ?? 0),
					0,
				) / onlineTurbinesWithTemp.length
			: 0;

	const summaryDataTop = [
		{
			title: "Active Power",
			value: totalActivePower.toFixed(1),
			unit: "MW",
			icon: <i className="fa-solid fa-bolt"></i>,
			color: "text-violet-600",
		},
		{
			title: "Reactive Power",
			value: totalReactivePower.toFixed(1),
			unit: "MVar",
			icon: <i className="fa-solid fa-bolt-lightning"></i>,
			color: "text-cyan-500",
		},
	];

	const summaryDataMiddle = [
		{
			title: "Average Wind Speed",
			value: averageWindSpeed.toFixed(1),
			unit: "m/s",
			icon: <i className="fa-solid fa-wind"></i>,
			color: "text-pink-500",
		},
		{
			title: "Average Temperature",
			value: averageTemperature.toFixed(0),
			unit: "°C",
			icon: <i className="fa-solid fa-temperature-half"></i>,
			color: "text-orange-500",
		},
	];

	const summaryDataBottom = [
		{
			title: "Load Factor",
			value: loadFactor.toFixed(1),
			unit: "%",
			icon: <i className="fa-solid fa-gauge-high"></i>,
			color: "text-purple-600",
		},
		{
			title: "Production (Today)",
			value: productionTodayMWh.toFixed(1),
			unit: "MWh",
			icon: <i className="fa-solid fa-chart-line"></i>,
			color: "text-green-600",
		},
	];

	const weekday = currentTime.toLocaleDateString("en-US", {
		weekday: "long",
	});
	const day = currentTime.getDate();
	const month = currentTime.toLocaleDateString("en-US", { month: "long" });
	const year = currentTime.getFullYear();
	const formattedDate = `${weekday} ${day} ${month} ${year}`;
	const formattedTime = currentTime.toLocaleTimeString("fr-FR");

	// Filter turbines
	const filteredTurbines = turbines.filter((turbine) => {
		const matchesSearch = turbine.id
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesStatus =
			statusFilter === "All" || turbine.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	return (
		<div className="flex flex-col h-full">
			<h1 className="text-2xl font-bold text-slate-900 mb-4 dark:text-white transition-theme shrink-0">
				Dashboard
			</h1>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 shrink-0">
				<div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{summaryDataTop.map((data) => (
						<SummaryCard key={data.title} {...data} />
					))}
					{summaryDataMiddle.map((data) => (
						<SummaryCard key={data.title} {...data} />
					))}
					{summaryDataBottom.map((data) => (
						<SummaryCard key={data.title} {...data} />
					))}
				</div>
				<TurbineStatusSummaryCard
					counts={turbineStatusCounts}
					className="lg:col-span-1"
				/>
			</div>

			<div className="bg-white dark:bg-black rounded-lg shadow-sm p-3 mt-4 transition-theme flex-1 flex flex-col">
				<div className="pb-3 mb-3 border-b border-slate-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-3 shrink-0">
					<div className="flex items-center gap-4 w-full md:w-auto">
						<div className="relative flex-1 md:w-64">
							<i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
							<input
								type="text"
								placeholder="Search turbine..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-100 dark:bg-gray-900 border-none rounded-md text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 outline-none transition-theme"
							/>
						</div>
						<div className="relative">
							<select
								value={statusFilter}
								onChange={(e) =>
									setStatusFilter(e.target.value as TurbineStatus | "All")
								}
								className="pl-3 pr-8 py-1.5 text-sm bg-slate-100 dark:bg-gray-900 border-none rounded-md text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 outline-none appearance-none cursor-pointer transition-theme"
							>
								<option value="All">All Statuses</option>
								{Object.values(TurbineStatus).map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>
							<i className="fa-solid fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
						</div>
					</div>

					<div className="flex items-center bg-slate-100 dark:bg-gray-900 rounded-lg p-1 transition-theme">
						<button
							type="button"
							onClick={() => setViewMode("grid")}
							className={`p-1.5 rounded-md transition-all ${
								viewMode === "grid"
									? "bg-white dark:bg-gray-800 text-violet-600 dark:text-violet-400 shadow-sm"
									: "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200"
							}`}
							title="Grid View"
						>
							<i className="fa-solid fa-border-all"></i>
						</button>
						<button
							type="button"
							onClick={() => setViewMode("list")}
							className={`p-1.5 rounded-md transition-all ${
								viewMode === "list"
									? "bg-white dark:bg-gray-800 text-violet-600 dark:text-violet-400 shadow-sm"
									: "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200"
							}`}
							title="List View"
						>
							<i className="fa-solid fa-list"></i>
						</button>
						<button
							type="button"
							onClick={() => setViewMode("map")}
							className={`p-1.5 rounded-md transition-all ${
								viewMode === "map"
									? "bg-white dark:bg-gray-800 text-violet-600 dark:text-violet-400 shadow-sm"
									: "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200"
							}`}
							title="Map View"
						>
							<i className="fa-solid fa-map"></i>
						</button>
					</div>
				</div>

				<div className="flex justify-between items-center text-xs mb-3 text-slate-500 dark:text-gray-400 shrink-0">
					<span>
						{uploadedFileName ? (
							<>
								Displaying data from{" "}
								<span className="text-violet-500 font-bold">
									{uploadedFileName}
								</span>
							</>
						) : (
							<>
								{formattedDate} at {formattedTime}
							</>
						)}
					</span>
					<span>
						Last updated:{" "}
						{currentTime.toLocaleTimeString("fr-FR", {
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit",
						})}
					</span>
				</div>

				{viewMode === "map" ? (
					<div className="flex-1 min-h-[500px] rounded-lg overflow-hidden border border-slate-200 dark:border-gray-800 relative">
						<div className="absolute inset-0">
							<MapView
								turbines={filteredTurbines.map((turbine) => ({
									...turbine,
									latitude: turbineCoordinates[turbine.id]?.lat,
									longitude: turbineCoordinates[turbine.id]?.lng,
								}))}
								onTurbineSelect={onSelectTurbine}
							/>
						</div>
					</div>
				) : viewMode === "list" ? (
					<TurbineList
						turbines={filteredTurbines}
						onSelect={onSelectTurbine}
						layout={layout}
					/>
				) : (
					<div className="space-y-6">
						{Object.entries(layout).map(([zoneName, lines]) => {
							// Filter lines to only include turbines that match the filter
							const visibleLines = lines
								.map((line) => {
									const lineTurbines = line.ids
										.map((id) =>
											filteredTurbines.find(
												(t) => t.id === `T ${String(id).padStart(3, "0")}`,
											),
										)
										.filter((t): t is Turbine => !!t);
									return { ...line, turbines: lineTurbines };
								})
								.filter((line) => line.turbines.length > 0);

							if (visibleLines.length === 0) return null;

							return (
								<div key={zoneName}>
									<h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3 pb-1 border-b border-violet-200 dark:border-violet-700">
										{zoneName}
									</h2>
									<div className="space-y-4">
										{visibleLines.map((line) => (
											<div key={line.name}>
												<h3 className="text-xs font-semibold text-slate-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
													{line.name}
												</h3>
												<div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
													{line.turbines.map((turbine) => {
														const activeAlarms = alarms.filter(
															(a) => a.turbineId === turbine.id && !a.timeOff,
														);
														let activeAlarmSeverity: AlarmSeverity | null =
															null;
														if (activeAlarms.length > 0) {
															if (
																activeAlarms.some(
																	(a) => a.severity === AlarmSeverity.Critical,
																)
															)
																activeAlarmSeverity = AlarmSeverity.Critical;
															else if (
																activeAlarms.some(
																	(a) => a.severity === AlarmSeverity.Warning,
																)
															)
																activeAlarmSeverity = AlarmSeverity.Warning;
															else activeAlarmSeverity = AlarmSeverity.Info;
														}

														return (
															<TurbineCard
																key={turbine.id}
																turbine={turbine}
																to={`/turbine/${encodeURIComponent(turbine.id)}`}
																isCompact={isCompactView}
																activeAlarmSeverity={activeAlarmSeverity}
															/>
														);
													})}
												</div>
											</div>
										))}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
