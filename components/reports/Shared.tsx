import React from "react";

// --- TAREC COLOR PALETTE ---
export const COLORS = {
	gold: "#CD9745", // Primary Gold
	skyBlue: "#008CD3", // Sky Blue
	lightCyan: "#63C3EA", // Light Cyan
	earthBrown: "#9E6C32", // Earth Brown
	mediumGrey: "#898989", // Medium Grey
	slateDark: "#0A0A0A", // Dark background
	slateLight: "#F8FAFC", // Light background
};

export interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{
		name: string;
		value: number | string;
		color?: string;
	}>;
	label?: string;
}

export const CustomTooltip = ({
	active,
	payload,
	label,
}: CustomTooltipProps) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-white/90 dark:bg-[#111111]/90 backdrop-blur-sm p-3 border border-slate-200 dark:border-white/10 shadow-xl rounded-lg text-xs">
				<p className="font-bold mb-2 text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-white/10 pb-1">
					{label}
				</p>
				{payload.map((entry) => (
					<p
						key={entry.name}
						className="flex items-center gap-2 mb-1"
						style={{ color: entry.color }}
					>
						<span
							className="w-2 h-2 rounded-full"
							style={{ backgroundColor: entry.color }}
						></span>
						<span className="font-medium">{entry.name}:</span>
						<span className="font-bold">
							{typeof entry.value === "number"
								? entry.value.toLocaleString()
								: entry.value}
						</span>
					</p>
				))}
			</div>
		);
	}
	return null;
};
