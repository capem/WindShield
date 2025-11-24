import React from "react";
import { useLocation, NavLink as RouterNavLink } from "react-router-dom";
import {
	NavLink,
	Stack,
	Text,
	Tooltip,
	Center,
	rem,
	ThemeIcon,
} from "@mantine/core";
import {
	IconLayoutDashboard,
	IconChartPie,
	IconFileDescription,
	IconSettings,
	IconWind,
} from "@tabler/icons-react";

interface SidebarProps {
	isCollapsed: boolean;
}

const menuItems = [
	{ path: "/", icon: IconLayoutDashboard, label: "Dashboard" },
	{ path: "/analytics", icon: IconChartPie, label: "Analytics" },
	{ path: "/reports", icon: IconFileDescription, label: "Reports" },
	{ path: "/settings", icon: IconSettings, label: "Settings" },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
	const location = useLocation();

	return (
		<Stack h="100%" gap="md">
			<Center p="xs">
				<ThemeIcon variant="light" size={30} color="violet">
					<IconWind style={{ width: rem(18), height: rem(18) }} />
				</ThemeIcon>
				{!isCollapsed && (
					<Text fw={700} size="xl" ml="xs">
						WindGrid
					</Text>
				)}
			</Center>

			<Stack gap={4}>
				{menuItems.map((item) => {
					const isActive = location.pathname === item.path;
					const LinkComponent = (
						<NavLink
							key={item.path}
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
							color="violet"
							py="md"
						/>
					);

					if (isCollapsed) {
						return (
							<Tooltip
								key={item.path}
								label={item.label}
								position="right"
								withArrow
							>
								{LinkComponent}
							</Tooltip>
						);
					}

					return LinkComponent;
				})}
			</Stack>
		</Stack>
	);
};

export default Sidebar;
