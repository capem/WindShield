import type React from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
	Stack,
	Group,
	Switch,
	SegmentedControl,
	Paper,
	Title,
	Text,
	UnstyledButton,
	Card,
	ThemeIcon,
	Center,
	Box,
} from "@mantine/core";
import { IconSun, IconMoon, IconWindmill } from "@tabler/icons-react";

// Props for the main component
interface SettingsViewProps {
	isCompactView: boolean;
	setIsCompactView: (value: boolean) => void;
	isSidebarCollapsed: boolean;
	setIsSidebarCollapsed: (value: boolean) => void;
	isDarkMode: boolean;
	setIsDarkMode: (value: boolean) => void;
}

// Reusable Setting Row component
const SettingRow: React.FC<{
	title: string;
	description: string;
	children: React.ReactNode;
}> = ({ title, description, children }) => (
	<Group
		justify="space-between"
		align="center"
		py="md"
		style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}
	>
		<div>
			<Text fw={600} size="md">
				{title}
			</Text>
			<Text size="sm" c="dimmed">
				{description}
			</Text>
		</div>
		<div>{children}</div>
	</Group>
);

const CardSizePreview: React.FC<{
	title: string;
	isSelected: boolean;
	onClick: () => void;
	children: React.ReactNode;
}> = ({ title, isSelected, onClick, children }) => (
	<Stack align="center" gap="xs">
		<UnstyledButton
			onClick={onClick}
			style={{
				width: 160,
				height: 144,
				borderRadius: 8,
				border: `2px solid ${isSelected ? "var(--mantine-color-violet-5)" : "var(--mantine-color-gray-3)"}`,
				backgroundColor: isSelected
					? "var(--mantine-color-violet-0)"
					: "var(--mantine-color-body)",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				padding: 12,
				transition: "all 0.2s",
				transform: isSelected ? "scale(1.05)" : "scale(1)",
			}}
		>
			{children}
		</UnstyledButton>
		<Text size="sm" fw={600} c={isSelected ? "violet" : "dimmed"}>
			{title}
		</Text>
	</Stack>
);

// Main Settings View component
const SettingsView: React.FC<SettingsViewProps> = ({
	isCompactView,
	setIsCompactView,
	isSidebarCollapsed,
	setIsSidebarCollapsed,
	isDarkMode,
}) => {
	const { setDarkMode } = useTheme();

	return (
		<Stack gap="lg" maw={800} mx="auto" className="animate-fade-in">
			<Title order={1}>Settings</Title>
			<Paper p="xl" radius="md" withBorder shadow="sm">
				<Title
					order={3}
					mb="md"
					pb="xs"
					style={{ borderBottom: "2px solid var(--mantine-color-violet-2)" }}
				>
					Appearance
				</Title>

				<SettingRow
					title="Theme"
					description="Switch between light and dark visual modes."
				>
					<SegmentedControl
						value={isDarkMode ? "dark" : "light"}
						onChange={(value) => setDarkMode(value === "dark")}
						data={[
							{
								value: "light",
								label: (
									<Center>
										<IconSun size={16} style={{ marginRight: 8 }} />
										Light
									</Center>
								),
							},
							{
								value: "dark",
								label: (
									<Center>
										<IconMoon size={16} style={{ marginRight: 8 }} />
										Dark
									</Center>
								),
							},
						]}
					/>
				</SettingRow>

				<Box
					py="md"
					style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}
				>
					<Stack gap="xs" mb="md">
						<Text fw={600} size="md">
							Turbine Card Size
						</Text>
						<Text size="sm" c="dimmed">
							Choose the display size for turbine cards on the dashboard.
						</Text>
					</Stack>
					<Group justify="center" gap="xl">
						<CardSizePreview
							title="Expanded"
							isSelected={!isCompactView}
							onClick={() => setIsCompactView(false)}
						>
							<Stack gap={4} align="center" w="100%">
								<Text size="xs" fw={700}>
									T 001
								</Text>
								<ThemeIcon variant="light" color="green" size="lg" radius="xl">
									<IconWindmill size={20} />
								</ThemeIcon>
								<Text size="xs" c="dimmed" style={{ fontSize: 10 }}>
									Active Power
								</Text>
								<Text size="xs" fw={600}>
									2.1 MW
								</Text>
							</Stack>
						</CardSizePreview>
						<CardSizePreview
							title="Compact"
							isSelected={isCompactView}
							onClick={() => setIsCompactView(true)}
						>
							<Stack justify="space-between" h="100%" w="100%">
								<Text size="xs" fw={700}>
									T 001
								</Text>
								<Group gap="xs" align="center">
									<ThemeIcon
										variant="light"
										color="green"
										size="md"
										radius="xl"
									>
										<IconWindmill size={16} />
									</ThemeIcon>
									<Stack gap={2}>
										<Box>
											<Text c="dimmed" style={{ fontSize: 10, lineHeight: 1 }}>
												Power
											</Text>
											<Text size="xs" fw={600} style={{ lineHeight: 1 }}>
												2.1 MW
											</Text>
										</Box>
										<Box>
											<Text c="dimmed" style={{ fontSize: 10, lineHeight: 1 }}>
												Wind
											</Text>
											<Text size="xs" fw={600} style={{ lineHeight: 1 }}>
												12 m/s
											</Text>
										</Box>
									</Stack>
								</Group>
							</Stack>
						</CardSizePreview>
					</Group>
				</Box>

				<SettingRow
					title="Default Sidebar State"
					description="Set the sidebar to be collapsed by default."
				>
					<Switch
						checked={isSidebarCollapsed}
						onChange={(event) =>
							setIsSidebarCollapsed(event.currentTarget.checked)
						}
						size="md"
						color="violet"
					/>
				</SettingRow>
			</Paper>
		</Stack>
	);
};

export default SettingsView;
