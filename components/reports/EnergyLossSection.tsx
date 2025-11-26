import { Box, Card, Title } from "@mantine/core";
import React from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { COLORS, CustomTooltip } from "./Shared";
import { ENERGY_LOSS_DATA } from "./reportsData";

const EnergyLossSection = React.memo(() => {
	return (
		<Card shadow="sm" padding="md" radius="md" withBorder>
			<Title order={6} ta="center" tt="uppercase" c="dimmed" mb="xs">
				Energy Lost in MWh
			</Title>
			<Box h={192} style={{ minHeight: 0, width: "100%" }}>
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={ENERGY_LOSS_DATA}>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="var(--border-light)"
							vertical={false}
						/>
						<XAxis
							dataKey="turbine"
							tick={{ fontSize: 9, fill: "var(--text-muted)" }}
							interval={0}
							angle={-90}
							textAnchor="end"
							height={40}
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
							dataKey="loss"
							fill={COLORS.earthBrown}
							name="Energy Loss (MWh)"
							radius={[2, 2, 0, 0]}
							isAnimationActive={false}
						/>
					</BarChart>
				</ResponsiveContainer>
			</Box>
		</Card>
	);
});

export default EnergyLossSection;
