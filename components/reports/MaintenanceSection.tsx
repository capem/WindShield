import React from "react";
import { COLORS } from "./Shared";
import { Grid, Card, Text, Textarea, Title, List, Box } from "@mantine/core";

interface MaintenanceSectionProps {
	analysisText: string;
	onAnalysisChange: (value: string) => void;
}

import { MAINTENANCE_DATA } from "../../data/mockdata/reports";

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
								{MAINTENANCE_DATA.turbine.preventive.map((item) => (
									<List.Item key={item}>{item}</List.Item>
								))}
							</List>
						</Box>
						<Box>
							<Text size="xs" fw={700} mb={4} style={{ color: COLORS.gold }}>
								Corrective:
							</Text>
							<List size="xs" spacing={2} withPadding>
								{MAINTENANCE_DATA.turbine.corrective.map((item) => (
									<List.Item key={item}>{item}</List.Item>
								))}
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
								{MAINTENANCE_DATA.substations.preventive.map((item) => (
									<List.Item key={item}>{item}</List.Item>
								))}
							</List>
						</Box>
						<Box>
							<Text size="xs" fw={700} mb={4} style={{ color: COLORS.gold }}>
								Corrective:
							</Text>
							<List size="xs" spacing={2} withPadding>
								{MAINTENANCE_DATA.substations.corrective.map((item) => (
									<List.Item key={item}>{item}</List.Item>
								))}
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
								{MAINTENANCE_DATA.ppdms.preventive.map((item) => (
									<List.Item key={item}>{item}</List.Item>
								))}
							</List>
						</Box>
						<Box>
							<Text size="xs" fw={700} mb={4} style={{ color: COLORS.gold }}>
								Corrective:
							</Text>
							<List size="xs" spacing={2} withPadding>
								{MAINTENANCE_DATA.ppdms.corrective.map((item) => (
									<List.Item key={item}>{item}</List.Item>
								))}
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
