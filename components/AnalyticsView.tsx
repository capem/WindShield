import {
	Box,
	Card,
	Center,
	Grid,
	Group,
	Paper,
	Stack,
	Table,
	Text,
	TextInput,
	ThemeIcon,
	Title,
	UnstyledButton,
} from "@mantine/core";
import {
	IconArrowsSort,
	IconBattery4,
	IconBolt,
	IconBuildingFactory,
	IconClock,
	IconSortAscending,
	IconSortDescending,
	IconWind,
} from "@tabler/icons-react";
import React, { useMemo, useState } from "react";
import { calculateSummaryStats } from "../availabilityDataUtils";
import type { Turbine } from "../types";
import { TurbineStatus } from "../types";
import TurbineAvailabilityModal from "./TurbineAvailabilityModal";

// FIX: Define a type for historical data rows to resolve typing errors.
type HistoricalDataRow = {
	Timestamp: string;
	"Turbine ID": string | number;
	Status: string;
	"ActivePower(MW)": string | number | null;
	"ReactivePower(MVar)": string | number | null;
	"WindSpeed(m/s)": string | number | null;
	"Direction(°)": string | number | null;
	"Temperature(°C)": string | number | null;
	RPM: string | number | null;
	"MaxPower(MW)": string | number | null;
};

interface AnalyticsViewProps {
	historicalData: Record<string, HistoricalDataRow[]> | null;
	turbines: Turbine[];
}

const KpiCard = React.memo<{
	title: string;
	value: string;
	icon: React.ReactNode;
	color: string;
}>(({ title, value, icon, color }) => (
	<Card shadow="sm" padding="lg" radius="md" withBorder>
		<Group>
			<ThemeIcon size={48} radius="md" variant="light" color={color}>
				{icon}
			</ThemeIcon>
			<div>
				<Text size="sm" c="dimmed" fw={500}>
					{title}
				</Text>
				<Text size="xl" fw={700}>
					{value}
				</Text>
			</div>
		</Group>
	</Card>
));

