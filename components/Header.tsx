import {
	ActionIcon,
	Burger,
	Button,
	Code,
	Group,
	HoverCard,
	Indicator,
	rem,
	Text,
} from "@mantine/core";
import { IconBell, IconUpload, IconUser } from "@tabler/icons-react";
import type React from "react";
import type { Alarm } from "../types";
import { AlarmSeverity } from "../types";

interface HeaderProps {
	onToggleSidebar: () => void;
	onUploadClick: () => void;
	unacknowledgedAlarms: Alarm[];
}

const Header: React.FC<HeaderProps> = ({
	onToggleSidebar,
	onUploadClick,
	unacknowledgedAlarms,
}) => {
	const count = unacknowledgedAlarms.length;
	let iconColor = "gray";
	let hasCritical = false;
	let hasWarning = false;

	if (count > 0) {
		hasCritical = unacknowledgedAlarms.some(
			(a) => a.severity === AlarmSeverity.Critical,
		);
		hasWarning = unacknowledgedAlarms.some(
			(a) => a.severity === AlarmSeverity.Warning,
		);

		if (hasCritical) {
			iconColor = "red";
		} else if (hasWarning) {
			iconColor = "yellow";
		} else {
			iconColor = "blue";
		}
	}

	return (
		<Group justify="space-between" h="100%" px="md">
			<Group>
				<Burger
					opened={false}
					onClick={onToggleSidebar}
					hiddenFrom="sm"
					size="sm"
				/>
				{/* Logo moved to Sidebar */}
			</Group>

			<Group>
				<HoverCard
					width={320}
					shadow="md"
					withArrow
					openDelay={200}
					closeDelay={0}
				>
					<HoverCard.Target>
						<Button
							variant="subtle"
							color="gray"
							leftSection={<IconUpload size={20} />}
							onClick={onUploadClick}
						>
							Upload Data
						</Button>
					</HoverCard.Target>
					<HoverCard.Dropdown>
						<Text size="sm" fw={500} mb="xs">
							Upload a CSV file with turbine data.
						</Text>
						<Text size="xs" fw={700} mb={5}>
							Required columns:
						</Text>
						<Group gap={5}>
							{[
								"Timestamp",
								"Turbine ID",
								"Status",
								"ActivePower(MW)",
								"ReactivePower(MVar)",
								"WindSpeed(m/s)",
								"Direction(°)",
								"Temperature(°C)",
								"RPM",
								"MaxPower(MW)",
							].map((col) => (
								<Code key={col} color="blue.1" c="blue.9">
									{col}
								</Code>
							))}
						</Group>
					</HoverCard.Dropdown>
				</HoverCard>

				<Indicator
					color={iconColor}
					disabled={count === 0}
					label={count}
					size={16}
					offset={4}
					withBorder
					processing={hasCritical}
				>
					<ActionIcon
						variant="subtle"
						color="gray"
						size="lg"
						aria-label="Notifications"
					>
						<IconBell
							style={{ width: rem(20), height: rem(20) }}
							stroke={1.5}
						/>
					</ActionIcon>
				</Indicator>

				<ActionIcon
					variant="subtle"
					color="gray"
					size="lg"
					aria-label="User profile"
				>
					<IconUser style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
				</ActionIcon>
			</Group>
		</Group>
	);
};

export default Header;
