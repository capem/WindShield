import {
	Badge,
	Box,
	Button,
	Grid,
	Group,
	Paper,
	Select,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
} from "@mantine/core";
import {
	IconAlertCircle,
	IconAlertTriangle,
	IconCalendar,
	IconClock,
	IconSearch,
	IconSettings,
} from "@tabler/icons-react";
import { DataTable, type DataTableSortStatus } from "mantine-datatable";
import React, { useMemo, useState } from "react";
import type { AvailabilityAlarm } from "../availabilityTypes";

interface AlarmViewProps {
	data: AvailabilityAlarm[];
}

const PAGE_SIZE = 15;

const AlarmView: React.FC<AlarmViewProps> = ({ data }) => {
	const [page, setPage] = useState(1);
	const [sortStatus, setSortStatus] = useState<
		DataTableSortStatus<AvailabilityAlarm>
	>({
		columnAccessor: "timeOn",
		direction: "desc",
	});

	const [filter, setFilter] = useState({
		alarmType: "all",
		dateRange: { start: "", end: "" },
		search: "",
	});

	// Apply sorting and filtering
	const processedData = useMemo(() => {
		let filteredData = [...data];

		// Apply filters
		if (filter.alarmType !== "all") {
			filteredData = filteredData.filter((alarm) =>
				filter.alarmType === "excusable"
					? alarm.excusableEnergyLost > 0
					: alarm.nonExcusableEnergyLost > 0,
			);
		}

		if (filter.dateRange.start && filter.dateRange.end) {
			const startDate = new Date(filter.dateRange.start);
			const endDate = new Date(filter.dateRange.end);
			filteredData = filteredData.filter(
				(alarm) => alarm.timeOn >= startDate && alarm.timeOn <= endDate,
			);
		}

		if (filter.search) {
			const query = filter.search.toLowerCase();
			filteredData = filteredData.filter(
				(alarm) =>
					alarm.alarmName.toLowerCase().includes(query) ||
					alarm.alarmCode.toString().includes(query),
			);
		}

		// Apply sorting
		const { columnAccessor, direction } = sortStatus;
		filteredData.sort((a, b) => {
			const aValue = a[columnAccessor as keyof AvailabilityAlarm];
			const bValue = b[columnAccessor as keyof AvailabilityAlarm];

			// Handle nulls
			if (aValue === null) return 1;
			if (bValue === null) return -1;

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

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatDuration = (hours: number) => {
		const h = Math.floor(hours);
		const m = Math.floor((hours - h) * 60);
		return `${h}h ${m}m`;
	};

	return (
		<Stack gap="md" h="100%">
			{/* Filters */}
			<Paper p="md" radius="md" withBorder shadow="sm">
				<Group align="flex-end">
					<TextInput
						label="Search"
						placeholder="Alarm name or code..."
						leftSection={<IconSearch size={16} />}
						value={filter.search}
						onChange={(e) => setFilter({ ...filter, search: e.target.value })}
						style={{ flex: 1 }}
					/>
					<Select
						label="Alarm Type"
						placeholder="Select type"
						data={[
							{ value: "all", label: "All Alarms" },
							{ value: "excusable", label: "Excusable" },
							{ value: "non-excusable", label: "Non-Excusable" },
						]}
						value={filter.alarmType}
						onChange={(value) =>
							setFilter({ ...filter, alarmType: value || "all" })
						}
						w={200}
					/>
					<Group gap="xs">
						<TextInput
							label="Start Date"
							type="date"
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
							type="date"
							value={filter.dateRange.end}
							onChange={(e) =>
								setFilter({
									...filter,
									dateRange: { ...filter.dateRange, end: e.target.value },
								})
							}
						/>
					</Group>
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
					idAccessor="id"
					emptyState={paginatedData.length === 0 ? undefined : <Box />}
					columns={[
						{
							accessor: "timeOn",
							title: "Time On",
							sortable: true,
							render: ({ timeOn }) => (
								<Group gap="xs">
									<IconCalendar size={14} style={{ opacity: 0.5 }} />
									<Text size="sm">{formatDate(timeOn)}</Text>
								</Group>
							),
						},
						{
							accessor: "timeOff",
							title: "Time Off",
							sortable: true,
							render: ({ timeOff }) => (
								<Text
									size="sm"
									c={!timeOff ? "green" : undefined}
									fw={!timeOff ? 700 : 400}
								>
									{timeOff ? formatDate(timeOff) : "Active"}
								</Text>
							),
						},
						{
							accessor: "duration",
							title: "Duration",
							sortable: true,
							render: ({ duration }) => (
								<Group gap="xs">
									<IconClock size={14} style={{ opacity: 0.5 }} />
									<Text size="sm">{formatDuration(duration)}</Text>
								</Group>
							),
						},
						{
							accessor: "alarmName",
							title: "Alarm Name",
							sortable: true,
							render: ({ alarmName }) => (
								<Text size="sm" fw={500}>
									{alarmName}
								</Text>
							),
						},
						{
							accessor: "alarmCode",
							title: "Code",
							sortable: true,
							width: 100,
						},
						{
							accessor: "totalEnergyLost",
							title: "Energy Lost",
							sortable: true,
							textAlign: "right",
							render: ({ totalEnergyLost }) => (
								<Text size="sm" fw={700}>
									{totalEnergyLost.toFixed(2)} kWh
								</Text>
							),
						},
					]}
					rowExpansion={{
						allowMultiple: false,
						content: ({ record }: { record: AvailabilityAlarm }) => (
							<Paper
								p="md"
								bg="var(--mantine-color-body)"
								withBorder
								my="xs"
								mx="md"
							>
								<Grid>
									<Grid.Col span={8}>
										<Group mb="md">
											<ThemeIcon
												size="lg"
												radius="md"
												variant="light"
												color="red"
											>
												<IconAlertTriangle size={20} />
											</ThemeIcon>
											<div>
												<Text size="lg" fw={700}>
													{record.alarmName}
												</Text>
												<Text size="xs" c="dimmed">
													Code: {record.alarmCode} • ID: {record.id}
												</Text>
											</div>
											{record.timeOff === null && (
												<Badge color="green" variant="light">
													Active Alarm
												</Badge>
											)}
										</Group>

										<Grid>
											<Grid.Col span={4}>
												<Text size="xs" c="dimmed">
													Non-Excusable Loss
												</Text>
												<Text fw={600} c="red.6">
													{record.nonExcusableEnergyLost.toFixed(2)} kWh
												</Text>
											</Grid.Col>
											<Grid.Col span={4}>
												<Text size="xs" c="dimmed">
													Excusable Loss
												</Text>
												<Text fw={600} c="yellow.6">
													{record.excusableEnergyLost.toFixed(2)} kWh
												</Text>
											</Grid.Col>
											<Grid.Col span={4}>
												<Text size="xs" c="dimmed">
													Total Loss
												</Text>
												<Text fw={700}>
													{record.totalEnergyLost.toFixed(2)} kWh
												</Text>
											</Grid.Col>
										</Grid>
									</Grid.Col>
									<Grid.Col
										span={4}
										style={{
											borderLeft:
												"1px solid var(--mantine-color-default-border)",
										}}
									>
										<Stack align="flex-start" justify="center" h="100%" pl="md">
											<Text size="sm" fw={500} mb="xs">
												Actions
											</Text>
											<Button
												variant="light"
												color="cyan"
												leftSection={<IconSettings size={16} />}
												fullWidth
											>
												Adjust Alarm
											</Button>
											<Button
												variant="subtle"
												color="gray"
												leftSection={<IconAlertCircle size={16} />}
												fullWidth
											>
												View Details
											</Button>
										</Stack>
									</Grid.Col>
								</Grid>
							</Paper>
						),
					}}
				/>
			</Paper>
		</Stack>
	);
};

export default React.memo(AlarmView);