const AvailabilityChart = React.memo<{
	data: { date: string; time: number; energy: number }[];
}>(({ data }) => {
	const width = 500;
	const height = 180; // Make chart more compact
	const padding = { top: 10, right: 0, bottom: 30, left: 35 };
	const [hoverData, setHoverData] = useState<{
		index: number;
		x: number;
		date: string;
		time: number;
		energy: number;
	} | null>(null);

	if (!data || data.length === 0) return null;

	const chartAreaWidth = width - padding.left - padding.right;
	const groupWidth = chartAreaWidth / data.length;
	const barWidth = groupWidth / 3;

	const handleMouseMove = (event: React.MouseEvent<SVGRectElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const mouseX = event.clientX - rect.left; // Mouse position in pixels, relative to the chart area rect

		// Correctly map the mouse's pixel position to the chart's internal SVG coordinate system.
		// The mouseX is relative to the chart area (the <rect> element), which has a rendered width of `rect.width`.
		// We map this to the SVG coordinate width of the chart area (`chartAreaWidth`).
		const chartAreaX = (mouseX / rect.width) * chartAreaWidth;

		// The index is the position within the chart area divided by the width of each bar group.
		const index = Math.floor(chartAreaX / groupWidth);

		if (index >= 0 && index < data.length) {
			const d = data[index];
			// The hover line's x position should be in the middle of the bar group.
			const groupCenterX = padding.left + index * groupWidth + groupWidth / 2;
			setHoverData({
				index,
				x: groupCenterX, // x is in the full SVG coordinate system
				date: d.date,
				time: d.time,
				energy: d.energy,
			});
		} else {
			setHoverData(null);
		}
	};
	const handleMouseLeave = () => {
		setHoverData(null);
	};

	return (
		<div style={{ position: "relative" }}>
			<svg
				viewBox={`0 0 ${width} ${height}`}
				style={{ width: "100%", height: "auto" }}
			>
				<title>Availability Chart</title>
				{/* Y-axis */}
				{[0, 25, 50, 75, 100].map((y) => (
					<g key={y}>
						<line
							x1={padding.left}
							y1={
								height -
								padding.bottom -
								(y / 100) * (height - padding.top - padding.bottom)
							}
							x2={width - padding.right}
							y2={
								height -
								padding.bottom -
								(y / 100) * (height - padding.top - padding.bottom)
							}
							strokeDasharray="2,2"
							style={{ stroke: "var(--border-light)" }}
						/>
						<text
							x={padding.left - 8}
							y={
								height -
								padding.bottom -
								(y / 100) * (height - padding.top - padding.bottom)
							}
							textAnchor="end"
							alignmentBaseline="middle"
							style={{ fontSize: 5, fill: "var(--text-muted)" }}
						>
							{y}%
						</text>
					</g>
				))}

				{/* Bars */}
				{data.map((d, i) => {
					const groupX = padding.left + i * groupWidth;
					const bar1X = groupX + groupWidth / 2 - barWidth - barWidth * 0.1;
					const bar2X = groupX + groupWidth / 2 + barWidth * 0.1;

					const timeY =
						height -
						padding.bottom -
						(d.time / 100) * (height - padding.top - padding.bottom);
					const energyY =
						height -
						padding.bottom -
						(d.energy / 100) * (height - padding.top - padding.bottom);

					const isHovered = hoverData?.index === i;

					// The bars under the mouse are highlighted, the rest are dimmed.
					const timeBarColor = isHovered
						? "var(--mantine-color-cyan-5)"
						: "var(--mantine-color-cyan-3)";
					const energyBarColor = isHovered
						? "var(--mantine-color-violet-6)"
						: "var(--mantine-color-violet-4)";
					const opacity = hoverData ? (isHovered ? 1 : 0.3) : 1;

					return (
						<g key={d.date} style={{ opacity, transition: "opacity 0.2s" }}>
							<rect
								x={bar1X}
								y={timeY}
								width={barWidth}
								height={Math.max(0, height - padding.bottom - timeY)}
								fill={timeBarColor}
								rx="2"
							/>
							<rect
								x={bar2X}
								y={energyY}
								width={barWidth}
								height={Math.max(0, height - padding.bottom - energyY)}
								fill={energyBarColor}
								rx="2"
							/>
						</g>
					);
				})}

				{/* X-axis */}
				{data.map((d, i) => {
					if (data.length > 15 && i % 3 !== 0) return null; // Show fewer labels if crowded
					const x = padding.left + i * groupWidth + groupWidth / 2;
					return (
						<text
							key={d.date}
							x={x}
							y={height - padding.bottom + 15}
							textAnchor="middle"
							style={{ fontSize: 5, fill: "var(--text-muted)" }}
						>
							{new Date(d.date).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								timeZone: "UTC",
							})}
						</text>
					);
				})}

				{/* Hover interactions */}
				<button
					type="button"
					style={{
						position: "absolute",
						border: 0,
						background: "transparent",
						cursor: "pointer",
						left: `${padding.left}px`,
						top: `${padding.top}px`,
						width: `${chartAreaWidth}px`,
						height: `${height - padding.top - padding.bottom}px`,
					}}
					onMouseMove={handleMouseMove}
					onMouseLeave={handleMouseLeave}
					aria-label="Chart interaction area"
				/>
				{hoverData && (
					<g pointerEvents="none">
						<line
							x1={hoverData.x}
							y1={padding.top}
							x2={hoverData.x}
							y2={height - padding.bottom}
							stroke="var(--border)"
							strokeWidth="1"
							strokeDasharray="3,3"
						/>
					</g>
				)}
			</svg>
			{hoverData && (
				<Paper
					shadow="md"
					p="xs"
					radius="sm"
					withBorder
					style={{
						position: "absolute",
						left: `${(hoverData.x / width) * 100}%`,
						top: `${padding.top}px`,
						transform: `translate(-50%, -105%)`,
						pointerEvents: "none",
						zIndex: 10,
					}}
				>
					<Text size="xs" fw={700} ta="center" mb={4}>
						{new Date(hoverData.date).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							timeZone: "UTC",
						})}
					</Text>
					<Group gap="xs" mb={2}>
						<Box w={8} h={8} bg="cyan.4" style={{ borderRadius: 2 }} />
						<Text size="xs">
							Time:{" "}
							<span style={{ fontWeight: 600 }}>
								{hoverData.time.toFixed(1)}%
							</span>
						</Text>
					</Group>
					<Group gap="xs">
						<Box w={8} h={8} bg="violet.5" style={{ borderRadius: 2 }} />
						<Text size="xs">
							Energy:{" "}
							<span style={{ fontWeight: 600 }}>
								{hoverData.energy.toFixed(1)}%
							</span>
						</Text>
					</Group>
				</Paper>
			)}
		</div>
	);
});

