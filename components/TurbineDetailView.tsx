import {
	Badge,
	Box,
	Button,
	Card,
	Center,
	Grid,
	Group,
	Paper,
	rem,
	RingProgress,
	SegmentedControl,
	SimpleGrid,
	Stack,
	Table,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import {
	IconAlertTriangle,
	IconArrowLeft,
	IconArrowsShuffle,
	IconBolt,
	IconChartLine,
	IconCheck,
	IconCompass,
	IconDownload,
	IconGauge,
	IconInfoCircle,
	IconSortAscending,
	IconSortDescending,
	IconTag,
	IconTemperature,
	IconWaveSine,
	IconWind,
} from "@tabler/icons-react";
import type React from "react";
import { useMemo, useState } from "react";
import type { Alarm, Turbine } from "../types";
import { AlarmSeverity, TurbineStatus } from "../types";

interface TurbineDetailViewProps {
	turbine: Turbine;
	onBack: () => void;
	historicalData?: Array<Record<string, string>>;
	alarms: Alarm[];
	onAcknowledgeAlarm: (alarmId: string) => void;
	savedTurbineId?: string;
}

const statusConfig = {
	[TurbineStatus.Producing]: {
		text: "Producing",
		color: "green",
	},
	[TurbineStatus.Available]: {
		text: "Available",
		color: "blue",
	},
	[TurbineStatus.Offline]: {
		text: "Offline",
		color: "red",
	},
	[TurbineStatus.Stopped]: {
		text: "Stopped",
		color: "yellow",
	},
	[TurbineStatus.Maintenance]: {
		text: "Maintenance",
		color: "grape",
	},
	[TurbineStatus.Fault]: {
		text: "Fault",
		color: "red",
	},
	[TurbineStatus.Warning]: {
		text: "Warning",
		color: "orange",
	},
	[TurbineStatus.Curtailment]: {
		text: "Curtailment",
		color: "indigo",
	},
};

const PowerGauge: React.FC<{ power: number; nominalMaxPower: number }> = ({
	power,
	nominalMaxPower,
}) => {
	const powerPercentage =
		nominalMaxPower > 0 ? (power / nominalMaxPower) * 100 : 0;

	const color = power > nominalMaxPower ? "orange" : "teal";

	return (
		<Box pos="relative">
			<Center>
				<RingProgress
					size={220}
					thickness={20}
					roundCaps
					sections={[{ value: powerPercentage, color: color }]}
					label={
						<Center>
							<Stack gap={0} align="center">
								<Text fw={900} size={rem(32)} lh={1}>
									{power.toFixed(2)}
								</Text>
								<Text size="sm" c="dimmed" fw={700}>
									MW
								</Text>
							</Stack>
						</Center>
					}
				/>
			</Center>
			<Center mt="sm">
				<Group gap={6}>
					<Box
						w={8}
						h={8}
						style={{
							borderRadius: "50%",
							backgroundColor: "var(--mantine-color-teal-5)",
						}}
					/>
					<Text size="xs" fw={700} tt="uppercase" c="dimmed">
						{powerPercentage.toFixed(0)}% Capacity
					</Text>
				</Group>
			</Center>
		</Box>
	);
};

const MetricCard: React.FC<{
	title: string;
	value: string;
	icon: React.ReactNode;
	color: string;
}> = ({ title, value, icon, color }) => (
	<Card shadow="sm" padding="lg" radius="md" withBorder>
		<Group wrap="nowrap">
			<ThemeIcon size="xl" radius="md" variant="light" color={color}>
				{icon}
			</ThemeIcon>
			<div>
				<Text size="xs" tt="uppercase" fw={700} c="dimmed">
					{title}
				</Text>
				<Text size="xl" fw={700}>
					{value}
				</Text>
			</div>
		</Group>
	</Card>
);

const HistoricalChart: React.FC<{
	title: string;
	data: number[];
	unit: string;
	color: string;
	maxVal: number;
}> = ({ title, data, unit, color, maxVal }) => {
	const width = 300;
	const height = 120;
	const [hoverData, setHoverData] = useState<{
		x: number;
		y: number;
		value: number;
		index: number;
	} | null>(null);

	if (!data || data.length === 0)
		return (
			<Card shadow="sm" padding="lg" radius="md" withBorder h={200}>
				<Center h="100%">
					<Stack align="center" gap="xs">
						<ThemeIcon size="xl" radius="xl" variant="light" color="gray">
							<IconChartLine />
						</ThemeIcon>
						<Text size="sm" c="dimmed">
							No historical data available
						</Text>
					</Stack>
				</Center>
			</Card>
		);

	const maxDataVal =
		maxVal > 0 ? maxVal : Math.max(...data) > 0 ? Math.max(...data) : 1;
	const avgDataVal = data.reduce((sum, val) => sum + val, 0) / data.length;

	const getCoordinates = (val: number, i: number) => {
		const x = data.length > 1 ? (i / (data.length - 1)) * width : width / 2;
		const y = height - (val / maxDataVal) * height;
		return { x, y };
	};

	const points = data.map((val, i) => getCoordinates(val, i));

	const svgPath = (
		points: { x: number; y: number }[],
		command: (
			point: { x: number; y: number },
			i: number,
			a: { x: number; y: number }[],
		) => string,
	) => {
		return points.reduce(
			(acc, point, i, a) =>
				i === 0 ? `M ${point.x},${point.y}` : `${acc} ${command(point, i, a)}`,
			"",
		);
	};

	const bezierCommand = (
		_point: { x: number; y: number },
		i: number,
		a: { x: number; y: number }[],
	) => {
		const cps = (p: { x: number; y: number }[], i: number) => {
			const p_1 = p[i - 1];
			const p_2 = p[i - 2] || p[i - 1];
			const p1 = p[i];
			const p2 = p[i + 1] || p1;
			const smoothing = 0.2;
			const line = (
				pA: { x: number; y: number },
				pB: { x: number; y: number },
			) => {
				const lengthX = pB.x - pA.x;
				const lengthY = pB.y - pA.y;
				return {
					length: Math.sqrt(lengthX ** 2 + lengthY ** 2),
					angle: Math.atan2(lengthY, lengthX),
				};
			};
			const controlPoint = (
				current: { x: number; y: number },
				previous: { x: number; y: number },
				next: { x: number; y: number },
				reverse?: boolean,
			) => {
				const p = previous || current;
				const n = next || current;
				const o = line(p, n);
				const angle = o.angle + (reverse ? Math.PI : 0);
				const length = o.length * smoothing;
				const x = current.x + Math.cos(angle) * length;
				const y = current.y + Math.sin(angle) * length;
				return { x, y };
			};
			const cp1 = controlPoint(p_1, p_2, p1);
			const cp2 = controlPoint(p1, p_1, p2, true);
			return `C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${p1.x},${p1.y}`;
		};
		return cps(a, i);
	};

	const linePath = svgPath(points, bezierCommand);
	const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const index = Math.min(
			data.length - 1,
			Math.max(0, Math.round((x / rect.width) * (data.length - 1))),
		);
		const value = data[index];
		const point = getCoordinates(value, index);
		setHoverData({ x: point.x, y: point.y, value, index });
	};

	const handleMouseLeave = () => {
		setHoverData(null);
	};

	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder>
			<Group justify="space-between" align="flex-start" mb="md">
				<div>
					<Text size="xs" fw={700} tt="uppercase" c="dimmed">
						{title}
					</Text>
					<Group align="baseline" gap={4}>
						<Text size="xl" fw={900}>
							{data[data.length - 1].toFixed(1)}
						</Text>
						<Text size="xs" fw={700} c="dimmed">
							{unit}
						</Text>
					</Group>
				</div>
				<Group gap="xs">
					<Stack gap={0} align="flex-end">
						<Text size="xs" fw={700} c="dimmed" tt="uppercase">
							Max
						</Text>
						<Text size="sm" fw={700}>
							{maxDataVal.toFixed(0)}
						</Text>
					</Stack>
					<Stack
						gap={0}
						align="flex-end"
						className="transition-theme"
						style={{
							borderLeft: "1px solid var(--border)",
							paddingLeft: 8,
						}}
					>
						<Text size="xs" fw={700} c="dimmed" tt="uppercase">
							Avg
						</Text>
						<Text size="sm" fw={700}>
							{avgDataVal.toFixed(1)}
						</Text>
					</Stack>
				</Group>
			</Group>

			<Box h={120} w="100%" pos="relative">
				<svg
					viewBox={`0 0 ${width} ${height}`}
					style={{ width: "100%", height: "100%", overflow: "visible" }}
					preserveAspectRatio="none"
				>
					<title>{title} Chart</title>
					<defs>
						<linearGradient
							id={`gradient-${title}`}
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop offset="0%" stopColor={color} stopOpacity="0.2" />
							<stop offset="100%" stopColor={color} stopOpacity="0" />
						</linearGradient>
					</defs>
					<path d={areaPath} fill={`url(#gradient-${title})`} />
					<path
						d={linePath}
						fill="none"
						stroke={color}
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					{hoverData && (
						<g>
							<line
								x1={hoverData.x}
								y1="0"
								x2={hoverData.x}
								y2={height}
								stroke={color}
								strokeWidth="1.5"
								strokeDasharray="4 4"
								opacity="0.5"
							/>
							<circle
								cx={hoverData.x}
								cy={hoverData.y}
								r="5"
								fill="white"
								stroke={color}
								strokeWidth="3"
							/>
						</g>
					)}
				</svg>
				<button
					type="button"
					style={{
						position: "absolute",
						inset: 0,
						cursor: "crosshair",
						background: "transparent",
						border: "none",
						padding: 0,
					}}
					onMouseMove={handleMouseMove}
					onMouseLeave={handleMouseLeave}
					aria-label={`${title} chart interaction area`}
				/>
				{hoverData && (
					<Paper
						shadow="md"
						p="xs"
						radius="sm"
						withBorder
						pos="absolute"
						style={{
							left: `${(hoverData.x / width) * 100}%`,
							top: 0,
							transform: "translateX(-50%) translateY(-100%)",
							pointerEvents: "none",
							zIndex: 10,
							marginTop: -10,
						}}
					>
						<Text size="xs" c="dimmed" fw={500}>
							{24 - hoverData.index}h ago
						</Text>
						<Text fw={700}>
							{hoverData.value.toFixed(2)}{" "}
							<Text span size="xs" fw={400} c="dimmed">
								{unit}
							</Text>
						</Text>
					</Paper>
				)}
			</Box>
		</Card>
	);
};

