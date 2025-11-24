import React, { useMemo } from "react";
import { Table, Group, Text, ThemeIcon, Badge, rem } from "@mantine/core";
import {
	IconWind,
	IconCheck,
	IconInfoCircle,
	IconPlayerPause,
	IconX,
	IconTool,
	IconAlertTriangle,
	IconAlertCircle,
	IconHandStop,
	IconQuestionMark,
} from "@tabler/icons-react";
import type { Turbine } from "../types";
import { TurbineStatus } from "../types";

interface TurbineListProps {
	turbines: Turbine[];
	onSelect: (id: string) => void;
	layout: Record<string, { name: string; ids: number[] }[]>;
}

const TurbineRow = React.memo<{
	turbine: Turbine;
	zone: string;
	onSelect: (id: string) => void;
}>(({ turbine, zone, onSelect }) => {
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
		<Table.Tr
			onClick={() => onSelect(turbine.id)}
			style={{ cursor: "pointer" }}
			className="turbine-row-hover"
		>
			<Table.Td>
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
			</Table.Td>
			<Table.Td>
				<Badge
					color={statusColor}
					variant="light"
					leftSection={
						<StatusIcon style={{ width: rem(12), height: rem(12) }} />
					}
				>
					{turbine.status}
				</Badge>
			</Table.Td>
			<Table.Td style={{ textAlign: "right" }}>
				<Text fz="sm" fw={500} style={{ fontFamily: "monospace" }}>
					{turbine.activePower !== null
						? (turbine.activePower * 1000).toFixed(0)
						: "-"}
				</Text>
			</Table.Td>
			<Table.Td style={{ textAlign: "right" }}>
				<Text fz="sm" fw={500} style={{ fontFamily: "monospace" }}>
					{turbine.windSpeed !== null ? turbine.windSpeed.toFixed(1) : "-"}
				</Text>
			</Table.Td>
			<Table.Td style={{ textAlign: "right" }}>
				<Text fz="sm" fw={500} style={{ fontFamily: "monospace" }}>
					{turbine.temperature !== null ? turbine.temperature.toFixed(1) : "-"}
				</Text>
			</Table.Td>
			<Table.Td style={{ textAlign: "right" }}>
				<Text fz="sm" fw={500} style={{ fontFamily: "monospace" }}>
					{turbine.rpm !== null ? turbine.rpm.toFixed(1) : "-"}
				</Text>
			</Table.Td>
		</Table.Tr>
	);
});

const TurbineList: React.FC<TurbineListProps> = ({
	turbines,
	onSelect,
	layout,
}) => {
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

	return (
		<Table.ScrollContainer minWidth={800}>
			<Table verticalSpacing="sm" highlightOnHover>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Turbine</Table.Th>
						<Table.Th>Status</Table.Th>
						<Table.Th style={{ textAlign: "right" }}>Power (kW)</Table.Th>
						<Table.Th style={{ textAlign: "right" }}>Wind (m/s)</Table.Th>
						<Table.Th style={{ textAlign: "right" }}>Temp (°C)</Table.Th>
						<Table.Th style={{ textAlign: "right" }}>RPM</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{turbines.map((turbine) => (
						<TurbineRow
							key={turbine.id}
							turbine={turbine}
							zone={turbineZoneMap[turbine.id] || "Unknown Zone"}
							onSelect={onSelect}
						/>
					))}
				</Table.Tbody>
			</Table>
		</Table.ScrollContainer>
	);
};

export default React.memo(TurbineList);
