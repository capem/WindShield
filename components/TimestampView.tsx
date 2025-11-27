import {
	Badge,
	Box,
	Group,
	Paper,
	Progress,
	Select,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { IconAlertCircle, IconCalendar, IconWind } from "@tabler/icons-react";
import { DataTable, type DataTableSortStatus } from "mantine-datatable";
import React, { useMemo, useState } from "react";
import type { TimestampData } from "../availabilityTypes";

interface TimestampViewProps {
	data: TimestampData[];
}

const PAGE_SIZE = 50;

const TimestampView: React.FC<TimestampViewProps> = ({ data }) => {
	const [page, setPage] = useState(1);
	const [sortStatus, setSortStatus] = useState<
		DataTableSortStatus<TimestampData>
	>({
		columnAccessor: "timestamp",
		direction: "desc",
	});

	const [filter, setFilter] = useState({
		dateRange: { start: "", end: "" },
		minWindSpeed: "",
		hasAlarms: "all", // 'all', 'yes', 'no'
	});

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

		if (filter.minWindSpeed) {
			const minSpeed = Number(filter.minWindSpeed);
			if (!Number.isNaN(minSpeed)) {
				filteredData = filteredData.filter(
					(item) => item.averageWindSpeed >= minSpeed,
				);
			}
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
		const { columnAccessor, direction } = sortStatus;
		filteredData.sort((a, b) => {
			const aValue = a[columnAccessor as keyof TimestampData];
			const bValue = b[columnAccessor as keyof TimestampData];

			// Handle nulls/undefined
			if (aValue === undefined || aValue === null) return 1;
			if (bValue === undefined || bValue === null) return -1;

			if (aValue < bValue) return direction === "asc" ? -1 : 1;
			if (aValue > bValue) return direction === "asc" ? 1 : -1;
			return 0;
		});

		return filteredData;
	}, [data, filter, sortStatus]);

	// Pagination
	const paginatedData = useMemo(() => {
		const from = (page - 1) * PAGE_SIZE;
		const to = from + PAGE_SIZE;
		return processedData.slice(from, to);
	}, [processedData, page]);

	const formatTimestamp = (date: Date) => {
		return new Date(date).toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<Stack gap="md" h="100%">
			{/* Filters */}
			<Paper p="md" radius="md" withBorder shadow="sm">
				<Group align="flex-end">
					<Group gap="xs" style={{ flex: 1 }}>
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
							style={{ flex: 1 }}
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
							style={{ flex: 1 }}
						/>
					</Group>
					<TextInput
						label="Min Wind Speed (m/s)"
						placeholder="0"
						type="number"
						min={0}
						step={0.1}
						leftSection={<IconWind size={16} />}
						value={filter.minWindSpeed}
						onChange={(e) =>
							setFilter({
								...filter,
								minWindSpeed: e.target.value,
							})
						}
						w={180}
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
						w={180}
					/>
				</Group>
			</Paper>

			{/* Data Table */}
			<Paper
				radius="md"
				withBorder
				shadow="sm"
				style={{ flex: 1, display: "flex", flexDirection: "column" }}
			>
				<DataTable
					withTableBorder={false}
					borderRadius="md"
					striped
					highlightOnHover
					records={paginatedData}
					totalRecords={processedData.length}
					recordsPerPage={PAGE_SIZE}
					page={page}
					onPageChange={setPage}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
					pinFirstColumn
					idAccessor="timestamp"
					emptyState={paginatedData.length === 0 ? undefined : <Box />}
					columns={[
						{
							accessor: "timestamp",
							title: "Timestamp",
							sortable: true,
							width: 180,
							render: ({ timestamp }) => (
								<Group gap="xs" wrap="nowrap">
									<IconCalendar size={14} style={{ opacity: 0.5 }} />
									<Text size="sm" style={{ whiteSpace: "nowrap" }}>
										{formatTimestamp(timestamp)}
									</Text>
								</Group>
							),
						},
						{
							accessor: "averagePower",
							title: "Avg Power",
							sortable: true,
							textAlign: "right",
							render: ({ averagePower }) => (
								<Text size="sm">{averagePower.toFixed(2)} kW</Text>
							),
						},
						{
							accessor: "averageWindSpeed",
							title: "Wind Speed",
							sortable: true,
							textAlign: "right",
							render: ({ averageWindSpeed }) => (
								<Text size="sm">{averageWindSpeed.toFixed(2)} m/s</Text>
							),
						},
						{
							accessor: "energyProduced",
							title: "Energy Prod.",
							sortable: true,
							textAlign: "right",
							render: ({ energyProduced }) => (
								<Text size="sm" fw={500} c="cyan.6">
									{energyProduced.toFixed(2)} kWh
								</Text>
							),
						},
						{
							accessor: "activeAlarms",
							title: "Alarms",
							width: 200,
							render: ({ activeAlarms }) =>
								activeAlarms.length > 0 ? (
									<Group gap={4}>
										{activeAlarms.slice(0, 2).map((alarm) => (
											<Badge key={alarm} size="sm" color="red" variant="light">
												{alarm}
											</Badge>
										))}
										{activeAlarms.length > 2 && (
											<Badge size="sm" color="gray" variant="outline">
												+{activeAlarms.length - 2}
											</Badge>
										)}
									</Group>
								) : (
									<Text size="sm" c="dimmed">
										-
									</Text>
								),
						},
						{
							accessor: "totalEnergyLost",
							title: "Total Loss",
							sortable: true,
							textAlign: "right",
							render: ({ totalEnergyLost }) => (
								<Text
									size="sm"
									fw={700}
									c={totalEnergyLost > 0 ? "red.6" : "dimmed"}
								>
									{totalEnergyLost.toFixed(2)} kWh
								</Text>
							),
						},
					]}
					rowExpansion={{
						allowMultiple: false,
						content: ({ record }: { record: TimestampData }) => (
							<Paper
								p="md"
								bg="var(--mantine-color-body)"
								withBorder
								my="xs"
								mx="md"
							>
								<Stack gap="sm">
									<Text size="sm" fw={700} c="dimmed" tt="uppercase">
										Energy Loss Breakdown
									</Text>

									<Group grow align="flex-start">
										<Stack gap={4}>
											<Group justify="space-between">
												<Text size="xs">Non-Excusable</Text>
												<Text size="xs" fw={700}>
													{record.nonExcusableEnergyLost.toFixed(2)} kWh
												</Text>
											</Group>
											<Progress
												value={
													(record.nonExcusableEnergyLost /
														(record.totalEnergyLost || 1)) *
													100
												}
												color="red"
												size="sm"
											/>
										</Stack>
										<Stack gap={4}>
											<Group justify="space-between">
												<Text size="xs">Excusable</Text>
												<Text size="xs" fw={700}>
													{record.excusableEnergyLost.toFixed(2)} kWh
												</Text>
											</Group>
											<Progress
												value={
													(record.excusableEnergyLost /
														(record.totalEnergyLost || 1)) *
													100
												}
												color="yellow"
												size="sm"
											/>
										</Stack>
										<Stack gap={4}>
											<Group justify="space-between">
												<Text size="xs">Undefined</Text>
												<Text size="xs" fw={700}>
													{record.energyLostUndefined.toFixed(2)} kWh
												</Text>
											</Group>
											<Progress
												value={
													(record.energyLostUndefined /
														(record.totalEnergyLost || 1)) *
													100
												}
												color="gray"
												size="sm"
											/>
										</Stack>
									</Group>

									{record.activeAlarms.length > 0 && (
										<>
											<Text
												size="sm"
												fw={700}
												c="dimmed"
												tt="uppercase"
												mt="sm"
											>
												Active Alarms at this Timestamp
											</Text>
											<Group gap="xs">
												{record.activeAlarms.map((alarm) => (
													<Badge
														key={alarm}
														color="red"
														variant="filled"
														leftSection={<IconAlertCircle size={12} />}
													>
														{alarm}
													</Badge>
												))}
											</Group>
										</>
									)}
								</Stack>
							</Paper>
						),
					}}
				/>
			</Paper>
		</Stack>
	);
};

export default React.memo(TimestampView);
