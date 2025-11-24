import React from "react";
import { COLORS } from "./Shared";
import { Grid, Card, Text, Textarea, Title, List, Box } from "@mantine/core";

interface MaintenanceSectionProps {
	analysisText: string;
	onAnalysisChange: (value: string) => void;
}

const MaintenanceLists = React.memo(() => {
	return (
		<>
			<Grid.Col span={{ base: 12, lg: 3 }}>
				<Box p="xs">
					<Title
						order={6}
						mb="xs"
						tt="uppercase"
						style={{
							borderBottom: `2px solid ${COLORS.gold}`,
							paddingBottom: 4,
						}}
					>
						Turbine Maintenance
					</Title>
					<Box style={{ fontSize: 11, fontFamily: "monospace" }}>
						<Box mb="xs">
							<Text size="xs" fw={700} mb={4} style={{ color: COLORS.gold }}>
								Preventive:
							</Text>
							<List size="xs" spacing={2} withPadding>
								<List.Item>Ground inspections (All)</List.Item>
								<List.Item>NDT (All Zones)</List.Item>
								<List.Item>Blade and T&H Zero (selected)</List.Item>
								<List.Item>One-Stop inspections</List.Item>
								<List.Item>HV pylon and OH line annual check</List.Item>
							</List>
						</Box>
						<Box>
							<Text size="xs" fw={700} mb={4} style={{ color: COLORS.gold }}>
								Corrective:
							</Text>
							<List size="xs" spacing={2} withPadding>
								<List.Item>Cursor 34 verification</List.Item>
								<List.Item>MTTI = 0.5 hours</List.Item>
								<List.Item>MTTR = 1.50 hours</List.Item>
							</List>
						</Box>
					</Box>
				</Box>
			</Grid.Col>

			<Grid.Col span={{ base: 12, lg: 3 }}>
				<Box
					p="xs"
					style={{ borderLeft: "1px solid var(--mantine-color-gray-2)" }}
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
						Substations Maintenance
					</Title>
					<Box style={{ fontSize: 11, fontFamily: "monospace" }}>
						<Box mb="xs">
							<Text size="xs" fw={700} mb={4} style={{ color: COLORS.gold }}>
								Preventive:
							</Text>
							<List size="xs" spacing={2} withPadding>
								<List.Item>
									Degreasing and lubrication of columns (NORTH 4.0 & 20-10)
								</List.Item>
								<List.Item>Type B maintenance (TAH)</List.Item>
								<List.Item>High Pylon test</List.Item>
								<List.Item>MTTM = 2.85 hours</List.Item>
							</List>
						</Box>
						<Box>
							<Text size="xs" fw={700} mb={4} style={{ color: COLORS.gold }}>
								Corrective:
							</Text>
							<List size="xs" spacing={2} withPadding>
								<List.Item>
									Alignment/doubling of section switches (NORTH)
								</List.Item>
								<List.Item>MTTR = 10.05 hours</List.Item>
							</List>
						</Box>
					</Box>
				</Box>
			</Grid.Col>

			<Grid.Col span={{ base: 12, lg: 3 }}>
				<Box
					p="xs"
					style={{ borderLeft: "1px solid var(--mantine-color-gray-2)" }}
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
						PPDMs Maintenance
					</Title>
					<Box style={{ fontSize: 11, fontFamily: "monospace" }}>
						<Box mb="xs">
							<Text size="xs" fw={700} mb={4} style={{ color: COLORS.gold }}>
								Preventive:
							</Text>
							<List size="xs" spacing={2} withPadding>
								<List.Item>Regulatory checks of PPDMs</List.Item>
								<List.Item>Type A, B, PPM fire inspections</List.Item>
								<List.Item>Inspection of 30kV booths (2024)</List.Item>
							</List>
						</Box>
						<Box>
							<Text size="xs" fw={700} mb={4} style={{ color: COLORS.gold }}>
								Corrective:
							</Text>
							<List size="xs" spacing={2} withPadding>
								<List.Item>Checks for buried cables (Line 1)</List.Item>
								<List.Item>No Downtime</List.Item>
							</List>
						</Box>
					</Box>
				</Box>
			</Grid.Col>
		</>
	);
});

const MaintenanceSection = React.memo(
	({ analysisText, onAnalysisChange }: MaintenanceSectionProps) => {
		return (
			<Card shadow="sm" padding="md" radius="md" withBorder>
				<Grid gutter="md">
					<MaintenanceLists />

					<Grid.Col span={{ base: 12, lg: 3 }}>
						<Box
							p="xs"
							style={{
								borderLeft: "1px solid var(--mantine-color-gray-2)",
								height: "100%",
							}}
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
								Comments
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
						</Box>
					</Grid.Col>
				</Grid>
			</Card>
		);
	},
);

export default MaintenanceSection;
