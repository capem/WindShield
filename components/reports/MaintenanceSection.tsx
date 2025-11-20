import React from "react";
import { COLORS } from "./Shared";

interface MaintenanceSectionProps {
	analysisText: string;
	onAnalysisChange: (value: string) => void;
}

const MaintenanceLists = React.memo(() => {
	return (
		<React.Fragment>
			<div className="p-2">
				<h3
					className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 border-b pb-2 uppercase tracking-wider"
					style={{ borderColor: COLORS.gold }}
				>
					Turbine Maintenance
				</h3>
				<div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-3 font-mono">
					<div>
						<span
							className="font-bold block mb-1"
							style={{ color: COLORS.gold }}
						>
							Preventive:
						</span>
						<ul className="list-disc pl-4 space-y-1">
							<li>Ground inspections (All)</li>
							<li>NDT (All Zones)</li>
							<li>Blade and T&H Zero (selected)</li>
							<li>One-Stop inspections</li>
							<li>HV pylon and OH line annual check</li>
						</ul>
					</div>
					<div>
						<span
							className="font-bold block mb-1"
							style={{ color: COLORS.gold }}
						>
							Corrective:
						</span>
						<ul className="list-disc pl-4 space-y-1">
							<li>Cursor 34 verification</li>
							<li>MTTI = 0.5 hours</li>
							<li>MTTR = 1.50 hours</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="p-2 border-l border-slate-100 dark:border-white/10">
				<h3
					className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 border-b pb-2 uppercase tracking-wider"
					style={{ borderColor: COLORS.gold }}
				>
					Substations Maintenance
				</h3>
				<div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-3 font-mono">
					<div>
						<span
							className="font-bold block mb-1"
							style={{ color: COLORS.gold }}
						>
							Preventive:
						</span>
						<ul className="list-disc pl-4 space-y-1">
							<li>Degreasing and lubrication of columns (NORTH 4.0 & 20-10)</li>
							<li>Type B maintenance (TAH)</li>
							<li>High Pylon test</li>
							<li>MTTM = 2.85 hours</li>
						</ul>
					</div>
					<div>
						<span
							className="font-bold block mb-1"
							style={{ color: COLORS.gold }}
						>
							Corrective:
						</span>
						<ul className="list-disc pl-4 space-y-1">
							<li>Alignment/doubling of section switches (NORTH)</li>
							<li>MTTR = 10.05 hours</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="p-2 border-l border-slate-100 dark:border-white/10">
				<h3
					className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 border-b pb-2 uppercase tracking-wider"
					style={{ borderColor: COLORS.gold }}
				>
					PPDMs Maintenance
				</h3>
				<div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-3 font-mono">
					<div>
						<span
							className="font-bold block mb-1"
							style={{ color: COLORS.gold }}
						>
							Preventive:
						</span>
						<ul className="list-disc pl-4 space-y-1">
							<li>Regulatory checks of PPDMs</li>
							<li>Type A, B, PPM fire inspections</li>
							<li>Inspection of 30kV booths (2024)</li>
						</ul>
					</div>
					<div>
						<span
							className="font-bold block mb-1"
							style={{ color: COLORS.gold }}
						>
							Corrective:
						</span>
						<ul className="list-disc pl-4 space-y-1">
							<li>Checks for buried cables (Line 1)</li>
							<li>No Downtime</li>
						</ul>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
});

const MaintenanceSection = React.memo(
	({ analysisText, onAnalysisChange }: MaintenanceSectionProps) => {
		return (
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white dark:bg-[#111111] p-4 rounded-xl border border-slate-200 dark:border-white/10">
				<MaintenanceLists />

				<div className="p-2 border-l border-slate-100 dark:border-white/10 flex flex-col h-full">
					<h3
						className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 border-b pb-2 uppercase tracking-wider"
						style={{ borderColor: COLORS.gold }}
					>
						Comments
					</h3>
					<textarea
						className="flex-1 w-full text-[11px] font-mono text-slate-600 dark:text-slate-400 resize-none border-none focus:ring-0 bg-transparent p-0"
						value={analysisText}
						onChange={(e) => onAnalysisChange(e.target.value)}
					/>
				</div>
			</div>
		);
	},
);

export default MaintenanceSection;
