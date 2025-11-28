import { Box, Card, Grid, Textarea, Title } from "@mantine/core";
import React from "react";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import {
	ALARM_CATEGORY_DATA,
	ALARM_CODE_DATA,
} from "../../data/mockdata/reports";
import { COLORS, CustomTooltip } from "./Shared";

interface AlarmsSectionProps {
	analysisText: string;
	onAnalysisChange: (value: string) => void;
}

const AlarmsCharts = React.memo(() => {
	return (
		<>
			<Grid.Col span={{ base: 12, lg: 3 }}>
				<Card shadow="sm" padding="xs" radius="md" withBorder h={256}>
					<Title order={6} ta="center" tt="uppercase" c="dimmed" mb="xs">
						Duration & Freq by Category
					</Title>
					<Box flex={1} style={{ minHeight: 0, width: "100%", height: "100%" }}>
						<ResponsiveContainer width="100%" height="100%">
							<ComposedChart data={ALARM_CATEGORY_DATA}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="var(--border-light)"
									vertical={false}
								/>
								<XAxis
									dataKey="category"
									tick={{ fontSize: 9, fill: "var(--text-muted)" }}
									interval={0}
									angle={-45}
									textAnchor="end"
									height={40}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									yAxisId="left"
									tick={{ fontSize: 9, fill: "var(--text-muted)" }}
									tickLine={false}
									axisLine={false}
									label={{
										value: "Dur (h)",
										angle: -90,
										position: "insideLeft",
										fontSize: 9,
										fill: "var(--text-muted)",
									}}
								/>
								<YAxis
									yAxisId="right"
									orientation="right"
									tick={{ fontSize: 9, fill: "var(--text-muted)" }}
									tickLine={false}
									axisLine={false}
									label={{
										value: "Freq",
										angle: 90,
										position: "insideRight",
										fontSize: 9,
										fill: "var(--text-muted)",
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

			<Grid.Col span={{ base: 12, lg: 3 }}>
				<Card shadow="sm" padding="xs" radius="md" withBorder h={256}>
					<Title order={6} ta="center" tt="uppercase" c="dimmed" mb="xs">
						MTBF & MTTI by Category
					</Title>
					<Box flex={1} style={{ minHeight: 0, width: "100%", height: "100%" }}>
						<ResponsiveContainer width="100%" height="100%">
							<ComposedChart data={ALARM_CATEGORY_DATA}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="var(--border-light)"
									vertical={false}
								/>
								<XAxis
									dataKey="category"
									tick={{ fontSize: 9, fill: "var(--text-muted)" }}
									interval={0}
									angle={-45}
									textAnchor="end"
									height={40}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									yAxisId="left"
									tick={{ fontSize: 9, fill: "var(--text-muted)" }}
									tickLine={false}
									axisLine={false}
									label={{
										value: "MTBF (h)",
										angle: -90,
										position: "insideLeft",
										fontSize: 9,
										fill: "var(--text-muted)",
									}}
								/>
								<YAxis
									yAxisId="right"
									orientation="right"
									tick={{ fontSize: 9, fill: "var(--text-muted)" }}
									tickLine={false}
									axisLine={false}
									label={{
										value: "MTTI (h)",
										angle: 90,
										position: "insideRight",
										fontSize: 9,
										fill: "var(--text-muted)",
									}}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Legend
									wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }}
								/>
								<Bar
									yAxisId="left"
									dataKey="mtbf"
									barSize={12}
									fill={COLORS.lightCyan}
									name="MTBF"
									radius={[2, 2, 0, 0]}
									isAnimationActive={false}
								/>
								<Line
									yAxisId="right"
									type="monotone"
									dataKey="mtti"
									stroke={COLORS.gold}
									strokeWidth={2}
									dot={false}
									name="MTTI"
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
						Duration & Freq by Code
					</Title>
					<Box flex={1} style={{ minHeight: 0, width: "100%", height: "100%" }}>
						<ResponsiveContainer width="100%" height="100%">
							<ComposedChart data={ALARM_CODE_DATA}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="var(--border-light)"
									vertical={false}
								/>
								<XAxis
									dataKey="code"
									tick={{ fontSize: 9, fill: "var(--text-muted)" }}
									interval={0}
									angle={-45}
									textAnchor="end"
									height={40}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									yAxisId="left"
									tick={{ fontSize: 9, fill: "var(--text-muted)" }}
									tickLine={false}
									axisLine={false}
									label={{
										value: "Dur (h)",
										angle: -90,
										position: "insideLeft",
										fontSize: 9,
										fill: "var(--text-muted)",
									}}
								/>
								<YAxis
									yAxisId="right"
									orientation="right"
									tick={{ fontSize: 9, fill: "var(--text-muted)" }}
									tickLine={false}
									axisLine={false}
									label={{
										value: "Freq",
										angle: 90,
										position: "insideRight",
										fontSize: 9,
										fill: "var(--text-muted)",
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
		</>
	);
});

const AlarmsSection = React.memo(
	({ analysisText, onAnalysisChange }: AlarmsSectionProps) => {
		return (
			<Card shadow="sm" padding="md" radius="md" withBorder>
				<Grid gutter="md">
					<AlarmsCharts />

					<Grid.Col span={{ base: 12, lg: 3 }}>
						<Card
							shadow="sm"
							padding="md"
							radius="md"
							withBorder
							h={256}
							bg="var(--bg-tertiary)"
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

export default AlarmsSection;
