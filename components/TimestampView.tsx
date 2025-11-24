import React from "react";
import { useMemo, useState } from "react";
import type { TimestampData } from "../availabilityTypes";
import {
	Stack,
	Group,
	TextInput,
	Select,
	NumberInput,
	Table,
	Pagination,
	UnstyledButton,
	Text,
	Paper,
} from "@mantine/core";
import {
	IconSortAscending,
	IconSortDescending,
	IconArrowsSort,
} from "@tabler/icons-react";

interface TimestampViewProps {
	data: TimestampData[];
}

const TimestampView: React.FC<TimestampViewProps> = ({ data }) => {
	const [sortConfig, setSortConfig] = useState<{
		key: keyof TimestampData;
		direction: "asc" | "desc";
	} | null>({ key: "timestamp", direction: "desc" });

	const [filter, setFilter] = useState({
		dateRange: { start: "", end: "" },
		minWindSpeed: 0,
		hasAlarms: "all", // 'all', 'yes', 'no'
	});

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 50;

	// Apply sorting and filtering
	const processedData = useMemo(() => {
		let filteredData = [...data];

		// Apply filters
		if (filter.dateRange.start && filter.dateRange.end) {
			const startDate = new Date(filter.dateRange.start);
			const endDate = new Date(filter.dateRange.end);
			filteredData = filteredData.filter(
				(item) => item.timestamp >= startDate && item.timestamp <= endDate,
			);
		}

		if (filter.minWindSpeed > 0) {
			filteredData = filteredData.filter(
				(item) => item.averageWindSpeed >= filter.minWindSpeed,
			);
		}

		if (filter.hasAlarms === "yes") {
			filteredData = filteredData.filter(
				(item) => item.activeAlarms.length > 0,
			);
		} else if (filter.hasAlarms === "no") {
			filteredData = filteredData.filter(
				(item) => item.activeAlarms.length === 0,
			);
		}

		// Apply sorting
		if (sortConfig !== null) {
			filteredData.sort((a, b) => {
				const aValue = a[sortConfig.key];
				const bValue = b[sortConfig.key];

				if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
				if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
				return 0;
			});
		}

		return filteredData;
	}, [data, filter, sortConfig]);

	// Pagination
	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return processedData.slice(startIndex, startIndex + itemsPerPage);
	}, [processedData, currentPage]);

	const totalPages = Math.ceil(processedData.length / itemsPerPage);

	const requestSort = (key: keyof TimestampData) => {
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

	const getSortIcon = (key: keyof TimestampData) => {
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

	const formatTimestamp = (date: Date) => {
		return new Date(date).toLocaleString();
	};

	return (
		<Stack gap="md">
			{/* Filters */}
			<Paper p="md" radius="md" withBorder shadow="sm">
				<Group align="flex-end">
					<TextInput
						label="Start Date"
						type="datetime-local"
						value={filter.dateRange.start}
						onChange={(e) =>
							setFilter({
								...filter,
								dateRange: { ...filter.dateRange, start: e.target.value },
							})
						}
					/>
					<TextInput
						label="End Date"
						type="datetime-local"
						value={filter.dateRange.end}
						onChange={(e) =>
							setFilter({
								...filter,
								dateRange: { ...filter.dateRange, end: e.target.value },
							})
						}
					/>
					<NumberInput
						label="Min Wind Speed (m/s)"
						min={0}
						step={0.1}
						value={filter.minWindSpeed}
						onChange={(value) =>
							setFilter({
								...filter,
								minWindSpeed: Number(value) || 0,
							})
						}
					/>
					<Select
						label="Active Alarms"
						data={[
							{ value: "all", label: "All" },
							{ value: "yes", label: "Has Alarms" },
							{ value: "no", label: "No Alarms" },
						]}
						value={filter.hasAlarms}
						onChange={(value) =>
							setFilter({
								...filter,
								hasAlarms: value || "all",
							})
						}
					/>
				</Group>
			</Paper>

			{/* Table */}
			<Paper radius="md" withBorder shadow="sm" style={{ overflow: "hidden" }}>
				<Table.ScrollContainer minWidth={1200}>
					<Table striped highlightOnHover verticalSpacing="sm">
						<Table.Thead bg="var(--mantine-color-gray-0)">
							<Table.Tr>
								<Table.Th>
									<UnstyledButton onClick={() => requestSort("timestamp")}>
										<Group gap={0}>
											<Text fw={700} size="sm">
												Timestamp
											</Text>
											{getSortIcon("timestamp")}
										</Group>
									</UnstyledButton>
								</Table.Th>
								<Table.Th style={{ textAlign: "right" }}>
									<UnstyledButton onClick={() => requestSort("averagePower")}>
										<Group gap={0} justify="flex-end">
											<Text fw={700} size="sm">
												Average Power (kW)
											</Text>
											{getSortIcon("averagePower")}
										</Group>
									</UnstyledButton>
								</Table.Th>
								<Table.Th style={{ textAlign: "right" }}>
									<UnstyledButton
										onClick={() => requestSort("averageWindSpeed")}
									>
										<Group gap={0} justify="flex-end">
											<Text fw={700} size="sm">
												Average Wind Speed (m/s)
											</Text>
											{getSortIcon("averageWindSpeed")}
										</Group>
									</UnstyledButton>
								</Table.Th>
								<Table.Th style={{ textAlign: "right" }}>
									<UnstyledButton onClick={() => requestSort("energyProduced")}>
										<Group gap={0} justify="flex-end">
											<Text fw={700} size="sm">
												Energy Produced (kWh)
											</Text>
											{getSortIcon("energyProduced")}
										</Group>
									</UnstyledButton>
								</Table.Th>
								<Table.Th>
									<Text fw={700} size="sm">
										Active Alarms
									</Text>
								</Table.Th>
								<Table.Th style={{ textAlign: "right" }}>
									<UnstyledButton
										onClick={() => requestSort("nonExcusableEnergyLost")}
									>
										<Group gap={0} justify="flex-end">
											<Text fw={700} size="sm">
												Non-Excusable Energy Lost (kWh)
											</Text>
											{getSortIcon("nonExcusableEnergyLost")}
										</Group>
									</UnstyledButton>
								</Table.Th>
								<Table.Th style={{ textAlign: "right" }}>
									<UnstyledButton
										onClick={() => requestSort("excusableEnergyLost")}
									>
										<Group gap={0} justify="flex-end">
											<Text fw={700} size="sm">
												Excusable Energy Lost (kWh)
											</Text>
											{getSortIcon("excusableEnergyLost")}
										</Group>
									</UnstyledButton>
								</Table.Th>
								<Table.Th style={{ textAlign: "right" }}>
									<UnstyledButton
										onClick={() => requestSort("totalEnergyLost")}
									>
										<Group gap={0} justify="flex-end">
											<Text fw={700} size="sm">
												Total Energy Lost (kWh)
											</Text>
											{getSortIcon("totalEnergyLost")}
										</Group>
									</UnstyledButton>
								</Table.Th>
								<Table.Th style={{ textAlign: "right" }}>
									<UnstyledButton
										onClick={() => requestSort("energyLostUndefined")}
									>
										<Group gap={0} justify="flex-end">
											<Text fw={700} size="sm">
												Energy Lost Undefined (kWh)
											</Text>
											{getSortIcon("energyLostUndefined")}
										</Group>
									</UnstyledButton>
								</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{paginatedData.map((item) => (
								<Table.Tr key={item.timestamp.toString()}>
									<Table.Td>{formatTimestamp(item.timestamp)}</Table.Td>
									<Table.Td style={{ textAlign: "right" }}>
										{item.averagePower.toFixed(2)}
									</Table.Td>
									<Table.Td style={{ textAlign: "right" }}>
										{item.averageWindSpeed.toFixed(2)}
									</Table.Td>
									<Table.Td style={{ textAlign: "right" }}>
										{item.energyProduced.toFixed(2)}
									</Table.Td>
									<Table.Td>
										{item.activeAlarms.length > 0
											? item.activeAlarms.join(", ")
											: "None"}
									</Table.Td>
									<Table.Td style={{ textAlign: "right" }}>
										{item.nonExcusableEnergyLost.toFixed(2)}
									</Table.Td>
									<Table.Td style={{ textAlign: "right" }}>
										{item.excusableEnergyLost.toFixed(2)}
									</Table.Td>
									<Table.Td style={{ textAlign: "right", fontWeight: 700 }}>
										{item.totalEnergyLost.toFixed(2)}
									</Table.Td>
									<Table.Td style={{ textAlign: "right" }}>
										{item.energyLostUndefined.toFixed(2)}
									</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</Table.ScrollContainer>
			</Paper>

			{/* Pagination */}
			{totalPages > 1 && (
				<Group justify="space-between">
					<Text size="sm" c="dimmed">
						Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
						{Math.min(currentPage * itemsPerPage, processedData.length)} of{" "}
						{processedData.length} entries
					</Text>
					<Pagination
						total={totalPages}
						value={currentPage}
						onChange={setCurrentPage}
					/>
				</Group>
			)}
		</Stack>
	);
};

export default React.memo(TimestampView);