const SWT_2_3_101_SPECS = {
	RPM_RANGE: { min: 6, max: 16 },
	WIND_SPEED_CUT_OUT: 25,
	MAX_POWER: 2.3,
};

const generateHistoricalData = (
	turbine: Turbine,
): { power: number[]; wind: number[]; rpm: number[] } => {
	const dataPoints = 24;
	const power: number[] = [];
	const wind: number[] = [];
	const rpm: number[] = [];

	if (turbine.status !== TurbineStatus.Producing) {
		return {
			power: Array(dataPoints).fill(0),
			wind: Array(dataPoints).fill(turbine.windSpeed ?? 0),
			rpm: Array(dataPoints).fill(0),
		};
	}

	for (let i = 0; i < dataPoints; i++) {
		const factor =
			Math.sin((i / dataPoints) * Math.PI * 2 - Math.PI / 2) * 0.4 + 0.6;
		const randomFluctuation = 1 + (Math.random() - 0.5) * 0.2;

		const p = Math.max(
			0,
			Math.min(
				turbine.maxPower,
				(turbine.activePower ?? 0) * factor * randomFluctuation,
			),
		);
		power.push(p);

		const w = Math.max(
			0,
			Math.min(
				SWT_2_3_101_SPECS.WIND_SPEED_CUT_OUT,
				(turbine.windSpeed ?? 0) * factor * randomFluctuation,
			),
		);
		wind.push(w);

		let r = 0;
		if (p > 0.1) {
			const powerRatio = p / turbine.maxPower;
			r =
				SWT_2_3_101_SPECS.RPM_RANGE.min +
				powerRatio *
					(SWT_2_3_101_SPECS.RPM_RANGE.max - SWT_2_3_101_SPECS.RPM_RANGE.min);
			r *= randomFluctuation;
		}
		r = Math.max(0, Math.min(SWT_2_3_101_SPECS.RPM_RANGE.max, r));
		rpm.push(r);
	}
	return { power, wind, rpm };
};

