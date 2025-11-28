import {
	Box,
	Center,
	Grid,
	Group,
	Paper,
	rem,
	SegmentedControl,
	Select,
	SimpleGrid,
	Text,
	TextInput,
	ThemeIcon,
} from "@mantine/core";
import {
	IconAlertCircle,
	IconAlertTriangle,
	IconChartLine,
	IconCheck,
	IconInfoCircle,
	IconLayoutGrid,
	IconList,
	IconMap,
	IconPlayerPause,
	IconSearch,
	IconTool,
	IconX,
} from "@tabler/icons-react";
import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { turbineCoordinates } from "../data/mockdata/coordinates";
import { layout } from "../data/mockdata/turbines";
import { type Alarm, type Turbine, TurbineStatus } from "../types";
import DashboardSummary from "./DashboardSummary";
import MapView from "./MapView";
import TurbineGridView from "./TurbineGridView";
import TurbineList from "./TurbineList";

const TurbineStatusSummaryCard = React.memo(
	({
		counts,
		className,
	}: {
		counts: {
			producing: number;
			available: number;
			stopped: number;
			offline: number;
			maintenance: number;
			fault: number;
			warning: number;
			curtailment: number;
		};
		className?: string;
	}) => {
		const statusItems = [
			{
				name: "Producing",
				count: counts.producing,
				icon: IconCheck,
				color: "green",
			},
			{
				name: "Available",
				count: counts.available,
				icon: IconInfoCircle,
				color: "blue",
			},
			{
				name: "Stopped",
				count: counts.stopped,
				icon: IconPlayerPause,
				color: "yellow",
			},
			{
				name: "Offline",
				count: counts.offline,
				icon: IconX,
				color: "red",
			},
			{
				name: "Maintenance",
				count: counts.maintenance,
				icon: IconTool,
				color: "grape",
			},
			{
				name: "Fault",
				count: counts.fault,
				icon: IconAlertTriangle,
				color: "red",
			},
			{
				name: "Warning",
				count: counts.warning,
				icon: IconAlertCircle,
				color: "orange",
			},
			{
				name: "Curtailment",
				count: counts.curtailment,
				icon: IconChartLine,
				color: "indigo",
			},
		];

		return (
			<Paper
				shadow="sm"
				radius="md"
				p="lg"
				withBorder
				className={className}
				h="100%"
			>
				<Group justify="space-between" mb="md">
					<Text size="sm" fw={700} c="dimmed" tt="uppercase" lts={0.5}>
						Turbine Status
					</Text>
					<ThemeIcon variant="light" color="gray" size="sm" radius="xl">
						<IconInfoCircle style={{ width: rem(12), height: rem(12) }} />
					</ThemeIcon>
				</Group>

				<SimpleGrid cols={2} spacing="md" verticalSpacing="xs">
					{statusItems.map((item) => (
						<Group key={item.name} justify="space-between" wrap="nowrap">
							<Group gap={8} wrap="nowrap">
								<Box c={item.color}>
									<item.icon style={{ width: rem(16), height: rem(16) }} />
								</Box>
								<Text size="sm" fw={500} c="dimmed">
									{item.name}
								</Text>
							</Group>
							<Text size="sm" fw={700}>
								{item.count}
							</Text>
						</Group>
					))}
				</SimpleGrid>
			</Paper>
		);
	},
);

