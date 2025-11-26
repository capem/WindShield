import {
	Badge,
	Box,
	Divider,
	Group,
	Paper,
	Stack,
	Table,
	Text,
	Title,
} from "@mantine/core";
import { useCallback, useState } from "react";
import AlarmsSection from "./reports/AlarmsSection";
import ConsumptionSection from "./reports/ConsumptionSection";
import EnergyLossSection from "./reports/EnergyLossSection";
import MaintenanceSection from "./reports/MaintenanceSection";
import ProductionSection from "./reports/ProductionSection";
import { COLORS } from "./reports/Shared";
import StopsSection from "./reports/StopsSection";
import { KPI_DATA } from "./reports/reportsData";

const ReportsView = () => {
	const [analysisText, setAnalysisText] = useState({
		production: `The load factor for October was 33%.
In October 2025, the wind farm prevented CO2 emissions of around 35k tonnes (*).
The availability target was achieved (>98%) during October.

The predominant wind directions are:
- NNE: 30%
- NE: 25%
- ENE: 7%

The wind speed is representing 100% of the time for the farm:
- [3, 7]: 24%
- [7, 11]: 30%`,
		alarms: `The total downtime corresponds to 5.05%, broken down mainly into the following categories:
System (2.47%): TAREC (1097 - Remote stop - Owner) and TAREC (1001 - Manual stop) are the main alarms of the month.
Hydraulics (1.45%): The name of the alarm (2101 - Hydraulic level error) is a common error.
Converter (0.74%): Low voltage induced the turbines to return in the alarm (3101 - Converter fault external).`,
		stops: `The spare downtime converges to 5.05%, broken down mainly into the following categories:
System (2.47%): TAREC (1097 - Remote stop - Owner) and TAREC (1001 - Manual stop) are the main alarms of the month.
Hydraulics (1.45%): The name of the alarm (2101 - Hydraulic level error) is a common error.
Converter (0.74%): Low voltage induced the turbines to return in the alarm (3101 - Converter fault external).`,
		comments: `TAREC is consolidating its position among the best wind farms in terms of energy.
- Reviewing of the estimation (MWh) & Turbine
- Reviewing of the HMI display panel and installation of signage`,
	});

	const handleProductionChange = useCallback((value: string) => {
		setAnalysisText((prev) => ({ ...prev, production: value }));
	}, []);

	const handleAlarmsChange = useCallback((value: string) => {
		setAnalysisText((prev) => ({ ...prev, alarms: value }));
	}, []);

	const handleStopsChange = useCallback((value: string) => {
		setAnalysisText((prev) => ({ ...prev, stops: value }));
	}, []);

	const handleCommentsChange = useCallback((value: string) => {
		setAnalysisText((prev) => ({ ...prev, comments: value }));
	}, []);

	return (
		<Stack gap="md" p="md" h="100%" style={{ overflowY: "auto" }}>
			{/* --- HEADER --- */}
			<Paper p="md" radius="md" withBorder shadow="sm">
				<Group justify="space-between">
					<Group gap="md">
						<Badge
							size="lg"
							radius="sm"
							variant="filled"
							color="yellow"
							style={{
								backgroundColor: COLORS.gold,
								color: "white",
								letterSpacing: 2,
							}}
						>
							TAREC
						</Badge>
						<Divider orientation="vertical" />
						<Title order={3}>Wind Farm Performance Report</Title>
					</Group>
					<Group gap="xl">
						<Stack gap={0} align="flex-end">
							<Text size="xs" fw={700} c="dimmed" tt="uppercase">
								Period
							</Text>
							<Text fw={700}>October 2025</Text>
						</Stack>
						<Divider orientation="vertical" />
						<Stack gap={0} align="flex-end">
							<Text size="xs" fw={700} c="dimmed" tt="uppercase">
								Farm Capacity
							</Text>
							<Text fw={700}>100 MW</Text>
						</Stack>
					</Group>
				</Group>
			</Paper>

			{/* --- KPI TABLE --- */}
			<Paper radius="md" withBorder shadow="sm" style={{ overflow: "hidden" }}>
				<Table.ScrollContainer minWidth={800}>
					<Table withTableBorder withColumnBorders striped highlightOnHover>
						<Table.Thead style={{ backgroundColor: "var(--bg-tertiary)" }}>
							<Table.Tr>
								<Table.Th w={80}>Key Fig.</Table.Th>
								<Table.Th
									colSpan={2}
									style={{ textAlign: "center", color: COLORS.mediumGrey }}
								>
									Unavail.
								</Table.Th>
								<Table.Th
									colSpan={2}
									style={{ textAlign: "center", color: COLORS.mediumGrey }}
								>
									TAREC
								</Table.Th>
								<Table.Th
									colSpan={2}
									style={{ textAlign: "center", color: COLORS.mediumGrey }}
								>
									SGRE
								</Table.Th>
								<Table.Th
									style={{ textAlign: "center", color: COLORS.mediumGrey }}
								>
									Losses
								</Table.Th>
								<Table.Th
									style={{ textAlign: "center", color: COLORS.mediumGrey }}
								>
									Boost
								</Table.Th>
								<Table.Th
									style={{ textAlign: "center", color: COLORS.mediumGrey }}
								>
									Perf
								</Table.Th>
								<Table.Th
									style={{ textAlign: "center", color: COLORS.mediumGrey }}
								>
									MTBF
								</Table.Th>
								<Table.Th
									style={{ textAlign: "center", color: COLORS.mediumGrey }}
								>
									MTTR
								</Table.Th>
								<Table.Th
									style={{ textAlign: "center", color: COLORS.mediumGrey }}
								>
									MTTI
								</Table.Th>
							</Table.Tr>
							<Table.Tr>
								<Table.Th></Table.Th>
								<Table.Th style={{ textAlign: "center", fontSize: 10 }}>
									Time %
								</Table.Th>
								<Table.Th style={{ textAlign: "center", fontSize: 10 }}>
									Energy %
								</Table.Th>
								<Table.Th style={{ textAlign: "center", fontSize: 10 }}>
									Time %
								</Table.Th>
								<Table.Th style={{ textAlign: "center", fontSize: 10 }}>
									Energy %
								</Table.Th>
								<Table.Th style={{ textAlign: "center", fontSize: 10 }}>
									Time %
								</Table.Th>
								<Table.Th style={{ textAlign: "center", fontSize: 10 }}>
									Energy %
								</Table.Th>
								<Table.Th style={{ textAlign: "center", fontSize: 10 }}>
									(MWh)
								</Table.Th>
								<Table.Th style={{ textAlign: "center", fontSize: 10 }}>
									(MWh)
								</Table.Th>
								<Table.Th style={{ textAlign: "center", fontSize: 10 }}>
									(%)
								</Table.Th>
								<Table.Th style={{ textAlign: "center", fontSize: 10 }}>
									(h)
								</Table.Th>
								<Table.Th style={{ textAlign: "center", fontSize: 10 }}>
									(h)
								</Table.Th>
								<Table.Th style={{ textAlign: "center", fontSize: 10 }}>
									(h)
								</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{KPI_DATA.map((row, index) => (
								<Table.Tr key={row.label}>
									<Table.Td>
										<Box
											style={{
												borderLeft: `2px solid ${COLORS.gold}`,
												paddingLeft: 4,
											}}
										>
											<Text size="xs" fw={700}>
												{row.label}
											</Text>
											<Text size="xs" c="dimmed" style={{ fontSize: 8 }}>
												{index === 0 ? "1st - last day" : "Jan 1st - last mo"}
											</Text>
										</Box>
									</Table.Td>
									<Table.Td style={{ textAlign: "center" }}>
										{row.unavailabilityTotalTime}
									</Table.Td>
									<Table.Td style={{ textAlign: "center" }}>
										{row.unavailabilityTotalEnergy}
									</Table.Td>
									<Table.Td style={{ textAlign: "center" }}>
										{row.unavailabilityTarecTime}
									</Table.Td>
									<Table.Td style={{ textAlign: "center" }}>
										{row.unavailabilityTarecEnergy}
									</Table.Td>
									<Table.Td style={{ textAlign: "center" }}>
										{row.unavailabilitySgreTime}
									</Table.Td>
									<Table.Td style={{ textAlign: "center" }}>
										{row.unavailabilitySgreEnergy}
									</Table.Td>
									<Table.Td style={{ textAlign: "center", fontWeight: 700 }}>
										{row.electricalLosses.toLocaleString()}
									</Table.Td>
									<Table.Td style={{ textAlign: "center", fontWeight: 700 }}>
										{row.powerBoost.toLocaleString()}
									</Table.Td>
									<Table.Td style={{ textAlign: "center", fontWeight: 700 }}>
										{row.avgTurbinePerformance}
									</Table.Td>
									<Table.Td style={{ textAlign: "center", fontWeight: 700 }}>
										{row.mtbf}
									</Table.Td>
									<Table.Td style={{ textAlign: "center", fontWeight: 700 }}>
										{row.mttr}
									</Table.Td>
									<Table.Td style={{ textAlign: "center", fontWeight: 700 }}>
										{row.mtti}
									</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</Table.ScrollContainer>
			</Paper>

			{/* --- SECTIONS --- */}
			<ProductionSection
				analysisText={analysisText.production}
				onAnalysisChange={handleProductionChange}
			/>
			<AlarmsSection
				analysisText={analysisText.alarms}
				onAnalysisChange={handleAlarmsChange}
			/>
			<StopsSection
				analysisText={analysisText.stops}
				onAnalysisChange={handleStopsChange}
			/>
			<EnergyLossSection />
			<MaintenanceSection
				analysisText={analysisText.comments}
				onAnalysisChange={handleCommentsChange}
			/>
			<ConsumptionSection />
		</Stack>
	);
};

export default ReportsView;
