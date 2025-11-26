import { Badge, Group, Text, ThemeIcon, rem } from "@mantine/core";
import {
	IconAlertCircle,
	IconAlertTriangle,
	IconCheck,
	IconHandStop,
	IconInfoCircle,
	IconPlayerPause,
	IconQuestionMark,
	IconTool,
	IconWind,
	IconX,
} from "@tabler/icons-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useMemo, useRef } from "react";
import { TurbineStatus } from "../types";
import type { Turbine } from "../types";

interface TurbineListProps {
	turbines: Turbine[];
	onSelect: (id: string) => void;
	layout: Record<string, { name: string; ids: number[] }[]>;
}

const TurbineRow = React.memo<{
	turbine: Turbine;
	zone: string;
	onSelect: (id: string) => void;
	style: React.CSSProperties;
}>(({ turbine, zone, onSelect, style }) => {
	const getStatusColor = (status: TurbineStatus) => {
		switch (status) {
			case TurbineStatus.Producing:
				return "green";
			case TurbineStatus.Available:
				return "blue";
			case TurbineStatus.Offline:
				return "red";
			case TurbineStatus.Stopped:
				return "yellow";
			case TurbineStatus.Maintenance:
				return "grape";
			case TurbineStatus.Fault:
				return "red";
			case TurbineStatus.Warning:
				return "orange";
			case TurbineStatus.Curtailment:
				return "indigo";
			default:
				return "gray";
		}
	};

	const getStatusIcon = (status: TurbineStatus) => {
		switch (status) {
			case TurbineStatus.Producing:
				return IconCheck;
			case TurbineStatus.Available:
				return IconInfoCircle;
			case TurbineStatus.Stopped:
				return IconPlayerPause;
			case TurbineStatus.Offline:
				return IconX;
			case TurbineStatus.Maintenance:
				return IconTool;
			case TurbineStatus.Fault:
				return IconAlertTriangle;
			case TurbineStatus.Warning:
				return IconAlertCircle;
			case TurbineStatus.Curtailment:
				return IconHandStop;
			default:
				return IconQuestionMark;
		}
	};

	const statusColor = getStatusColor(turbine.status);
	const StatusIcon = getStatusIcon(turbine.status);

	return (
		<button
			type="button"
			style={{
				...style,
				display: "flex",
				alignItems: "center",
				paddingLeft: "var(--mantine-spacing-md)",
				paddingRight: "var(--mantine-spacing-md)",
				background: "transparent",
				border: "none",
				borderBottom: "1px solid var(--mantine-color-default-border)",
				width: "100%",
				textAlign: "left",
				cursor: "pointer",
			}}
			onClick={() => onSelect(turbine.id)}
			className="turbine-row-hover"
		>
			<div style={{ flex: 2, minWidth: 200 }}>
				<Group gap="sm">
					<ThemeIcon variant="light" color="violet" size="lg" radius="md">
						<IconWind style={{ width: rem(20), height: rem(20) }} />
					</ThemeIcon>
					<div>
						<Text fw={700} size="sm">
							{turbine.id}
						</Text>
						<Text size="xs" c="dimmed">
							{zone}
						</Text>
					</div>
				</Group>
			</div>
			<div style={{ flex: 1.5, minWidth: 150 }}>
				<Badge
					color={statusColor}
					variant="light"
					leftSection={
						<StatusIcon style={{ width: rem(12), height: rem(12) }} />
					}
				>
					{turbine.status}
				</Badge>
			</div>
			<div style={{ flex: 1, textAlign: "right", minWidth: 100 }}>
				<Text fz="sm" fw={500} style={{ fontFamily: "monospace" }}>
					{turbine.activePower !== null
						? (turbine.activePower * 1000).toFixed(0)
						: "-"}
				</Text>
			</div>
			<div style={{ flex: 1, textAlign: "right", minWidth: 100 }}>
				<Text fz="sm" fw={500} style={{ fontFamily: "monospace" }}>
					{turbine.windSpeed !== null ? turbine.windSpeed.toFixed(1) : "-"}
				</Text>
			</div>
			<div style={{ flex: 1, textAlign: "right", minWidth: 100 }}>
				<Text fz="sm" fw={500} style={{ fontFamily: "monospace" }}>
					{turbine.temperature !== null ? turbine.temperature.toFixed(1) : "-"}
				</Text>
			</div>
			<div style={{ flex: 1, textAlign: "right", minWidth: 100 }}>
				<Text fz="sm" fw={500} style={{ fontFamily: "monospace" }}>
					{turbine.rpm !== null ? turbine.rpm.toFixed(1) : "-"}
				</Text>
			</div>
		</button>
	);
});

const TurbineList: React.FC<TurbineListProps> = ({
	turbines,
	onSelect,
	layout,
}) => {
	const parentRef = useRef<HTMLDivElement>(null);

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

	const rowVirtualizer = useVirtualizer({
		count: turbines.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 60,
		overscan: 5,
	});

	return (
		<div style={{ height: "100%", width: "100%", minHeight: 500 }}>
			<div
				style={{
					display: "flex",
					padding: "var(--mantine-spacing-sm) var(--mantine-spacing-md)",
					borderBottom: "2px solid var(--mantine-color-default-border)",
					fontWeight: 700,
					fontSize: "var(--mantine-font-size-sm)",
					color: "var(--mantine-color-dimmed)",
				}}
			>
				<div style={{ flex: 2, minWidth: 200 }}>Turbine</div>
				<div style={{ flex: 1.5, minWidth: 150 }}>Status</div>
				<div style={{ flex: 1, textAlign: "right", minWidth: 100 }}>
					Power (kW)
				</div>
				<div style={{ flex: 1, textAlign: "right", minWidth: 100 }}>
					Wind (m/s)
				</div>
				<div style={{ flex: 1, textAlign: "right", minWidth: 100 }}>
					Temp (°C)
				</div>
				<div style={{ flex: 1, textAlign: "right", minWidth: 100 }}>RPM</div>
			</div>
			<div
				ref={parentRef}
				style={{
					height: "calc(100% - 40px)",
					overflow: "auto",
				}}
			>
				<div
					style={{
						height: `${rowVirtualizer.getTotalSize()}px`,
						width: "100%",
						position: "relative",
					}}
				>
					{rowVirtualizer.getVirtualItems().map((virtualRow) => {
						const turbine = turbines[virtualRow.index];
						return (
							<div
								key={virtualRow.key}
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: `${virtualRow.size}px`,
									transform: `translateY(${virtualRow.start}px)`,
								}}
							>
								<TurbineRow
									turbine={turbine}
									zone={turbineZoneMap[turbine.id] || "Unknown Zone"}
									onSelect={onSelect}
									style={{ height: "100%" }}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default React.memo(TurbineList);
