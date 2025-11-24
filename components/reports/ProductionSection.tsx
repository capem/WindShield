import React from "react";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Grid, Card, Text, Textarea, Title, Box } from "@mantine/core";
import { COLORS, CustomTooltip } from "./Shared";
import {
	LOCAL_FACTOR_DATA,
	PRODUCTION_DATA,
	WIND_ROSE_DATA,
} from "./reportsData";

interface ProductionSectionProps {
	analysisText: string;
	onAnalysisChange: (value: string) => void;
}

const ProductionCharts = React.memo(() => {
	return (
		<>
			<Grid.Col span={{ base: 12, lg: 3 }}>
				<Card shadow="sm" padding="xs" radius="md" withBorder h={256}>
					<Title order={6} ta="center" tt="uppercase" c="dimmed" mb="xs">
						Production (GWh)
					</Title>
					<Box flex={1} style={{ minHeight: 0, width: "100%", height: "100%" }}>
						<ResponsiveContainer width="100%" height="100%">
							<ComposedChart data={PRODUCTION_DATA}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#e2e8f0"
									vertical={false}
								/>
								<XAxis
									dataKey="month"
									tick={{ fontSize: 9, fill: "#94a3b8" }}
									interval={0}
									angle={-45}
									textAnchor="end"
									height={40}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									yAxisId="left"
									tick={{ fontSize: 9, fill: "#94a3b8" }}
									tickLine={false}
									axisLine={false}
									label={{
										value: "Prod (GWh)",
										angle: -90,
										position: "insideLeft",
										fontSize: 9,
										fill: "#94a3b8",
									}}
								/>
								<YAxis
									yAxisId="right"
									orientation="right"
									tick={{ fontSize: 9, fill: "#94a3b8" }}
									tickLine={false}
									axisLine={false}
									label={{
										value: "Cumul (GWh)",
										angle: 90,
										position: "insideRight",
										fontSize: 9,
										fill: "#94a3b8",
									}}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Legend
									wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }}
								/>
								<Bar
									yAxisId="left"
									dataKey="production"
									barSize={12}
									fill={COLORS.skyBlue}
									name="Production"
									radius={[2, 2, 0, 0]}
									isAnimationActive={false}
								/>
								<Line
									yAxisId="right"
									type="monotone"
									dataKey="cumulative"
									stroke={COLORS.gold}
									strokeWidth={2}
									dot={false}
									name="Cumulative"
									isAnimationActive={false}
								/>
							</ComposedChart>
						</ResponsiveContainer>
					</Box>
				</Card>
			</Grid.Col>

			<Grid.Col span={{ base: 12, lg: 3 }}>
				<Card shadow="sm" padding="xs" radius="md" withBorder h={256}>
					<Title order={6} ta="center" tt="uppercase" c="dimmed" mb="xs">
						Local Factor
					</Title>
					<Box flex={1} style={{ minHeight: 0, width: "100%", height: "100%" }}>
						<ResponsiveContainer width="100%" height="100%">
							<ComposedChart data={LOCAL_FACTOR_DATA}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#e2e8f0"
									vertical={false}
								/>
								<XAxis
									dataKey="month"
									tick={{ fontSize: 9, fill: "#94a3b8" }}
									interval={0}
									angle={-45}
									textAnchor="end"
									height={40}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									tick={{ fontSize: 9, fill: "#94a3b8" }}
									domain={[90, 100]}
									tickLine={false}
									axisLine={false}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Legend
									wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }}
								/>
								<Bar
									dataKey="localFactor"
									barSize={12}
									fill={COLORS.lightCyan}
									name="Local Factor"
									radius={[2, 2, 0, 0]}
									isAnimationActive={false}
								/>
								<Line
									type="monotone"
									dataKey="budget"
									stroke={COLORS.earthBrown}
									strokeWidth={2}
									dot={false}
									name="Budget"
									isAnimationActive={false}
								/>
							</ComposedChart>
						</ResponsiveContainer>
					</Box>
				</Card>
			</Grid.Col>

			<Grid.Col span={{ base: 12, lg: 3 }}>
				<Card shadow="sm" padding="xs" radius="md" withBorder h={256}>
					<Title order={6} ta="center" tt="uppercase" c="dimmed" mb="xs">
						Wind Rose
					</Title>
					<Box flex={1} style={{ minHeight: 0, width: "100%", height: "100%" }}>
						<ResponsiveContainer width="100%" height="100%">
							<RadarChart
								cx="50%"
								cy="50%"
								outerRadius="70%"
								data={WIND_ROSE_DATA}
							>
								<PolarGrid stroke="#e2e8f0" />
								<PolarAngleAxis
									dataKey="subject"
									tick={{ fontSize: 9, fill: "#94a3b8" }}
								/>
								<PolarRadiusAxis
									angle={30}
									domain={[0, 150]}
									tick={{ fontSize: 9, fill: "#94a3b8" }}
									axisLine={false}
								/>
								<Radar
									name="Wind"
									dataKey="A"
									stroke={COLORS.skyBlue}
									fill={COLORS.skyBlue}
									fillOpacity={0.5}
									isAnimationActive={false}
								/>
								<Tooltip content={<CustomTooltip />} />
							</RadarChart>
						</ResponsiveContainer>
					</Box>
				</Card>
			</Grid.Col>
		</>
	);
});

const ProductionSection = React.memo(
	({ analysisText, onAnalysisChange }: ProductionSectionProps) => {
		return (
			<Card shadow="sm" padding="md" radius="md" withBorder>
				<Grid gutter="md">
					<ProductionCharts />

					<Grid.Col span={{ base: 12, lg: 3 }}>
						<Card
							shadow="sm"
							padding="md"
							radius="md"
							withBorder
							h={256}
							bg="var(--mantine-color-gray-0)"
						>
							<Title
								order={6}
								mb="xs"
								tt="uppercase"
								style={{
									borderBottom: `2px solid ${COLORS.gold}`,
									paddingBottom: 4,
								}}
							>
								Analysis
							</Title>
							<Textarea
								variant="unstyled"
								size="xs"
								styles={{
									input: {
										fontSize: 11,
										fontFamily: "monospace",
										lineHeight: 1.5,
										padding: 0,
									},
								}}
								value={analysisText}
								onChange={(e) => onAnalysisChange(e.target.value)}
								autosize
								minRows={10}
							/>
						</Card>
					</Grid.Col>
				</Grid>
			</Card>
		);
	},
);

export default ProductionSection;
