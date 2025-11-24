import React from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Grid, Card, Text, Textarea, Title, Box } from "@mantine/core";
import { COLORS, CustomTooltip } from "./Shared";
import { SPARES_DATA, STOPS_DATA } from "./reportsData";

interface StopsSectionProps {
	analysisText: string;
	onAnalysisChange: (value: string) => void;
}

const StopsCharts = React.memo(() => {
	return (
		<>
			<Grid.Col span={{ base: 12, lg: 4 }}>
				<Card shadow="sm" padding="xs" radius="md" withBorder h={256}>
					<Title order={6} ta="center" tt="uppercase" c="dimmed" mb="xs">
						Duration & Freq of Turbines Stopped
					</Title>
					<Box flex={1} style={{ minHeight: 0, width: "100%", height: "100%" }}>
						<ResponsiveContainer width="100%" height="100%">
							<ComposedChart data={STOPS_DATA}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#e2e8f0"
									vertical={false}
								/>
								<XAxis
									dataKey="turbine"
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
										value: "Dur (h)",
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
										value: "Freq",
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
									dataKey="duration"
									barSize={12}
									fill={COLORS.earthBrown}
									name="Duration"
									radius={[2, 2, 0, 0]}
									isAnimationActive={false}
								/>
								<Line
									yAxisId="right"
									type="monotone"
									dataKey="frequency"
									stroke={COLORS.skyBlue}
									strokeWidth={2}
									dot={false}
									name="Frequency"
									isAnimationActive={false}
								/>
							</ComposedChart>
						</ResponsiveContainer>
					</Box>
				</Card>
			</Grid.Col>

			<Grid.Col span={{ base: 12, lg: 4 }}>
				<Card shadow="sm" padding="xs" radius="md" withBorder h={256}>
					<Title order={6} ta="center" tt="uppercase" c="dimmed" mb="xs">
						Spare Parts (24-month total)
					</Title>
					<Box flex={1} style={{ minHeight: 0, width: "100%", height: "100%" }}>
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								width={500}
								height={300}
								data={SPARES_DATA}
								layout="vertical"
							>
								<CartesianGrid
									stroke="#e2e8f0"
									strokeDasharray="3 3"
									horizontal={true}
									vertical={false}
								/>
								<XAxis
									type="number"
									tick={{ fontSize: 9, fill: "#94a3b8" }}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									dataKey="part"
									type="category"
									tick={{ fontSize: 9, fill: "#94a3b8" }}
									width={80}
									tickLine={false}
									axisLine={false}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Legend
									wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }}
								/>
								<Bar
									dataKey="quantity"
									barSize={12}
									fill={COLORS.lightCyan}
									name="Quantity"
									radius={[0, 2, 2, 0]}
									isAnimationActive={false}
								/>
								<Line
									type="monotone"
									dataKey="threshold"
									stroke={COLORS.earthBrown}
									strokeWidth={2}
									name="Threshold"
									isAnimationActive={false}
								/>
							</BarChart>
						</ResponsiveContainer>
					</Box>
				</Card>
			</Grid.Col>
		</>
	);
});

const StopsSection = React.memo(
	({ analysisText, onAnalysisChange }: StopsSectionProps) => {
		return (
			<Card shadow="sm" padding="md" radius="md" withBorder>
				<Grid gutter="md">
					<StopsCharts />

					<Grid.Col span={{ base: 12, lg: 4 }}>
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

export default StopsSection;