const AlarmHistory: React.FC<{
	alarms: Alarm[];
	onAcknowledge: (id: string) => void;
}> = ({ alarms, onAcknowledge }) => {
	const [sortConfig, setSortConfig] = useState<{
		key: string;
		direction: "asc" | "desc";
	} | null>(null);
	const [filter, setFilter] = useState<"all" | "active" | "critical">("all");

	const filteredAlarms = useMemo(() => {
		if (filter === "active") {
			return alarms.filter((alarm) => !alarm.timeOff);
		} else if (filter === "critical") {
			return alarms.filter(
				(alarm) => alarm.severity === AlarmSeverity.Critical,
			);
		}
		return alarms;
	}, [alarms, filter]);

	const sortedAlarms = useMemo(() => {
		const sortableAlarms = [...filteredAlarms];

		const severityOrder = {
			[AlarmSeverity.Critical]: 1,
			[AlarmSeverity.Warning]: 2,
			[AlarmSeverity.Info]: 3,
		};

		if (sortConfig !== null) {
			sortableAlarms.sort((a, b) => {
				let aVal: number | string | Date, bVal: number | string | Date;

				switch (sortConfig.key) {
					case "severity":
						aVal = severityOrder[a.severity];
						bVal = severityOrder[b.severity];
						break;
					case "description":
						aVal = a.description;
						bVal = b.description;
						break;
					case "timeOn":
						aVal = a.timeOn.getTime();
						bVal = b.timeOn.getTime();
						break;
					default:
						return 0;
				}

				if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
				if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
				return 0;
			});
		} else {
			sortableAlarms.sort((a, b) => {
				if (!a.timeOff && b.timeOff) return -1;
				if (a.timeOff && !b.timeOff) return 1;
				return b.timeOn.getTime() - a.timeOn.getTime();
			});
		}
		return sortableAlarms;
	}, [filteredAlarms, sortConfig]);

	const requestSort = (key: string) => {
		if (sortConfig && sortConfig.key === key) {
			if (sortConfig.direction === "desc") {
				setSortConfig(null);
			} else {
				setSortConfig({ key, direction: "desc" });
			}
		} else {
			setSortConfig({ key, direction: "asc" });
		}
	};

	const getSortIcon = (key: string) => {
		if (!sortConfig || sortConfig.key !== key) {
			return (
				<IconSortAscending
					style={{ width: rem(12), height: rem(12), opacity: 0.3 }}
				/>
			);
		}
		if (sortConfig.direction === "asc") {
			return <IconSortAscending style={{ width: rem(12), height: rem(12) }} />;
		}
		return <IconSortDescending style={{ width: rem(12), height: rem(12) }} />;
	};

	const severityConfig = {
		[AlarmSeverity.Critical]: {
			icon: IconAlertTriangle,
			color: "red",
		},
		[AlarmSeverity.Warning]: {
			icon: IconAlertTriangle,
			color: "yellow",
		},
		[AlarmSeverity.Info]: {
			icon: IconInfoCircle,
			color: "blue",
		},
	};

	const formatDuration = (start: Date, end: Date | null): string => {
		const endDate = end || new Date();
		const diffMs = endDate.getTime() - start.getTime();
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
		if (diffHours > 0) return `${diffHours}h ${diffMins}m`;
		return `${diffMins}m`;
	};

	const activeCount = alarms.filter((alarm) => !alarm.timeOff).length;
	const criticalCount = alarms.filter(
		(alarm) => alarm.severity === AlarmSeverity.Critical && !alarm.timeOff,
	).length;

	if (alarms.length === 0) {
		return (
			<Card shadow="sm" padding="xl" radius="md" withBorder>
				<Center>
					<Stack align="center">
						<ThemeIcon size={64} radius="xl" variant="light" color="green">
							<IconCheck style={{ width: rem(32), height: rem(32) }} />
						</ThemeIcon>
						<Text fw={500} c="dimmed">
							No alarms recorded for this turbine.
						</Text>
						<Text size="sm" c="dimmed">
							System is operating normally.
						</Text>
					</Stack>
				</Center>
			</Card>
		);
	}

	return (
		<Card shadow="sm" padding="md" radius="md" withBorder>
			<Box
				p="md"
				className="transition-theme"
				style={{ borderBottom: "1px solid var(--border)" }}
			>
				<Group justify="space-between">
					<Group gap="xl">
						<Group gap="xs">
							<Text size="sm" fw={500} c="dimmed">
								Total:
							</Text>
							<Text size="sm" fw={700}>
								{alarms.length}
							</Text>
						</Group>
						<Group gap="xs">
							<Text size="sm" fw={500} c="dimmed">
								Active:
							</Text>
							<Text size="sm" fw={700} c={activeCount > 0 ? "red" : "green"}>
								{activeCount}
							</Text>
						</Group>
						{criticalCount > 0 && (
							<Group gap="xs">
								<Text size="sm" fw={500} c="dimmed">
									Critical:
								</Text>
								<Text size="sm" fw={700} c="red">
									{criticalCount}
								</Text>
							</Group>
						)}
					</Group>
					<Group>
						<SegmentedControl
							size="xs"
							value={filter}
							onChange={(val) =>
								setFilter(val as "all" | "active" | "critical")
							}
							data={[
								{ label: "All", value: "all" },
								{ label: "Active", value: "active" },
								{ label: "Critical", value: "critical" },
							]}
						/>
						<Button
							variant="light"
							size="xs"
							leftSection={<IconDownload size={14} />}
						>
							Export
						</Button>
					</Group>
				</Group>
			</Box>

			<Table.ScrollContainer minWidth={800}>
				<Table verticalSpacing="sm" highlightOnHover>
					<Table.Thead>
						<Table.Tr>
							<Table.Th
								onClick={() => requestSort("severity")}
								style={{ cursor: "pointer" }}
							>
								<Group gap={4}>Severity {getSortIcon("severity")}</Group>
							</Table.Th>
							<Table.Th
								onClick={() => requestSort("description")}
								style={{ cursor: "pointer" }}
							>
								<Group gap={4}>Description {getSortIcon("description")}</Group>
							</Table.Th>
							<Table.Th
								onClick={() => requestSort("timeOn")}
								style={{ cursor: "pointer" }}
							>
								<Group gap={4}>Start Time {getSortIcon("timeOn")}</Group>
							</Table.Th>
							<Table.Th>Duration</Table.Th>
							<Table.Th>Status</Table.Th>
							<Table.Th style={{ textAlign: "right" }}>Action</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{sortedAlarms.map((alarm) => {
							const config = severityConfig[alarm.severity];
							const isActive = !alarm.timeOff;
							const Icon = config.icon;
							return (
								<Table.Tr
									key={alarm.id}
									bg={
										isActive
											? `var(--mantine-color-${config.color}-0)`
											: undefined
									}
								>
									<Table.Td>
										<Group gap="xs">
											<ThemeIcon color={config.color} variant="light" size="sm">
												<Icon style={{ width: rem(12), height: rem(12) }} />
											</ThemeIcon>
											<Text size="sm" fw={600}>
												{alarm.severity}
											</Text>
										</Group>
									</Table.Td>
									<Table.Td>
										<Text size="sm" fw={500}>
											{alarm.description}
										</Text>
										<Text size="xs" c="dimmed">
											Code: {alarm.code}
										</Text>
									</Table.Td>
									<Table.Td>
										<Text size="sm">{alarm.timeOn.toLocaleDateString()}</Text>
										<Text size="xs" c="dimmed">
											{alarm.timeOn.toLocaleTimeString()}
										</Text>
									</Table.Td>
									<Table.Td>
										<Text size="sm" fw={500}>
											{formatDuration(alarm.timeOn, alarm.timeOff)}
										</Text>
									</Table.Td>
									<Table.Td>
										{isActive ? (
											<Badge
												color={alarm.acknowledged ? "green" : "yellow"}
												variant="light"
												leftSection={
													!alarm.acknowledged && (
														<Box
															w={6}
															h={6}
															bg="yellow"
															style={{ borderRadius: "50%" }}
														/>
													)
												}
											>
												{alarm.acknowledged ? "Acknowledged" : "New"}
											</Badge>
										) : (
											<Badge color="gray" variant="light">
												Resolved
											</Badge>
										)}
									</Table.Td>
									<Table.Td style={{ textAlign: "right" }}>
										{isActive && !alarm.acknowledged && (
											<Button
												size="xs"
												variant="light"
												color="violet"
												onClick={() => onAcknowledge(alarm.id)}
											>
												Acknowledge
											</Button>
										)}
									</Table.Td>
								</Table.Tr>
							);
						})}
					</Table.Tbody>
				</Table>
			</Table.ScrollContainer>
		</Card>
	);
};

