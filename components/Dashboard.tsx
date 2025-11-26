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
	Stack,
	Text,
	TextInput,
	ThemeIcon,
	Title,
} from "@mantine/core";
import {
	IconAlertCircle,
	IconAlertTriangle,
	IconBolt,
	IconChartLine,
	IconCheck,
	IconGauge,
	IconInfoCircle,
	IconLayoutGrid,
	IconList,
	IconMap,
	IconPlayerPause,
	IconSearch,
	IconTemperature,
	IconTool,
	IconWind,
	IconX,
} from "@tabler/icons-react";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { layout } from "../data/mockData";
import { turbineCoordinates } from "../data/turbineCoordinates";
import { TurbineStatus, type Alarm, type Turbine } from "../types";
import MapView from "./MapView";
import TurbineGridView from "./TurbineGridView";
import TurbineList from "./TurbineList";

const SummaryCard = React.memo(
	({
		title,
		value,
		unit,
		icon,
		color,
	}: {
		title: string;
		value: string;
		unit: string;
		icon: React.ReactNode;
		color: string;
	}) => (
		<Paper
			shadow="sm"
			radius="md"
			p="lg"
			withBorder
			className="transition-all hover:shadow-md"
		>
			<Group wrap="nowrap">
				<ThemeIcon
					size={48}
					radius="md"
					variant="light"
					color={color}
					style={{ flexShrink: 0 }}
				>
					{icon}
				</ThemeIcon>
				<Stack gap={2}>
					<Text size="xs" c="dimmed" tt="uppercase" fw={700} lts={0.5}>
						{title}
					</Text>
					<Group align="baseline" gap={4}>
						<Text size="1.5rem" fw={700} lh={1}>
							{value}
						</Text>
						<Text size="sm" c="dimmed" fw={500}>
							{unit}
						</Text>
					</Group>
				</Stack>
			</Group>
		</Paper>
	),
);

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

interface DashboardProps {
	turbines: Turbine[];
	alarms: Alarm[];
	currentTime: Date;
	uploadedFileName: string | null;
	onSelectTurbine: (id: string) => void;
	isCompactView: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
	turbines,
	alarms,
	currentTime,
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

	// --- COHERENT DATA CALCULATIONS ---
	const {
		totalActivePower,
		totalReactivePower,
		turbineStatusCounts,
		loadFactor,
		productionTodayMWh,
		averageWindSpeed,
		averageTemperature,
	} = React.useMemo(() => {
		const onlineTurbines = turbines.filter(
			(t) => t.status !== TurbineStatus.Offline,
		);
		const totalActivePower = onlineTurbines.reduce(
			(sum, t) => sum + (t.activePower || 0),
			0,
		);
		const totalReactivePower = onlineTurbines.reduce(
			(sum, t) => sum + (t.reactivePower || 0),
			0,
		);

		const turbineStatusCounts = {
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

		const totalInstalledCapacity = turbines.reduce(
			(sum, t) => sum + t.maxPower,
			0,
		);
		const loadFactor =
			totalInstalledCapacity > 0
				? (totalActivePower / totalInstalledCapacity) * 100
				: 0;

		const hoursToday = currentTime.getHours() + currentTime.getMinutes() / 60;
		const productionTodayMWh = totalActivePower * hoursToday;

		const onlineTurbinesWithWind = onlineTurbines.filter(
			(t) => t.windSpeed !== null,
		);
		const averageWindSpeed =
			onlineTurbinesWithWind.length > 0
				? onlineTurbinesWithWind.reduce(
						(sum, t) => sum + (t.windSpeed ?? 0),
						0,
					) / onlineTurbinesWithWind.length
				: 0;

		const onlineTurbinesWithTemp = onlineTurbines.filter(
			(t) => t.temperature !== null,
		);
		const averageTemperature =
			onlineTurbinesWithTemp.length > 0
				? onlineTurbinesWithTemp.reduce(
						(sum, t) => sum + (t.temperature ?? 0),
						0,
					) / onlineTurbinesWithTemp.length
				: 0;

		return {
			totalActivePower,
			totalReactivePower,
			turbineStatusCounts,
			loadFactor,
			productionTodayMWh,
			averageWindSpeed,
			averageTemperature,
		};
	}, [turbines, currentTime]);

	const summaryDataTop = React.useMemo(
		() => [
			{
				title: "Active Power",
				value: totalActivePower.toFixed(1),
				unit: "MW",
				icon: <IconBolt style={{ width: rem(24), height: rem(24) }} />,
				color: "blue",
			},
			{
				title: "Reactive Power",
				value: totalReactivePower.toFixed(1),
				unit: "MVar",
				icon: <IconBolt style={{ width: rem(24), height: rem(24) }} />,
				color: "cyan",
			},
		],
		[totalActivePower, totalReactivePower],
	);

	const summaryDataMiddle = React.useMemo(
		() => [
			{
				title: "Avg Wind Speed",
				value: averageWindSpeed.toFixed(1),
				unit: "m/s",
				icon: <IconWind style={{ width: rem(24), height: rem(24) }} />,
				color: "teal",
			},
			{
				title: "Avg Temperature",
				value: averageTemperature.toFixed(0),
				unit: "°C",
				icon: <IconTemperature style={{ width: rem(24), height: rem(24) }} />,
				color: "orange",
			},
		],
		[averageWindSpeed, averageTemperature],
	);

	const summaryDataBottom = React.useMemo(
		() => [
			{
				title: "Load Factor",
				value: loadFactor.toFixed(1),
				unit: "%",
				icon: <IconGauge style={{ width: rem(24), height: rem(24) }} />,
				color: "violet",
			},
			{
				title: "Production",
				value: productionTodayMWh.toFixed(1),
				unit: "MWh",
				icon: <IconChartLine style={{ width: rem(24), height: rem(24) }} />,
				color: "green",
			},
		],
		[loadFactor, productionTodayMWh],
	);

	const weekday = currentTime.toLocaleDateString("en-US", {
		weekday: "long",
	});
	const day = currentTime.getDate();
	const month = currentTime.toLocaleDateString("en-US", { month: "long" });
	const year = currentTime.getFullYear();
	const formattedDate = `${weekday} ${day} ${month} ${year}`;
	const formattedTime = currentTime.toLocaleTimeString("fr-FR");

	// Filter turbines
	const filteredTurbines = React.useMemo(
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
	const [renderedViews, setRenderedViews] = React.useState(new Set([viewMode]));
	React.useEffect(() => {
		setRenderedViews((prev) => new Set(prev).add(viewMode));
	}, [viewMode]);

	return (
		<Stack h="100%" gap="lg">
			<Group justify="space-between" align="center">
				<Title order={2} fw={800} c="dimmed">
					Dashboard
				</Title>
				<Text size="sm" c="dimmed" fw={500}>
					{formattedDate} • {formattedTime}
				</Text>
			</Group>

			<Grid gutter="md">
				<Grid.Col span={{ base: 12, lg: 9 }}>
					<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
						{summaryDataTop.map((data) => (
							<SummaryCard key={data.title} {...data} />
						))}
						{summaryDataMiddle.map((data) => (
							<SummaryCard key={data.title} {...data} />
						))}
						{summaryDataBottom.map((data) => (
							<SummaryCard key={data.title} {...data} />
						))}
					</SimpleGrid>
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
		</Stack>
	);
};

export default React.memo(Dashboard);
