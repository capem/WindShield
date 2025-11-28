import {
	Group,
	Paper,
	rem,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
} from "@mantine/core";
import {
	IconBolt,
	IconChartLine,
	IconGauge,
	IconTemperature,
	IconWind,
} from "@tabler/icons-react";
import React, { useEffect, useMemo, useState } from "react";
import { type Turbine, TurbineStatus } from "../types";

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

interface DashboardSummaryProps {
	turbines: Turbine[];
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ turbines }) => {
	// Internal timer for production calculation
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	const {
		totalActivePower,
		totalReactivePower,
		loadFactor,
		productionTodayMWh,
		averageWindSpeed,
		averageTemperature,
	} = useMemo(() => {
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
			loadFactor,
			productionTodayMWh,
			averageWindSpeed,
			averageTemperature,
		};
	}, [turbines, currentTime]);

	const summaryDataTop = useMemo(
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

	const summaryDataMiddle = useMemo(
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

	const summaryDataBottom = useMemo(
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

	return (
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
	);
};

export default React.memo(DashboardSummary);