const TurbineDetailView: React.FC<TurbineDetailViewProps> = ({
	turbine,
	onBack,
	historicalData,
	alarms,
	onAcknowledgeAlarm,
	savedTurbineId,
}) => {
	const chartData = useMemo(() => {
		if (historicalData && historicalData.length > 0) {
			const reversedData = [...historicalData].reverse();
			return {
				power: reversedData.map((d) => parseFloat(d["ActivePower(MW)"]) || 0),
				wind: reversedData.map((d) => parseFloat(d["WindSpeed(m/s)"]) || 0),
				rpm: reversedData.map((d) => parseFloat(d.RPM) || 0),
			};
		}
		return generateHistoricalData(turbine);
	}, [turbine, historicalData]);

	const config = statusConfig[turbine.status];

	return (
		<Stack gap="lg" p="md">
			{/* Header */}
			<Box>
				<Button
					variant="subtle"
					color="gray"
					leftSection={<IconArrowLeft size={16} />}
					onClick={onBack}
					mb="md"
				>
					{savedTurbineId
						? `Back to Dashboard (from ${savedTurbineId})`
						: "Back to Dashboard"}
				</Button>

				<Paper
					radius="lg"
					p="xl"
					withBorder
					shadow="sm"
					pos="relative"
					style={{ overflow: "hidden" }}
				>
					<Box
						pos="absolute"
						top={0}
						right={0}
						w={300}
						h={300}
						className="transition-theme"
						style={{
							background:
								"radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
							transform: "translate(30%, -30%)",
							pointerEvents: "none",
						}}
					/>
					<Group justify="space-between" align="flex-start">
						<div>
							<Group mb="xs">
								<Title order={1}>Turbine {turbine.id}</Title>
								<Badge size="lg" color={config.color} variant="light">
									{config.text}
								</Badge>
							</Group>
							<Text c="dimmed" size="lg">
								Detailed operational metrics and performance data
							</Text>
						</div>
						<Badge
							size="xl"
							variant="outline"
							color="green"
							leftSection={
								<Box
									w={8}
									h={8}
									bg="green"
									style={{ borderRadius: "50%" }}
									className="animate-pulse"
								/>
							}
							pl="md"
						>
							Live Data
						</Badge>
					</Group>
				</Paper>
			</Box>

			{/* Primary Metrics */}
			<Box>
				<Group mb="md">
					<Box w={4} h={24} bg="violet" style={{ borderRadius: 4 }} />
					<Title order={3}>Primary Metrics</Title>
				</Group>

				<Grid>
					<Grid.Col span={{ base: 12, lg: 8 }}>
						<Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
							<Grid align="center" gutter="xl">
								<Grid.Col span={{ base: 12, md: 6 }}>
									<PowerGauge
										power={turbine.activePower ?? 0}
										nominalMaxPower={turbine.maxPower}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<SimpleGrid cols={2} spacing="md">
										<MetricCard
											title="Reactive Power"
											value={
												turbine.reactivePower !== null
													? `${turbine.reactivePower} MVar`
													: "—"
											}
											icon={<IconBolt />}
											color="blue"
										/>
										<MetricCard
											title="Apparent Power"
											value={
												turbine.activePower !== null &&
												turbine.reactivePower !== null
													? `${Math.sqrt(turbine.activePower ** 2 + turbine.reactivePower ** 2).toFixed(2)} MVA`
													: "—"
											}
											icon={<IconBolt />}
											color="orange"
										/>
										<MetricCard
											title="Capacity Factor"
											value={
												turbine.activePower !== null && turbine.maxPower > 0
													? `${((turbine.activePower / turbine.maxPower) * 100).toFixed(1)}%`
													: "—"
											}
											icon={<IconChartLine />}
											color="violet"
										/>
										<MetricCard
											title="Power Factor"
											value={
												turbine.activePower !== null &&
												turbine.reactivePower !== null
													? `${(turbine.activePower / Math.sqrt(turbine.activePower ** 2 + turbine.reactivePower ** 2)).toFixed(3)}`
													: "—"
											}
											icon={<IconWaveSine />}
											color="teal"
										/>
									</SimpleGrid>
								</Grid.Col>
							</Grid>
						</Card>
					</Grid.Col>
					<Grid.Col span={{ base: 12, lg: 4 }}>
						<Card
							shadow="sm"
							padding="lg"
							radius="md"
							withBorder
							h="100%"
							className="transition-theme"
							style={{
								backgroundColor: "rgba(139, 92, 246, 0.05)",
							}}
						>
							<Title order={4} mb="md">
								Performance
							</Title>
							<Stack gap="lg">
								<div>
									<Text size="sm" fw={500} c="dimmed">
										Efficiency
									</Text>
									<Text size="xl" fw={700}>
										{turbine.activePower !== null && turbine.maxPower > 0
											? `${((turbine.activePower / turbine.maxPower) * 0.1 + 0.9).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 1 })}`
											: "—"}
									</Text>
								</div>
								<div>
									<Text size="sm" fw={500} c="dimmed">
										Availability
									</Text>
									<Text size="xl" fw={700}>
										98.5%
									</Text>
								</div>
							</Stack>
						</Card>
					</Grid.Col>
				</Grid>
			</Box>

			{/* Secondary Metrics */}
			<Box>
				<Group mb="md">
					<Box w={4} h={24} bg="blue" style={{ borderRadius: 4 }} />
					<Title order={3}>Environmental & Mechanical Metrics</Title>
				</Group>

				<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
					<MetricCard
						title="Wind Speed"
						value={
							turbine.windSpeed !== null ? `${turbine.windSpeed} m/s` : "—"
						}
						icon={<IconWind />}
						color="pink"
					/>
					<MetricCard
						title="Direction"
						value={turbine.direction !== null ? `${turbine.direction}°` : "—"}
						icon={<IconCompass />}
						color="teal"
					/>
					<MetricCard
						title="Temperature"
						value={
							turbine.temperature !== null ? `${turbine.temperature}°C` : "—"
						}
						icon={<IconTemperature />}
						color="orange"
					/>
					<MetricCard
						title="Rotor Speed"
						value={turbine.rpm !== null ? `${turbine.rpm} RPM` : "—"}
						icon={<IconArrowsShuffle />}
						color="indigo"
					/>
					<MetricCard
						title="Max Power"
						value={`${turbine.maxPower} MW`}
						icon={<IconGauge />}
						color="cyan"
					/>
					<MetricCard
						title="Turbine Type"
						value="SWT-2.3-101"
						icon={<IconTag />}
						color="grape"
					/>
				</SimpleGrid>
			</Box>

			{/* Historical Performance */}
			<Box>
				<Group mb="md" justify="space-between">
					<Group>
						<Box w={4} h={24} bg="green" style={{ borderRadius: 4 }} />
						<Title order={3}>Historical Performance</Title>
					</Group>
					<SegmentedControl
						size="xs"
						data={["24h", "7d", "30d"]}
						defaultValue="24h"
					/>
				</Group>

				<SimpleGrid cols={{ base: 1, lg: 3 }} spacing="md">
					<HistoricalChart
						title="Power Output"
						data={chartData.power}
						unit="MW"
						color="var(--mantine-color-teal-6)"
						maxVal={turbine.maxPower}
					/>
					<HistoricalChart
						title="Wind Speed"
						data={chartData.wind}
						unit="m/s"
						color="var(--mantine-color-pink-6)"
						maxVal={30}
					/>
					<HistoricalChart
						title="Rotor Speed"
						data={chartData.rpm}
						unit="RPM"
						color="var(--mantine-color-indigo-6)"
						maxVal={SWT_2_3_101_SPECS.RPM_RANGE.max + 4}
					/>
				</SimpleGrid>
			</Box>

			{/* Alarm History */}
			<Box>
				<Group mb="md" justify="space-between">
					<Group>
						<Box w={4} h={24} bg="red" style={{ borderRadius: 4 }} />
						<Title order={3}>Alarm History & Status</Title>
					</Group>
				</Group>

				<AlarmHistory alarms={alarms} onAcknowledge={onAcknowledgeAlarm} />
			</Box>
		</Stack>
	);
};

export default TurbineDetailView;
