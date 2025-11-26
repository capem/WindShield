import {
	Group,
	Paper,
	Select,
	Stack,
	Table,
	Text,
	TextInput,
	UnstyledButton,
} from "@mantine/core";
import {
	IconArrowsSort,
	IconSortAscending,
	IconSortDescending,
} from "@tabler/icons-react";
import React, { useMemo, useState } from "react";
import type { AvailabilityAlarm } from "../availabilityTypes";

interface AlarmViewProps {
	data: AvailabilityAlarm[];
}

const AlarmView: React.FC<AlarmViewProps> = ({ data }) => {
	const [sortConfig, setSortConfig] = useState<{
		key: keyof AvailabilityAlarm;
		direction: "asc" | "desc";
	} | null>({ key: "timeOn", direction: "desc" });

	const [filter, setFilter] = useState({
		alarmType: "all",
		dateRange: { start: "", end: "" },
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

	const requestSort = (key: keyof AvailabilityAlarm) => {
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

	const getSortIcon = (key: keyof AvailabilityAlarm) => {
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

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleString();
	};

	const formatDuration = (hours: number) => {
		const h = Math.floor(hours);
		const m = Math.floor((hours - h) * 60);
		return `${h}h ${m}m`;
	};

	return (
		<Stack gap="md">
			{/* Filters */}
			<Paper p="md" radius="md" withBorder shadow="sm">
				<Group align="flex-end">
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
					/>
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
			</Paper>

			{/* Table */}
			<Paper radius="md" withBorder shadow="sm" style={{ overflow: "hidden" }}>
				<Table.ScrollContainer minWidth={1000}>
					<Table striped highlightOnHover verticalSpacing="sm">
						<Table.Thead style={{ backgroundColor: "var(--bg-tertiary)" }}>
							<Table.Tr>
								<Table.Th>
									<UnstyledButton onClick={() => requestSort("timeOn")}>
										<Group gap={0}>
											<Text fw={700} size="sm">
												Time On
											</Text>
											{getSortIcon("timeOn")}
										</Group>
									</UnstyledButton>
								</Table.Th>
								<Table.Th>
									<UnstyledButton onClick={() => requestSort("timeOff")}>
										<Group gap={0}>
											<Text fw={700} size="sm">
												Time Off
											</Text>
											{getSortIcon("timeOff")}
										</Group>
									</UnstyledButton>
								</Table.Th>
								<Table.Th>
									<UnstyledButton onClick={() => requestSort("duration")}>
										<Group gap={0}>
											<Text fw={700} size="sm">
												Duration
											</Text>
											{getSortIcon("duration")}
										</Group>
									</UnstyledButton>
								</Table.Th>
								<Table.Th>
									<UnstyledButton onClick={() => requestSort("alarmName")}>
										<Group gap={0}>
											<Text fw={700} size="sm">
												Alarm Name
											</Text>
											{getSortIcon("alarmName")}
										</Group>
									</UnstyledButton>
								</Table.Th>
								<Table.Th>
									<UnstyledButton onClick={() => requestSort("alarmCode")}>
										<Group gap={0}>
											<Text fw={700} size="sm">
												Alarm Code
											</Text>
											{getSortIcon("alarmCode")}
										</Group>
									</UnstyledButton>
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
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{processedData.map((alarm) => (
								<Table.Tr key={alarm.id}>
									<Table.Td>{formatDate(alarm.timeOn)}</Table.Td>
									<Table.Td>
										{alarm.timeOff ? formatDate(alarm.timeOff) : "Active"}
									</Table.Td>
									<Table.Td>{formatDuration(alarm.duration)}</Table.Td>
									<Table.Td>
										<Text fw={500}>{alarm.alarmName}</Text>
									</Table.Td>
									<Table.Td>{alarm.alarmCode}</Table.Td>
									<Table.Td style={{ textAlign: "right" }}>
										{alarm.nonExcusableEnergyLost.toFixed(2)}
									</Table.Td>
									<Table.Td style={{ textAlign: "right" }}>
										{alarm.excusableEnergyLost.toFixed(2)}
									</Table.Td>
									<Table.Td style={{ textAlign: "right", fontWeight: 700 }}>
										{alarm.totalEnergyLost.toFixed(2)}
									</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</Table.ScrollContainer>
			</Paper>
		</Stack>
	);
};

export default React.memo(AlarmView);
