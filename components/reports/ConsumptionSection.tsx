import { Badge, Box, Card, Grid, Title } from "@mantine/core";
import React from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Scatter,
	ScatterChart,
	Tooltip,
	XAxis,
	YAxis,
	ZAxis,
} from "recharts";
import {
	BOOST_DATA,
	CONSUMPTION_DATA,
	TURBINE_MAP_DATA,
} from "../../data/mockdata/reports";
import { COLORS, CustomTooltip } from "./Shared";

const ConsumptionSection = React.memo(() => {
	return (
		<Grid gutter="md">
			{/* Consumption */}
			<Grid.Col span={{ base: 12, lg: 6 }}>
				<Card shadow="sm" padding="md" radius="md" withBorder>
					<Title order={6} ta="center" tt="uppercase" c="dimmed" mb="xs">
						Energy consumed per month (MWh)
					</Title>
					<Box h={160} mb="md" style={{ minHeight: 0, width: "100%" }}>
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={CONSUMPTION_DATA}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="var(--border-light)"
									vertical={false}
								/>
								<XAxis
									dataKey="month"
									tick={{ fontSize: 9, fill: "var(--text-muted)" }}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									tick={{ fontSize: 9, fill: "var(--text-muted)" }}
									tickLine={false}
									axisLine={false}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Bar
									dataKey="value"
									fill={COLORS.skyBlue}
									name="Consumption"
									radius={[2, 2, 0, 0]}
									isAnimationActive={false}
								/>
							</BarChart>
						</ResponsiveContainer>
					</Box>

					<Title order={6} ta="center" tt="uppercase" c="dimmed" mb="xs">
						Energie consommée par turbine
					</Title>
					<Box
						h={256}
						pos="relative"
						style={{ minHeight: 0, width: "100%", overflow: "hidden" }}
					>
						<ResponsiveContainer width="100%" height="100%">
							<ScatterChart
								margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="var(--border-light)"
								/>
								<XAxis type="number" dataKey="x" name="Long" hide />
								<YAxis type="number" dataKey="y" name="Lat" hide />
								<ZAxis
									type="number"
									dataKey="z"
									range={[50, 400]}
									name="Value"
								/>
								<Tooltip cursor={{ strokeDasharray: "3 3" }} />
								<Scatter
									name="Turbines"
									data={TURBINE_MAP_DATA}
									fill="#8884d8"
									isAnimationActive={false}
								>
									{TURBINE_MAP_DATA.map((entry) => (
										<Cell
											key={entry.id}
											fill={
												entry.z > 80
													? COLORS.earthBrown
													: entry.z > 50
														? COLORS.gold
														: COLORS.skyBlue
											}
										/>
									))}
								</Scatter>
							</ScatterChart>
						</ResponsiveContainer>
						<Badge
							size="xs"
							variant="light"
							color="gray"
							pos="absolute"
							bottom={8}
							right={8}
							style={{ opacity: 0.7 }}
						>
							Map Visualization
						</Badge>
					</Box>
				</Card>
			</Grid.Col>

			{/* Boost */}
			<Grid.Col span={{ base: 12, lg: 6 }}>
				<Card shadow="sm" padding="md" radius="md" withBorder>
					<Title order={6} ta="center" tt="uppercase" c="dimmed" mb="xs">
						Boost per month (MWh)
					</Title>
					<Box h={160} mb="md" style={{ minHeight: 0, width: "100%" }}>
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={BOOST_DATA}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="var(--border-light)"
									vertical={false}
								/>
								<XAxis
									dataKey="month"
									tick={{ fontSize: 9, fill: "var(--text-muted)" }}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									tick={{ fontSize: 9, fill: "var(--text-muted)" }}
									tickLine={false}
									axisLine={false}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Bar
									dataKey="value"
									fill={COLORS.gold}
									name="Boost"
									radius={[2, 2, 0, 0]}
									isAnimationActive={false}
								/>
							</BarChart>
						</ResponsiveContainer>
					</Box>

					<Title order={6} ta="center" tt="uppercase" c="dimmed" mb="xs">
						Boost par Turbine
					</Title>
					<Box
						h={256}
						pos="relative"
						style={{ minHeight: 0, width: "100%", overflow: "hidden" }}
					>
						<ResponsiveContainer width="100%" height="100%">
							<ScatterChart
								margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="var(--border-light)"
								/>
								<XAxis type="number" dataKey="x" name="Long" hide />
								<YAxis type="number" dataKey="y" name="Lat" hide />
								<ZAxis
									type="number"
									dataKey="z"
									range={[50, 400]}
									name="Value"
								/>
								<Tooltip cursor={{ strokeDasharray: "3 3" }} />
								<Scatter
									name="Turbines"
									data={TURBINE_MAP_DATA}
									fill="#8884d8"
									isAnimationActive={false}
								>
									{TURBINE_MAP_DATA.map((entry) => (
										<Cell
											key={entry.id}
											fill={
												entry.z > 80
													? COLORS.earthBrown
													: entry.z > 50
														? COLORS.gold
														: COLORS.skyBlue
											}
										/>
									))}
								</Scatter>
							</ScatterChart>
						</ResponsiveContainer>
						<Badge
							size="xs"
							variant="light"
							color="gray"
							pos="absolute"
							bottom={8}
							right={8}
							style={{ opacity: 0.7 }}
						>
							Map Visualization
						</Badge>
					</Box>
				</Card>
			</Grid.Col>
		</Grid>
	);
});

export default ConsumptionSection;