const TurbinePerformanceTable = React.memo<{
	data: Array<{
		id: string;
		timeAvailability: number;
		energyAvailability: number;
		totalProduction: number;
		downTime: number;
		totalEnergyProduced: number;
		totalLoss: number;
		totalNonExcusableLoss: number;
		totalExcusableLoss: number;
		totalUndefinedLoss: number;
		availabilityPercentage: string;
	}>;
	onTurbineClick: (turbineId: string) => void;
}>(({ data, onTurbineClick }) => {
	const [sortConfig, setSortConfig] = useState<{
		key: string;
		direction: "asc" | "desc";
	} | null>({ key: "energyAvailability", direction: "asc" });

	const sortedData = useMemo(() => {
		const sortableItems = [...data];
		if (sortConfig !== null) {
			sortableItems.sort((a, b) => {
				const aValue = a[sortConfig.key as keyof typeof a];
				const bValue = b[sortConfig.key as keyof typeof b];
				if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
				if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
				return 0;
			});
		}
		return sortableItems;
	}, [data, sortConfig]);

	const requestSort = (key: string) => {
		let direction: "asc" | "desc" = "asc";
		if (
			sortConfig &&
			sortConfig.key === key &&
			sortConfig.direction === "asc"
		) {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: string) => {
		if (!sortConfig || sortConfig.key !== key) {
			return (
				<IconArrowsSort size={14} style={{ marginLeft: 4, opacity: 0.5 }} />
			);
		}
		return sortConfig.direction === "asc" ? (
			<IconSortAscending size={14} style={{ marginLeft: 4 }} />
		) : (
			<IconSortDescending size={14} style={{ marginLeft: 4 }} />
		);
	};

	return (
		<Paper radius="md" withBorder shadow="sm" style={{ overflow: "hidden" }}>
			<Table.ScrollContainer minWidth={1200}>
				<Table striped highlightOnHover verticalSpacing="sm">
					<Table.Thead style={{ backgroundColor: "var(--bg-tertiary)" }}>
						<Table.Tr>
							<Table.Th>
								<UnstyledButton onClick={() => requestSort("id")}>
									<Group gap={0}>
										<Text fw={700} size="sm">
											Turbine ID
										</Text>
										{getSortIcon("id")}
									</Group>
								</UnstyledButton>
							</Table.Th>
							<Table.Th style={{ textAlign: "right" }}>
								<UnstyledButton onClick={() => requestSort("timeAvailability")}>
									<Group gap={0} justify="flex-end">
										<Text fw={700} size="sm">
											Time Availability
										</Text>
										{getSortIcon("timeAvailability")}
									</Group>
								</UnstyledButton>
							</Table.Th>
							<Table.Th style={{ textAlign: "right" }}>
								<UnstyledButton
									onClick={() => requestSort("energyAvailability")}
								>
									<Group gap={0} justify="flex-end">
										<Text fw={700} size="sm">
											Energy Availability
										</Text>
										{getSortIcon("energyAvailability")}
									</Group>
								</UnstyledButton>
							</Table.Th>
							<Table.Th style={{ textAlign: "right" }}>
								<UnstyledButton onClick={() => requestSort("totalProduction")}>
									<Group gap={0} justify="flex-end">
										<Text fw={700} size="sm">
											Total Production (MWh)
										</Text>
										{getSortIcon("totalProduction")}
									</Group>
								</UnstyledButton>
							</Table.Th>
							<Table.Th style={{ textAlign: "right" }}>
								<UnstyledButton onClick={() => requestSort("downTime")}>
									<Group gap={0} justify="flex-end">
										<Text fw={700} size="sm">
											Downtime (Hours)
										</Text>
										{getSortIcon("downTime")}
									</Group>
								</UnstyledButton>
							</Table.Th>
							<Table.Th style={{ textAlign: "right" }}>
								<UnstyledButton
									onClick={() => requestSort("totalEnergyProduced")}
								>
									<Group gap={0} justify="flex-end">
										<Text fw={700} size="sm">
											Energy Produced (kWh)
										</Text>
										{getSortIcon("totalEnergyProduced")}
									</Group>
								</UnstyledButton>
							</Table.Th>
							<Table.Th style={{ textAlign: "right" }}>
								<UnstyledButton onClick={() => requestSort("totalLoss")}>
									<Group gap={0} justify="flex-end">
										<Text fw={700} size="sm">
											Total Loss (kWh)
										</Text>
										{getSortIcon("totalLoss")}
									</Group>
								</UnstyledButton>
							</Table.Th>
							<Table.Th style={{ textAlign: "right" }}>
								<UnstyledButton
									onClick={() => requestSort("totalNonExcusableLoss")}
								>
									<Group gap={0} justify="flex-end">
										<Text fw={700} size="sm">
											Non-Excusable Loss (kWh)
										</Text>
										{getSortIcon("totalNonExcusableLoss")}
									</Group>
								</UnstyledButton>
							</Table.Th>
							<Table.Th style={{ textAlign: "right" }}>
								<UnstyledButton
									onClick={() => requestSort("totalExcusableLoss")}
								>
									<Group gap={0} justify="flex-end">
										<Text fw={700} size="sm">
											Excusable Loss (kWh)
										</Text>
										{getSortIcon("totalExcusableLoss")}
									</Group>
								</UnstyledButton>
							</Table.Th>
							<Table.Th style={{ textAlign: "right" }}>
								<UnstyledButton
									onClick={() => requestSort("totalUndefinedLoss")}
								>
									<Group gap={0} justify="flex-end">
										<Text fw={700} size="sm">
											Undefined Loss (kWh)
										</Text>
										{getSortIcon("totalUndefinedLoss")}
									</Group>
								</UnstyledButton>
							</Table.Th>
							<Table.Th style={{ textAlign: "right" }}>
								<UnstyledButton
									onClick={() => requestSort("availabilityPercentage")}
								>
									<Group gap={0} justify="flex-end">
										<Text fw={700} size="sm">
											Availability (%)
										</Text>
										{getSortIcon("availabilityPercentage")}
									</Group>
								</UnstyledButton>
							</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{sortedData.map((turbine) => (
							<Table.Tr
								key={turbine.id}
								style={{ cursor: "pointer" }}
								onClick={() => onTurbineClick(turbine.id)}
							>
								<Table.Td fw={700}>{turbine.id}</Table.Td>
								<Table.Td style={{ textAlign: "right" }}>
									{turbine.timeAvailability.toFixed(2)}%
								</Table.Td>
								<Table.Td style={{ textAlign: "right" }}>
									{turbine.energyAvailability.toFixed(2)}%
								</Table.Td>
								<Table.Td style={{ textAlign: "right" }}>
									{turbine.totalProduction.toFixed(1)}
								</Table.Td>
								<Table.Td style={{ textAlign: "right" }}>
									{turbine.downTime.toFixed(1)}
								</Table.Td>
								<Table.Td style={{ textAlign: "right" }}>
									{turbine.totalEnergyProduced.toFixed(2)}
								</Table.Td>
								<Table.Td
									style={{
										textAlign: "right",
										color: "var(--mantine-color-red-6)",
									}}
								>
									{turbine.totalLoss.toFixed(2)}
								</Table.Td>
								<Table.Td
									style={{
										textAlign: "right",
										color: "var(--mantine-color-orange-6)",
									}}
								>
									{turbine.totalNonExcusableLoss.toFixed(2)}
								</Table.Td>
								<Table.Td
									style={{
										textAlign: "right",
										color: "var(--mantine-color-yellow-6)",
									}}
								>
									{turbine.totalExcusableLoss.toFixed(2)}
								</Table.Td>
								<Table.Td
									style={{
										textAlign: "right",
										color: "var(--mantine-color-gray-6)",
									}}
								>
									{turbine.totalUndefinedLoss.toFixed(2)}
								</Table.Td>
								<Table.Td
									style={{
										textAlign: "right",
										color: "var(--mantine-color-green-6)",
									}}
								>
									{turbine.availabilityPercentage}%
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</Table.ScrollContainer>
		</Paper>
	);
});

const AnalyticsView: React.FC<AnalyticsViewProps> = ({
	historicalData,
	turbines,
}) => {
	const today = new Date();
	const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

	const [startDate, setStartDate] = useState(
		startOfMonth.toISOString().split("T")[0],
	);
	const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);

	// State for turbine availability modal
	const [selectedTurbineForAvailability, setSelectedTurbineForAvailability] =
		useState<string | null>(null);
	const [modalTurbineId, setModalTurbineId] = useState<string>("");

	// Function to handle turbine row clicks
	const handleTurbineClick = React.useCallback((turbineId: string) => {
		setModalTurbineId(turbineId);
		setSelectedTurbineForAvailability(turbineId);
	}, []);

	const dateFilteredData = useMemo(() => {
		if (!historicalData) return [];
		const start = new Date(startDate);
		const end = new Date(endDate);
		end.setHours(23, 59, 59, 999); // Include the whole end day

		// FIX: Cast the array to the defined type to enable type checking.
		const allEntries = Object.values(
			historicalData,
		).flat() as HistoricalDataRow[];
		return allEntries.filter((d) => {
			const entryDate = new Date(d.Timestamp);
			return entryDate >= start && entryDate <= end;
		});
	}, [historicalData, startDate, endDate]);

	const availabilityMetrics = useMemo(() => {
		if (dateFilteredData.length === 0)
			return { time: 0, energy: 0, production: 0 };

		let uptimeHours = 0;
		let actualProduction = 0;
		let potentialProduction = 0;

		dateFilteredData.forEach((d) => {
			const status = d.Status;
			if (
				status === TurbineStatus.Producing ||
				status === TurbineStatus.Available
			) {
				uptimeHours += 1; // Assuming hourly data points
			}

			const activePower = Number(d["ActivePower(MW)"]) || 0;
			const windSpeed = Number(d["WindSpeed(m/s)"]) || 0;
			const maxPower = Number(d["MaxPower(MW)"]) || 2.3;

			actualProduction += activePower;

			if (windSpeed >= 3.5 && windSpeed <= 25) {
				potentialProduction += maxPower;
			}
		});

		const totalHours = dateFilteredData.length;
		const timeAvailability =
			totalHours > 0 ? (uptimeHours / totalHours) * 100 : 0;
		const energyAvailability =
			potentialProduction > 0
				? (actualProduction / potentialProduction) * 100
				: 0;

		return {
			time: timeAvailability,
			energy: energyAvailability,
			production: actualProduction,
		};
	}, [dateFilteredData]);

	const dailyChartData = useMemo(() => {
		const dataByDay: Record<
			string,
			{
				uptimeHours: number;
				totalHours: number;
				actualProd: number;
				potentialProd: number;
			}
		> = {};

		dateFilteredData.forEach((d) => {
			const day = new Date(d.Timestamp).toISOString().split("T")[0];
			if (!dataByDay[day]) {
				dataByDay[day] = {
					uptimeHours: 0,
					totalHours: 0,
					actualProd: 0,
					potentialProd: 0,
				};
			}

			dataByDay[day].totalHours += 1;

			if (
				d.Status === TurbineStatus.Producing ||
				d.Status === TurbineStatus.Available
			) {
				dataByDay[day].uptimeHours += 1;
			}

			const activePower = Number(d["ActivePower(MW)"]) || 0;
			const windSpeed = Number(d["WindSpeed(m/s)"]) || 0;
			const maxPower = Number(d["MaxPower(MW)"]) || 2.3;

			dataByDay[day].actualProd += activePower;
			if (windSpeed >= 3.5 && windSpeed <= 25) {
				dataByDay[day].potentialProd += maxPower;
			}
		});

		return Object.entries(dataByDay)
			.map(([date, values]) => ({
				date,
				time:
					values.totalHours > 0
						? (values.uptimeHours / values.totalHours) * 100
						: 0,
				energy:
					values.potentialProd > 0
						? (values.actualProd / values.potentialProd) * 100
						: 0,
			}))
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	}, [dateFilteredData]);

	const turbineTableData = useMemo(() => {
		const dataByTurbine: Record<
			string,
			{
				id: string;
				uptimeHours: number;
				totalHours: number;
				actualProd: number;
				potentialProd: number;
				entries: typeof dateFilteredData;
			}
		> = {};

		turbines.forEach((t) => {
			dataByTurbine[t.id] = {
				id: t.id,
				uptimeHours: 0,
				totalHours: 0,
				actualProd: 0,
				potentialProd: 0,
				entries: [],
			};
		});

		dateFilteredData.forEach((d) => {
			const id = `T ${String(d["Turbine ID"]).padStart(3, "0")}`;
			if (!dataByTurbine[id]) return;

			dataByTurbine[id].totalHours += 1;
			dataByTurbine[id].entries.push(d);

			if (
				d.Status === TurbineStatus.Producing ||
				d.Status === TurbineStatus.Available
			) {
				dataByTurbine[id].uptimeHours += 1;
			}

			const activePower = Number(d["ActivePower(MW)"]) || 0;
			const windSpeed = Number(d["WindSpeed(m/s)"]) || 0;
			const maxPower = Number(d["MaxPower(MW)"]) || 2.3;

			dataByTurbine[id].actualProd += activePower;
			if (windSpeed >= 3.5 && windSpeed <= 25) {
				dataByTurbine[id].potentialProd += maxPower;
			}
		});

		return Object.values(dataByTurbine).map((d) => {
			// Calculate summary statistics for each turbine
			const turbineAlarmData: Array<{
				id: string;
				turbineId: string;
				timeOn: Date;
				timeOff: Date | null;
				duration: number;
				alarmName: string;
				alarmCode: number;
				nonExcusableEnergyLost: number;
				excusableEnergyLost: number;
				totalEnergyLost: number;
			}> = []; // We don't have alarm data per turbine in this context
			const turbineTimestampData = d.entries.map((entry) => ({
				timestamp: new Date(entry.Timestamp),
				averagePower: Number(entry["ActivePower(MW)"]) * 1000 || 0, // Convert MW to kW
				averageWindSpeed: Number(entry["WindSpeed(m/s)"]) || 0,
				energyProduced: (Number(entry["ActivePower(MW)"]) || 0) * 1000, // Convert MW to kW for this hour
				activeAlarms: [], // No alarm data in historical data
				nonExcusableEnergyLost: 0, // Will be calculated based on status
				excusableEnergyLost: 0, // Will be calculated based on status
				totalEnergyLost: 0,
				energyLostUndefined: 0,
			}));

			// Calculate energy losses for each entry
			turbineTimestampData.forEach((entry, index) => {
				const windSpeed = entry.averageWindSpeed;
				const activePower = Number(d.entries[index]["ActivePower(MW)"]) || 0;
				const maxPower = Number(d.entries[index]["MaxPower(MW)"]) || 2.3;
				const status = d.entries[index].Status;

				// Calculate potential energy if wind is in operational range
				if (windSpeed >= 3.5 && windSpeed <= 25) {
					const potentialPower = maxPower * 1000; // Convert to kW
					const potentialEnergy = potentialPower; // kWh for 1 hour
					const actualEnergy = activePower * 1000; // Convert to kW

					if (
						status === TurbineStatus.Offline ||
						status === TurbineStatus.Fault ||
						status === TurbineStatus.Maintenance
					) {
						// Non-excusable loss for turbine faults
						entry.nonExcusableEnergyLost = Math.max(
							0,
							potentialEnergy - actualEnergy,
						);
					} else if (status === TurbineStatus.Stopped && windSpeed >= 3.5) {
						// Some stopped states might be excusable (e.g., grid issues)
						entry.excusableEnergyLost = Math.max(
							0,
							potentialEnergy - actualEnergy,
						);
					} else if (
						actualEnergy < potentialEnergy * 0.1 &&
						status !== TurbineStatus.Producing
					) {
						// Undefined loss - sufficient wind but low production with no clear reason
						entry.energyLostUndefined = Math.max(
							0,
							potentialEnergy - actualEnergy,
						);
					}

					entry.totalEnergyLost =
						entry.nonExcusableEnergyLost + entry.excusableEnergyLost;
				}
			});

			const summaryStats = calculateSummaryStats(
				turbineAlarmData,
				turbineTimestampData,
			);

			return {
				id: d.id,
				timeAvailability:
					d.totalHours > 0 ? (d.uptimeHours / d.totalHours) * 100 : 0,
				energyAvailability:
					d.potentialProd > 0 ? (d.actualProd / d.potentialProd) * 100 : 0,
				totalProduction: d.actualProd,
				downTime: d.totalHours - d.uptimeHours,
				totalEnergyProduced: summaryStats.totalEnergyProduced,
				totalLoss: summaryStats.totalLoss,
				totalNonExcusableLoss: summaryStats.totalNonExcusableLoss,
				totalExcusableLoss: summaryStats.totalExcusableLoss,
				totalUndefinedLoss: summaryStats.totalUndefinedLoss,
				availabilityPercentage: summaryStats.availabilityPercentage,
			};
		});
	}, [dateFilteredData, turbines]);

	const handleModalClose = React.useCallback(() => {
		setSelectedTurbineForAvailability(null);
	}, []);

	return (
		<Stack gap="lg" className="animate-fade-in">
			<Title order={1}>Analytics</Title>

			<Paper p="md" radius="md" withBorder shadow="sm">
				<Group align="flex-end">
					<Text fw={600}>Date Range:</Text>
					<TextInput
						type="date"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
					/>
					<Text c="dimmed">-</Text>
					<TextInput
						type="date"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
					/>
				</Group>
			</Paper>

			<Grid gutter="md">
				<Grid.Col span={{ base: 12, md: 4 }}>
					<KpiCard
						title="Time-Based Availability"
						value={`${availabilityMetrics.time.toFixed(2)}%`}
						icon={<IconClock size={24} />}
						color="cyan"
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 4 }}>
					<KpiCard
						title="Energy-Based Availability"
						value={`${availabilityMetrics.energy.toFixed(2)}%`}
						icon={<IconBolt size={24} />}
						color="violet"
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 4 }}>
					<KpiCard
						title="Energy Lost"
						value={`${(availabilityMetrics.production / 1000).toFixed(2)} GWh`}
						icon={<IconBattery4 size={24} />}
						color="red"
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 6 }}>
					<KpiCard
						title="Total Production"
						value={`${(availabilityMetrics.production).toFixed(2)} MWh`}
						icon={<IconBuildingFactory size={24} />}
						color="green"
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 6 }}>
					<KpiCard
						title="Potential Production"
						value={`${(availabilityMetrics.production / (availabilityMetrics.energy / 100)).toFixed(2)} MWh`}
						icon={<IconWind size={24} />}
						color="blue"
					/>
				</Grid.Col>
			</Grid>

			<Paper p="lg" radius="md" withBorder shadow="sm">
				<Title order={2} size="h3" mb="md">
					Availability Trend
				</Title>
				<Group mb="md">
					<Group gap="xs">
						<Box w={12} h={12} bg="cyan.4" style={{ borderRadius: 2 }} />
						<Text size="sm" c="dimmed">
							Time-Based
						</Text>
					</Group>
					<Group gap="xs">
						<Box w={12} h={12} bg="violet.5" style={{ borderRadius: 2 }} />
						<Text size="sm" c="dimmed">
							Energy-Based
						</Text>
					</Group>
				</Group>
				{dailyChartData.length > 0 ? (
					<AvailabilityChart data={dailyChartData} />
				) : (
					<Center py="xl">
						<Text c="dimmed">No data available for the selected range.</Text>
					</Center>
				)}
			</Paper>

			<Box>
				<Title order={2} size="h3" mb="md">
					Turbine Performance
				</Title>
				<TurbinePerformanceTable
					data={turbineTableData}
					onTurbineClick={handleTurbineClick}
				/>
			</Box>

			{/* Turbine Availability Modal */}
			<TurbineAvailabilityModal
				turbineId={modalTurbineId}
				isOpen={selectedTurbineForAvailability !== null}
				onClose={handleModalClose}
			/>
		</Stack>
	);
};

export default React.memo(AnalyticsView);
