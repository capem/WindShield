import { Badge, Group, Stack, Text } from "@mantine/core";
import {
	IconAlertTriangle,
	IconCircleCheck,
	IconCircleX,
	IconHandStop,
	IconInfoCircle,
	IconPlayerPause,
	IconTool,
} from "@tabler/icons-react";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { turbineCoordinates } from "../data/mockdata/coordinates";
import type { Turbine } from "../types";
import { TurbineStatus } from "../types";

import "leaflet/dist/leaflet.css";
import "./MapView.css"; // Keeping for basic map container styles if needed, but will try to inline

import { useTheme } from "../contexts/ThemeContext";

interface MapViewProps {
	turbines: Turbine[];
	onTurbineSelect?: (turbineId: string) => void;
}

// Memoize icon creation to avoid re-rendering static markup repeatedly
const iconCache: Record<string, L.DivIcon> = {};

const getTurbineIcon = (status: TurbineStatus) => {
	if (iconCache[status]) {
		return iconCache[status];
	}

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

	const getIcon = (status: TurbineStatus) => {
		const props = { size: 14, color: "white" };
		switch (status) {
			case TurbineStatus.Producing:
				return <IconCircleCheck {...props} />;
			case TurbineStatus.Available:
				return <IconInfoCircle {...props} />;
			case TurbineStatus.Offline:
				return <IconCircleX {...props} />;
			case TurbineStatus.Stopped:
				return <IconPlayerPause {...props} />;
			case TurbineStatus.Maintenance:
				return <IconTool {...props} />;
			case TurbineStatus.Fault:
				return <IconAlertTriangle {...props} />;
			case TurbineStatus.Warning:
				return <IconAlertTriangle {...props} />;
			case TurbineStatus.Curtailment:
				return <IconHandStop {...props} />;
			default:
				return <IconInfoCircle {...props} />;
		}
	};

	const iconHtml = renderToStaticMarkup(
		<div
			style={{
				backgroundColor: statusColors[status],
				width: "24px",
				height: "24px",
				borderRadius: "50%",
				border: "2px solid white",
				boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{getIcon(status)}
		</div>,
	);

	const icon = L.divIcon({
		html: iconHtml,
		className: "turbine-marker-custom",
		iconSize: [28, 28],
		iconAnchor: [14, 14],
		popupAnchor: [0, -14],
	});

	iconCache[status] = icon;
	return icon;
};

const TurbineMarker = React.memo<{
	turbine: Turbine & { latitude?: number; longitude?: number };
	onSelect?: (id: string) => void;
}>(({ turbine, onSelect }) => {
	const icon = getTurbineIcon(turbine.status);

	return (
		<Marker
			position={[turbine.latitude || 0, turbine.longitude || 0]}
			icon={icon}
			eventHandlers={{
				click: () => onSelect?.(turbine.id),
			}}
		>
			<Popup>
				<Stack gap="xs" p={0}>
					<Text fw={700} size="sm">
						{turbine.id}
					</Text>
					<Group gap="xs">
						<Text size="xs" c="dimmed">
							Status:
						</Text>
						<Badge
							size="xs"
							variant="light"
							color={
								turbine.status === TurbineStatus.Producing
									? "green"
									: turbine.status === TurbineStatus.Available
										? "blue"
										: turbine.status === TurbineStatus.Offline
											? "red"
											: turbine.status === TurbineStatus.Stopped
												? "yellow"
												: turbine.status === TurbineStatus.Maintenance
													? "violet"
													: "gray"
							}
						>
							{turbine.status}
						</Badge>
					</Group>
					{turbine.activePower !== null && (
						<Text size="xs">
							Power:{" "}
							<span style={{ fontWeight: 600 }}>
								{turbine.activePower.toFixed(1)} MW
							</span>
						</Text>
					)}
					{turbine.windSpeed !== null && (
						<Text size="xs">
							Wind:{" "}
							<span style={{ fontWeight: 600 }}>
								{turbine.windSpeed.toFixed(1)} m/s
							</span>
						</Text>
					)}
					{turbine.temperature !== null && (
						<Text size="xs">
							Temp:{" "}
							<span style={{ fontWeight: 600 }}>{turbine.temperature}°C</span>
						</Text>
					)}
				</Stack>
			</Popup>
		</Marker>
	);
});

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
	const turbinesWithCoords = React.useMemo(
		() =>
			turbines
				.map((turbine) => {
					const coords = turbineCoordinates[turbine.id];
					return {
						...turbine,
						latitude: coords?.lat,
						longitude: coords?.lng,
					};
				})
				.filter((turbine) => turbine.latitude && turbine.longitude),
		[turbines],
	);

	return (
		<div style={{ height: "100%", width: "100%" }}>
			<MapContainer
				center={center}
				zoom={zoom}
				style={{ height: "100%", width: "100%" }}
			>
				<TileLayer attribution={attribution} url={tileUrl} />
				{turbinesWithCoords.map((turbine) => (
					<TurbineMarker
						key={turbine.id}
						turbine={turbine}
						onSelect={onTurbineSelect}
					/>
				))}
			</MapContainer>
		</div>
	);
};

export default React.memo(MapView);
