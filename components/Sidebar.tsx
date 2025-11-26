import {
	ActionIcon,
	Box,
	Divider,
	Group,
	NavLink,
	ScrollArea,
	Stack,
	Text,
	ThemeIcon,
	Tooltip,
	UnstyledButton,
	rem,
} from "@mantine/core";
import {
	IconBook,
	IconChartPie,
	IconChevronLeft,
	IconChevronRight,
	IconFileDescription,
	IconLayoutDashboard,
	IconMoon,
	IconSettings,
	IconSun,
	IconWind,
} from "@tabler/icons-react";
import type React from "react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

interface SidebarProps {
	isCollapsed: boolean;
	onToggle: () => void;
}

const menuSections = [
	{
		title: "Overview",
		items: [{ path: "/", icon: IconLayoutDashboard, label: "Dashboard" }],
	},
	{
		title: "Analysis",
		items: [
			{ path: "/analytics", icon: IconChartPie, label: "Analytics" },
			{ path: "/reports", icon: IconFileDescription, label: "Reports" },
		],
	},
	{
		title: "System",
		items: [{ path: "/settings", icon: IconSettings, label: "Settings" }],
	},
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
	const location = useLocation();
	const { isDarkMode, toggleDarkMode } = useTheme();

	return (
		<Stack
			h="100%"
			justify="space-between"
			gap={0}
			style={{
				backgroundColor: "var(--sidebar-bg)",
				borderRight: "1px solid var(--border)",
				transition: "width 0.3s ease",
			}}
		>
			{/* Logo Section */}
			<Box p="md" pb="xl">
				<Group wrap="nowrap" justify={isCollapsed ? "center" : "flex-start"}>
					<ThemeIcon
						variant="gradient"
						gradient={{ from: "indigo", to: "cyan" }}
						size={32}
						radius="md"
					>
						<IconWind style={{ width: rem(18), height: rem(18) }} />
					</ThemeIcon>
					{!isCollapsed && (
						<Text fw={700} size="lg" style={{ letterSpacing: -0.5 }}>
							WindGrid
						</Text>
					)}
				</Group>
			</Box>

			{/* Navigation Section */}
			<ScrollArea style={{ flex: 1 }} px="xs">
				<Stack gap="xl">
					{menuSections.map((section) => (
						<Box key={section.title}>
							{!isCollapsed && (
								<Text
									size="xs"
									fw={700}
									c="dimmed"
									tt="uppercase"
									mb="xs"
									pl="xs"
								>
									{section.title}
								</Text>
							)}
							<Stack gap={2} align={isCollapsed ? "center" : "stretch"}>
								{section.items.map((item) => {
									const isActive = location.pathname === item.path;

									if (isCollapsed) {
										return (
											<Tooltip
												key={item.path}
												label={item.label}
												position="right"
												withArrow
											>
												<UnstyledButton
													component={RouterNavLink}
													to={item.path}
													style={{
														width: "100%",
														height: rem(44),
														borderRadius: "var(--mantine-radius-md)",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														backgroundColor: isActive
															? "var(--sidebar-active-bg)"
															: "transparent",
														color: isActive
															? "var(--sidebar-active-text)"
															: "var(--text-secondary)",
														transition: "all 0.2s ease",
													}}
												>
													<item.icon
														style={{ width: rem(22), height: rem(22) }}
														stroke={1.5}
													/>
												</UnstyledButton>
											</Tooltip>
										);
									}

									return (
										<Tooltip
											key={item.path}
											label={item.label}
											position="right"
											withArrow
											disabled={!isCollapsed}
										>
											<NavLink
												component={RouterNavLink}
												to={item.path}
												label={!isCollapsed ? item.label : null}
												leftSection={
													<item.icon
														style={{ width: rem(20), height: rem(20) }}
														stroke={1.5}
													/>
												}
												active={isActive}
												variant="light"
												color="indigo"
												style={{
													borderRadius: "var(--mantine-radius-md)",
													backgroundColor: isActive
														? "var(--sidebar-active-bg)"
														: "transparent",
													color: isActive
														? "var(--sidebar-active-text)"
														: "var(--text-secondary)",
													fontWeight: isActive ? 600 : 400,
												}}
											/>
										</Tooltip>
									);
								})}
							</Stack>
						</Box>
					))}
				</Stack>
			</ScrollArea>

			{/* Footer Section */}
			<Stack gap="xs" p="xs" pt="md">
				{!isCollapsed && <Divider />}

				{/* Documentation & Support (Placeholder) */}
				<Tooltip label="Documentation" position="right" disabled={!isCollapsed}>
					{isCollapsed ? (
						<UnstyledButton
							style={{
								width: "100%",
								height: rem(44),
								borderRadius: "var(--mantine-radius-md)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "var(--text-secondary)",
								transition: "all 0.2s ease",
							}}
						>
							<IconBook
								style={{ width: rem(22), height: rem(22) }}
								stroke={1.5}
							/>
						</UnstyledButton>
					) : (
						<NavLink
							label="Documentation"
							leftSection={<IconBook size={20} stroke={1.5} />}
							style={{ borderRadius: "var(--mantine-radius-md)" }}
						/>
					)}
				</Tooltip>

				{isCollapsed ? (
					<Stack align="center" gap="md">
						<Tooltip
							label="Toggle Dark Mode"
							position="right"
							disabled={!isCollapsed}
						>
							<ActionIcon
								variant="subtle"
								color="gray"
								onClick={toggleDarkMode}
								size="lg"
								aria-label="Toggle color scheme"
							>
								{isDarkMode ? (
									<IconSun
										style={{ width: rem(20), height: rem(20) }}
										stroke={1.5}
									/>
								) : (
									<IconMoon
										style={{ width: rem(20), height: rem(20) }}
										stroke={1.5}
									/>
								)}
							</ActionIcon>
						</Tooltip>

						<Tooltip label="Expand" position="right">
							<ActionIcon
								variant="subtle"
								color="gray"
								onClick={onToggle}
								size="lg"
								aria-label="Expand sidebar"
							>
								<IconChevronRight
									style={{ width: rem(18), height: rem(18) }}
									stroke={1.5}
								/>
							</ActionIcon>
						</Tooltip>
					</Stack>
				) : (
					<Group justify="space-between" wrap="nowrap">
						<Tooltip label="Toggle Dark Mode" position="right">
							<ActionIcon
								variant="subtle"
								color="gray"
								onClick={toggleDarkMode}
								size="lg"
								aria-label="Toggle color scheme"
							>
								{isDarkMode ? (
									<IconSun
										style={{ width: rem(20), height: rem(20) }}
										stroke={1.5}
									/>
								) : (
									<IconMoon
										style={{ width: rem(20), height: rem(20) }}
										stroke={1.5}
									/>
								)}
							</ActionIcon>
						</Tooltip>

						<Tooltip label="Collapse" position="right">
							<ActionIcon
								variant="subtle"
								color="gray"
								onClick={onToggle}
								size="lg"
								aria-label="Collapse sidebar"
							>
								<IconChevronLeft
									style={{ width: rem(18), height: rem(18) }}
									stroke={1.5}
								/>
							</ActionIcon>
						</Tooltip>
					</Group>
				)}
			</Stack>
		</Stack>
	);
};

export default Sidebar;
