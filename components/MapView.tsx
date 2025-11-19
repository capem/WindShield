import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import type React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { turbineCoordinates } from "../data/turbineCoordinates";
import type { Turbine } from "../types";
import { TurbineStatus } from "../types";

import "leaflet/dist/leaflet.css";
import "./MapView.css";

import { useTheme } from "../contexts/ThemeContext";

interface MapViewProps {
	turbines: Turbine[];
	onTurbineSelect?: (turbineId: string) => void;
}

// Custom icon for turbine markers
const createTurbineIcon = (status: TurbineStatus) => {
	const statusColors = {
		[TurbineStatus.Producing]: "#10b981", // green
		[TurbineStatus.Available]: "#3b82f6", // blue
		[TurbineStatus.Offline]: "#ef4444", // red
		[TurbineStatus.Stopped]: "#eab308", // yellow
		[TurbineStatus.Maintenance]: "#8b5cf6", // purple
		[TurbineStatus.Fault]: "#dc2626", // dark red
		[TurbineStatus.Warning]: "#f97316", // orange
		[TurbineStatus.Curtailment]: "#6366f1", // indigo
	};

	const statusIcons = {
		[TurbineStatus.Producing]: "fa-circle-check",
		[TurbineStatus.Available]: "fa-circle-info",
		[TurbineStatus.Offline]: "fa-circle-xmark",
		[TurbineStatus.Stopped]: "fa-circle-pause",
		[TurbineStatus.Maintenance]: "fa-wrench",
		[TurbineStatus.Fault]: "fa-triangle-exclamation",
		[TurbineStatus.Warning]: "fa-exclamation-triangle",
		[TurbineStatus.Curtailment]: "fa-hand",
	};

	return L.divIcon({
		html: `
			<div 
				style="
					background-color: ${statusColors[status]};
					width: 24px;
					height: 24px;
					border-radius: 50%;
					border: 2px solid white;
					box-shadow: 0 2px 4px rgba(0,0,0,0.3);
					display: flex;
					align-items: center;
					justify-content: center;
				"
			>
				<i class="fa-solid ${statusIcons[status]}" style="color: white; font-size: 12px;"></i>
			</div>
		`,
		className: "turbine-marker",
		iconSize: [28, 28],
		iconAnchor: [14, 14],
		popupAnchor: [0, -14],
	});
};

const MapView: React.FC<MapViewProps> = ({ turbines, onTurbineSelect }) => {
	const { isDarkMode } = useTheme();

	// Center the map on the wind farm
	const center: LatLngExpression = [27.77, -12.9];
	const zoom = 11;

	// Tile layer URLs for light and dark mode
	const tileUrl = isDarkMode
		? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
		: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

	const attribution = isDarkMode
		? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
		: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

	// Add coordinates to turbines
	const turbinesWithCoords = turbines
		.map((turbine) => {
			const coords = turbineCoordinates[turbine.id];
			return {
				...turbine,
				latitude: coords?.lat,
				longitude: coords?.lng,
			};
		})
		.filter((turbine) => turbine.latitude && turbine.longitude);

	return (
		<div className="map-container">
			<MapContainer
				center={center}
				zoom={zoom}
				style={{ height: "100%", width: "100%" }}
			>
				<TileLayer attribution={attribution} url={tileUrl} />
				{turbinesWithCoords.map((turbine) => (
					<Marker
						key={turbine.id}
						position={[turbine.latitude || 0, turbine.longitude || 0]}
						icon={createTurbineIcon(turbine.status)}
						eventHandlers={{
							click: () => onTurbineSelect?.(turbine.id),
						}}
					>
						<Popup>
							<div className="turbine-popup">
								<h3>{turbine.id}</h3>
								<p>Status: {turbine.status}</p>
								{turbine.activePower !== null && (
									<p>Active Power: {turbine.activePower.toFixed(1)} MW</p>
								)}
								{turbine.windSpeed !== null && (
									<p>Wind Speed: {turbine.windSpeed.toFixed(1)} m/s</p>
								)}
								{turbine.temperature !== null && (
									<p>Temperature: {turbine.temperature}°C</p>
								)}
							</div>
						</Popup>
					</Marker>
				))}
			</MapContainer>
		</div>
	);
};

export default MapView;
