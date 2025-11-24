import React from "react";
import { Box, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import TurbineCard from "./TurbineCard";
import { AlarmSeverity, type Alarm, type Turbine } from "../types";

interface TurbineGridViewProps {
	layout: Record<string, { name: string; ids: number[] }[]>;
	filteredTurbines: Turbine[];
	alarms: Alarm[];
	isCompactView: boolean;
}

const TurbineGridView: React.FC<TurbineGridViewProps> = ({
	layout,
	filteredTurbines,
	alarms,
	isCompactView,
}) => {
	return (
		<Stack gap="xl">
			{(
				Object.entries(layout) as [string, { name: string; ids: number[] }[]][]
			).map(([zoneName, lines]) => {
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
					<Box key={zoneName}>
						<Title
							order={4}
							mb="sm"
							style={{
								borderBottom: "1px solid var(--mantine-color-gray-3)",
							}}
							pb="xs"
						>
							{zoneName}
						</Title>
						<Stack gap="md">
							{visibleLines.map((line) => (
								<Box key={line.name}>
									<Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="xs">
										{line.name}
									</Text>
									<SimpleGrid
										cols={{ base: 1, sm: 2, md: 4, lg: 5, xl: 6 }}
										spacing="sm"
									>
										{line.turbines.map((turbine) => {
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
								</Box>
							))}
						</Stack>
					</Box>
				);
			})}
		</Stack>
	);
};

export default React.memo(TurbineGridView);
