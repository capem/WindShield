import type React from "react";
import type { Turbine } from "../types";
import { AlarmSeverity, TurbineStatus } from "../types";

interface TurbineCardProps {
	turbine: Turbine;
	onClick: () => void;
	isCompact?: boolean;
	activeAlarmSeverity?: AlarmSeverity | null;
}

const AnimatedTurbineIcon: React.FC<{
	status: TurbineStatus;
	activePower: number | null;
	maxPower: number;
}> = ({ status, activePower, maxPower }) => {
	const baseColor = {
		[TurbineStatus.Producing]: "text-green-500",
		[TurbineStatus.Available]: "text-blue-500",
		[TurbineStatus.Offline]: "text-red-400",
		[TurbineStatus.Stopped]: "text-yellow-500",
		[TurbineStatus.Maintenance]: "text-purple-500",
		[TurbineStatus.Fault]: "text-red-600",
		[TurbineStatus.Warning]: "text-orange-500",
		[TurbineStatus.Curtailment]: "text-indigo-500",
	}[status];

	let animationStyle: React.CSSProperties = {};

	if (status === TurbineStatus.Producing && activePower && maxPower) {
		// Faster spin for higher power output. Duration from 4s (low power) to 0.5s (max power)
		const powerRatio = activePower / maxPower;
		const duration = Math.max(0.5, 4 - powerRatio * 3.5);
		animationStyle = {
			animation: `spin ${duration.toFixed(2)}s linear infinite`,
		};
	} else if (status === TurbineStatus.Available) {
		animationStyle = { animation: "spin 12s linear infinite" };
	}

	const blades = (
		<g style={animationStyle} className="origin-center">
			<path
				d="M12 12 L12 2"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M12 12 L20.66 18"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M12 12 L3.34 18"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</g>
	);

	return (
		<svg
			viewBox="0 0 24 24"
			className={`w-full h-full ${baseColor}`}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Turbine Status Icon</title>
			{/* Tower */}
			<path
				d="M12 22 L11 12.5 h2 L12 22"
				fill="currentColor"
				stroke="currentColor"
				strokeWidth="0.5"
				strokeLinejoin="round"
			/>
			{/* Blades */}
			{blades}
			{/* Hub */}
			<circle cx="12" cy="12" r="1.5" fill="currentColor" />
		</svg>
	);
};

