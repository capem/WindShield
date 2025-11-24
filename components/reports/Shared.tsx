import React from "react";
import { Paper, Text, Group, ColorSwatch, Stack, Box } from "@mantine/core";

// --- TAREC COLOR PALETTE ---
export const COLORS = {
	gold: "#CD9745", // Primary Gold
	skyBlue: "#008CD3", // Sky Blue
	lightCyan: "#63C3EA", // Light Cyan
	earthBrown: "#9E6C32", // Earth Brown
	mediumGrey: "#898989", // Medium Grey
	slateDark: "#0A0A0A", // Dark background
	slateLight: "#F8FAFC", // Light background
};

export interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{
		name: string;
		value: number | string;
		color?: string;
	}>;
	label?: string;
}

export const CustomTooltip = ({
	active,
	payload,
	label,
}: CustomTooltipProps) => {
	if (active && payload && payload.length) {
		return (
			<Paper
				p="xs"
				shadow="xl"
				radius="md"
				withBorder
				style={{
					backgroundColor: "rgba(255, 255, 255, 0.9)",
					backdropFilter: "blur(4px)",
				}}
			>
				<Text
					size="xs"
					fw={700}
					mb={4}
					style={{
						borderBottom: "1px solid var(--mantine-color-gray-2)",
						paddingBottom: 4,
					}}
				>
					{label}
				</Text>
				<Stack gap={2}>
					{payload.map((entry) => (
						<Group key={entry.name} gap="xs">
							<ColorSwatch color={entry.color || "gray"} size={8} />
							<Text size="xs" fw={500}>
								{entry.name}:
							</Text>
							<Text size="xs" fw={700}>
								{typeof entry.value === "number"
									? entry.value.toLocaleString()
									: entry.value}
							</Text>
						</Group>
					))}
				</Stack>
			</Paper>
		);
	}
	return null;
};