interface DashboardContentProps {
	turbines: Turbine[];
	alarms: Alarm[];
	uploadedFileName: string | null;
	onSelectTurbine: (id: string) => void;
	isCompactView: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
	turbines,
	alarms,
	uploadedFileName,
	onSelectTurbine,
	isCompactView,
}) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const viewMode = searchParams.get("view") || "grid";
	const searchQuery = searchParams.get("search") || "";
	const statusFilter =
		(searchParams.get("status") as TurbineStatus | "All") || "All";

	const setViewMode = (mode: string) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set("view", mode);
		setSearchParams(newParams);
	};

	const setSearchQuery = (query: string) => {
		const newParams = new URLSearchParams(searchParams);
		if (query) newParams.set("search", query);
		else newParams.delete("search");
		setSearchParams(newParams);
	};

	const setStatusFilter = (status: string) => {
		const newParams = new URLSearchParams(searchParams);
		if (status !== "All") newParams.set("status", status);
		else newParams.delete("status");
		setSearchParams(newParams);
	};

	const turbineStatusCounts = useMemo(() => {
		return {
			producing: turbines.filter((t) => t.status === TurbineStatus.Producing)
				.length,
			available: turbines.filter((t) => t.status === TurbineStatus.Available)
				.length,
			stopped: turbines.filter((t) => t.status === TurbineStatus.Stopped)
				.length,
			offline: turbines.filter((t) => t.status === TurbineStatus.Offline)
				.length,
			maintenance: turbines.filter(
				(t) => t.status === TurbineStatus.Maintenance,
			).length,
			fault: turbines.filter((t) => t.status === TurbineStatus.Fault).length,
			warning: turbines.filter((t) => t.status === TurbineStatus.Warning)
				.length,
			curtailment: turbines.filter(
				(t) => t.status === TurbineStatus.Curtailment,
			).length,
		};
	}, [turbines]);

	// Filter turbines
	const filteredTurbines = useMemo(
		() =>
			turbines.filter((turbine) => {
				const matchesSearch = turbine.id
					.toLowerCase()
					.includes(searchQuery.toLowerCase());
				const matchesStatus =
					statusFilter === "All" || turbine.status === statusFilter;
				return matchesSearch && matchesStatus;
			}),
		[turbines, searchQuery, statusFilter],
	);

	// State to keep track of rendered views to prevent re-rendering when switching
	const [renderedViews, setRenderedViews] = useState(new Set([viewMode]));
	React.useEffect(() => {
		setRenderedViews((prev) => new Set(prev).add(viewMode));
	}, [viewMode]);

	return (
		<>
			<Grid gutter="md">
				<Grid.Col span={{ base: 12, lg: 9 }}>
					<DashboardSummary turbines={turbines} />
				</Grid.Col>
				<Grid.Col span={{ base: 12, lg: 3 }}>
					<TurbineStatusSummaryCard counts={turbineStatusCounts} />
				</Grid.Col>
			</Grid>

			<Paper
				shadow="sm"
				radius="md"
				p="md"
				withBorder
				style={{ flex: 1, display: "flex", flexDirection: "column" }}
			>
				<Group justify="space-between" mb="md" align="center">
					<Group gap="md" style={{ flex: 1 }}>
						<TextInput
							placeholder="Search turbine..."
							leftSection={
								<IconSearch style={{ width: rem(16), height: rem(16) }} />
							}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							style={{ flex: 1, maxWidth: 300 }}
						/>
						<Select
							value={statusFilter}
							onChange={(value) => setStatusFilter(value || "All")}
							data={[
								{ value: "All", label: "All Statuses" },
								...Object.values(TurbineStatus).map((status) => ({
									value: status,
									label: status,
								})),
							]}
							allowDeselect={false}
							w={200}
						/>
					</Group>

					<Group gap="md">
						{uploadedFileName && (
							<Text size="xs" c="dimmed">
								Data source:{" "}
								<Text span c="blue" fw={600}>
									{uploadedFileName}
								</Text>
							</Text>
						)}
						<SegmentedControl
							value={viewMode}
							onChange={setViewMode}
							data={[
								{
									value: "grid",
									label: (
										<Center>
											<IconLayoutGrid
												style={{ width: rem(16), height: rem(16) }}
											/>
										</Center>
									),
								},
								{
									value: "list",
									label: (
										<Center>
											<IconList style={{ width: rem(16), height: rem(16) }} />
										</Center>
									),
								},
								{
									value: "map",
									label: (
										<Center>
											<IconMap style={{ width: rem(16), height: rem(16) }} />
										</Center>
									),
								},
							]}
						/>
					</Group>
				</Group>

				<Box style={{ flex: 1, position: "relative" }}>
					{(viewMode === "map" || renderedViews.has("map")) && (
						<Box
							style={{
								display: viewMode === "map" ? "block" : "none",
								height: "100%",
							}}
						>
							<Paper
								withBorder
								radius="md"
								style={{ height: 500, overflow: "hidden" }}
							>
								<MapView
									turbines={filteredTurbines.map((turbine) => ({
										...turbine,
										latitude: turbineCoordinates[turbine.id]?.lat,
										longitude: turbineCoordinates[turbine.id]?.lng,
									}))}
									onTurbineSelect={onSelectTurbine}
								/>
							</Paper>
						</Box>
					)}

					{(viewMode === "list" || renderedViews.has("list")) && (
						<Box style={{ display: viewMode === "list" ? "block" : "none" }}>
							<TurbineList
								turbines={filteredTurbines}
								onSelect={onSelectTurbine}
								layout={layout}
							/>
						</Box>
					)}

					{(viewMode === "grid" || renderedViews.has("grid")) && (
						<Box style={{ display: viewMode === "grid" ? "block" : "none" }}>
							<TurbineGridView
								layout={layout}
								filteredTurbines={filteredTurbines}
								alarms={alarms}
								isCompactView={isCompactView}
							/>
						</Box>
					)}
				</Box>
			</Paper>
		</>
	);
};

export default React.memo(DashboardContent);
