import type React from "react";
import { TurbineStatus } from "../../types";
import "./MapLegend.css";

interface MapLegendProps {
	className?: string;
}

const MapLegend: React.FC<MapLegendProps> = ({ className = "" }) => {
	const statusItems = [
		{ status: TurbineStatus.Producing, color: "#10b981", label: "Producing" },
		{ status: TurbineStatus.Available, color: "#3b82f6", label: "Available" },
		{ status: TurbineStatus.Offline, color: "#ef4444", label: "Offline" },
		{ status: TurbineStatus.Stopped, color: "#eab308", label: "Stopped" },
		{
			status: TurbineStatus.Maintenance,
			color: "#8b5cf6",
			label: "Maintenance",
		},
		{ status: TurbineStatus.Fault, color: "#dc2626", label: "Fault" },
		{ status: TurbineStatus.Warning, color: "#f97316", label: "Warning" },
		{
			status: TurbineStatus.Curtailment,
			color: "#6366f1",
			label: "Curtailment",
		},
	];

	return (
		<div className={`map-legend ${className}`}>
			<h4>Turbine Status</h4>
			{statusItems.map((item) => (
				<div key={item.status} className="legend-item">
					<div
						className="legend-color"
						style={{ backgroundColor: item.color }}
					></div>
					<span className="legend-label">{item.label}</span>
				</div>
			))}
		</div>
	);
};

export default MapLegend;
