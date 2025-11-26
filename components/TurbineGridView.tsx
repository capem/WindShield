import { SimpleGrid, Text, Title } from "@mantine/core";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useMemo, useRef } from "react";
import TurbineCard from "./TurbineCard";
import { AlarmSeverity, type Alarm, type Turbine } from "../types";

interface TurbineGridViewProps {
	layout: Record<string, { name: string; ids: number[] }[]>;
	filteredTurbines: Turbine[];
	alarms: Alarm[];
	isCompactView: boolean;
}

// Define types for our flattened list items
type GridItem =
	| { type: "zone-header"; name: string }
	| { type: "line-header"; name: string }
	| { type: "turbine-row"; turbines: Turbine[] };

const TurbineGridView: React.FC<TurbineGridViewProps> = ({
	layout,
	filteredTurbines,
	alarms,
	isCompactView,
}) => {
	const parentRef = useRef<HTMLDivElement>(null);

	// Flatten the data structure for virtualization
	const flattenedData = useMemo(() => {
		const items: GridItem[] = [];
		const turbinesMap = new Map(filteredTurbines.map((t) => [t.id, t]));

		(
			Object.entries(layout) as [string, { name: string; ids: number[] }[]][]
		).forEach(([zoneName, lines]) => {
			let hasZoneTurbines = false;
			const zoneItems: GridItem[] = [];

			lines.forEach((line) => {
				const lineTurbines = line.ids
					.map((id) => turbinesMap.get(`T ${String(id).padStart(3, "0")}`))
					.filter((t): t is Turbine => !!t);

				if (lineTurbines.length > 0) {
					hasZoneTurbines = true;
					zoneItems.push({ type: "line-header", name: line.name });

					// Chunk turbines into rows of 6 (xl)
					const chunkSize = 6;
					for (let i = 0; i < lineTurbines.length; i += chunkSize) {
						zoneItems.push({
							type: "turbine-row",
							turbines: lineTurbines.slice(i, i + chunkSize),
						});
					}
				}
			});

			if (hasZoneTurbines) {
				items.push({ type: "zone-header", name: zoneName });
				items.push(...zoneItems);
			}
		});

		return items;
	}, [layout, filteredTurbines]);

	// Helper to determine item size
	const getItemSize = (index: number) => {
		const item = flattenedData[index];
		if (item.type === "zone-header") return 60;
		if (item.type === "line-header") return 40;
		// Turbine row height depends on compact view
		return isCompactView ? 140 : 220;
	};

	const rowVirtualizer = useVirtualizer({
		count: flattenedData.length,
		getScrollElement: () => parentRef.current,
		estimateSize: getItemSize,
		overscan: 3,
	});

	return (
		<div style={{ height: "100%", width: "100%", minHeight: 500 }}>
			<div
				ref={parentRef}
				style={{
					height: "100%",
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
						const item = flattenedData[virtualRow.index];

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
								{item.type === "zone-header" && (
									<Title
										order={4}
										mb="sm"
										style={{
											borderBottom: "1px solid var(--mantine-color-gray-3)",
											paddingTop: 16,
										}}
										pb="xs"
									>
										{item.name}
									</Title>
								)}

								{item.type === "line-header" && (
									<Text
										size="xs"
										fw={700}
										c="dimmed"
										tt="uppercase"
										mb="xs"
										mt="sm"
									>
										{item.name}
									</Text>
								)}

								{item.type === "turbine-row" && (
									<SimpleGrid
										cols={{ base: 1, sm: 2, md: 4, lg: 5, xl: 6 }}
										spacing="sm"
									>
										{item.turbines.map((turbine) => {
											const activeAlarms = alarms.filter(
												(a) => a.turbineId === turbine.id && !a.timeOff,
											);
											let activeAlarmSeverity: AlarmSeverity | null = null;
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
									</SimpleGrid>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default React.memo(TurbineGridView);