const TurbineCard: React.FC<TurbineCardProps> = ({
	turbine,
	onClick,
	isCompact = false,
	activeAlarmSeverity = null,
}) => {
	const statusConfig = {
		[TurbineStatus.Producing]: {
			text: "Producing",
			classes:
				"text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 border-green-500",
		},
		[TurbineStatus.Available]: {
			text: "Available",
			classes:
				"text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 border-blue-500",
		},
		[TurbineStatus.Offline]: {
			text: "Offline",
			classes:
				"text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 border-red-500",
		},
		[TurbineStatus.Stopped]: {
			text: "Stopped",
			classes:
				"text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500",
		},
		[TurbineStatus.Maintenance]: {
			text: "Maintenance",
			classes:
				"text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 border-purple-500",
		},
		[TurbineStatus.Fault]: {
			text: "Fault",
			classes:
				"text-red-800 dark:text-red-200 bg-red-200 dark:bg-red-900/40 border-red-600",
		},
		[TurbineStatus.Warning]: {
			text: "Warning",
			classes:
				"text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30 border-orange-500",
		},
		[TurbineStatus.Curtailment]: {
			text: "Curtailment",
			classes:
				"text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30 border-indigo-500",
		},
	};

	const alarmConfig: {
		[key in AlarmSeverity]: { icon: string; color: string };
	} = {
		[AlarmSeverity.Critical]: {
			icon: "fa-triangle-exclamation",
			color: "text-red-500",
		},
		[AlarmSeverity.Warning]: {
			icon: "fa-triangle-exclamation",
			color: "text-yellow-500",
		},
		[AlarmSeverity.Info]: { icon: "fa-circle-info", color: "text-blue-500" },
	};

	const config = statusConfig[turbine.status];
	const statusClasses = config.classes
		.split(" ")
		.filter((c) => !c.startsWith("border-"));
	const borderClass = config.classes
		.split(" ")
		.find((c) => c.startsWith("border-"));

	if (isCompact) {
		return (
			<button
				type="button"
				onClick={onClick}
				className={`bg-white dark:bg-black rounded-lg p-1.5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${borderClass} border-l-4 flex flex-col justify-between text-left w-full h-full transition-theme-fast`}
			>
				<div className="flex justify-between items-center mb-0.5">
					<div className="flex items-center gap-1">
						{activeAlarmSeverity && (
							<i
								className={`fa-solid ${alarmConfig[activeAlarmSeverity].icon} ${alarmConfig[activeAlarmSeverity].color} text-xs`}
								title={`${activeAlarmSeverity} Alarm Active`}
							></i>
						)}
						<h3 className="font-bold text-slate-800 dark:text-white text-[10px]">
							{turbine.id}
						</h3>
					</div>
					<span
						className={`text-[8px] font-bold px-1 py-0 rounded-full ${statusClasses.join(" ")}`}
					>
						{config.text}
					</span>
				</div>
				<div className="flex items-center justify-around gap-1 mt-0.5 flex-grow">
					<div className="w-6 h-6 flex-shrink-0">
						<AnimatedTurbineIcon
							status={turbine.status}
							activePower={turbine.activePower}
							maxPower={turbine.maxPower}
						/>
					</div>
					<div className="text-[8px] text-center space-y-0">
						<div>
							<p className="text-slate-500 dark:text-gray-400 text-[8px] leading-none">
								Pwr
							</p>
							<p className="font-bold text-slate-900 dark:text-white text-[9px] leading-tight">
								{turbine.activePower !== null
									? `${turbine.activePower.toFixed(1)}`
									: "-"}
							</p>
						</div>
						<div>
							<p className="text-slate-500 dark:text-gray-400 text-[8px] leading-none">
								Wind
							</p>
							<p className="font-bold text-slate-900 dark:text-white text-[9px] leading-tight">
								{turbine.windSpeed !== null
									? `${turbine.windSpeed.toFixed(1)}`
									: "-"}
							</p>
						</div>
					</div>
				</div>
			</button>
		);
	}

	return (
		<button
			type="button"
			onClick={onClick}
			className={`bg-white dark:bg-black rounded-lg p-2 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${borderClass} border-l-4 flex flex-col justify-between text-left w-full transition-theme-fast`}
		>
			<div>
				<div className="flex justify-between items-center mb-1">
					<div className="flex items-center gap-1.5">
						{activeAlarmSeverity && (
							<i
								className={`fa-solid ${alarmConfig[activeAlarmSeverity].icon} ${alarmConfig[activeAlarmSeverity].color} text-xs`}
								title={`${activeAlarmSeverity} Alarm Active`}
							></i>
						)}
						<h3 className="font-bold text-slate-800 dark:text-white text-xs">
							{turbine.id}
						</h3>
					</div>
					<span
						className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${statusClasses.join(" ")}`}
					>
						{config.text}
					</span>
				</div>
				<div className="flex justify-center items-center my-1 h-10">
					<div className="w-10 h-10">
						<AnimatedTurbineIcon
							status={turbine.status}
							activePower={turbine.activePower}
							maxPower={turbine.maxPower}
						/>
					</div>
				</div>
			</div>

			<div className="text-[10px] text-center space-y-0.5 mt-1">
				<div className="flex justify-between items-end border-b border-slate-100 dark:border-gray-800 pb-0.5">
					<p className="text-slate-500 dark:text-gray-400">Power</p>
					<p className="font-bold text-slate-900 dark:text-white">
						{turbine.activePower !== null
							? `${turbine.activePower.toFixed(1)} MW`
							: "-"}
					</p>
				</div>
				<div className="flex justify-between items-end pt-0.5">
					<p className="text-slate-500 dark:text-gray-400">Wind</p>
					<p className="font-bold text-slate-900 dark:text-white">
						{turbine.windSpeed !== null
							? `${turbine.windSpeed.toFixed(1)} m/s`
							: "-"}
					</p>
				</div>
			</div>
		</button>
	);
};

export default TurbineCard;
