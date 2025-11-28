import { Badge, Box, Card, Center, Group, Stack, Text } from "@mantine/core";
import { IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router-dom";
import type { Turbine } from "../types";
import { AlarmSeverity, TurbineStatus } from "../types";

interface TurbineCardProps {
	turbine: Turbine;
	onClick?: () => void;
	to?: string;
	isCompact?: boolean;
	activeAlarmSeverity?: AlarmSeverity | null;
}

const AnimatedTurbineIcon: React.FC<{
	status: TurbineStatus;
	activePower: number | null;
	maxPower: number;
}> = ({ status, activePower, maxPower }) => {
	const baseColor = {
		[TurbineStatus.Producing]: "var(--mantine-color-green-filled)",
		[TurbineStatus.Available]: "var(--mantine-color-blue-filled)",
		[TurbineStatus.Offline]: "var(--mantine-color-red-filled)",
		[TurbineStatus.Stopped]: "var(--mantine-color-yellow-filled)",
		[TurbineStatus.Maintenance]: "var(--mantine-color-grape-filled)",
		[TurbineStatus.Fault]: "var(--mantine-color-red-filled)",
		[TurbineStatus.Warning]: "var(--mantine-color-orange-filled)",
		[TurbineStatus.Curtailment]: "var(--mantine-color-indigo-filled)",
	}[status];

	let animationStyle: React.CSSProperties = {};

	if (status === TurbineStatus.Producing && activePower && maxPower) {
		const powerRatio = activePower / maxPower;
		const duration = Math.max(0.5, 4 - powerRatio * 3.5);
		animationStyle = {
			animation: `spin ${duration.toFixed(2)}s linear infinite`,
		};
	} else if (status === TurbineStatus.Available) {
		animationStyle = { animation: "spin 12s linear infinite" };
	}

	const blades = (
		<g style={{ ...animationStyle, transformOrigin: "center" }}>
			<path
				d="M12 12 L12 2"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M12 12 L20.66 18"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M12 12 L3.34 18"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</g>
	);

	return (
		<Box c={baseColor} w="100%" h="100%">
			<svg
				viewBox="0 0 24 24"
				style={{ width: "100%", height: "100%" }}
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<title>Turbine Status Icon</title>
				<path
					d="M12 22 L11 12.5 h2 L12 22"
					fill="currentColor"
					stroke="currentColor"
					strokeWidth="0.5"
					strokeLinejoin="round"
				/>
				{blades}
				<circle cx="12" cy="12" r="1.5" fill="currentColor" />
			</svg>
		</Box>
	);
};

const TurbineCard: React.FC<TurbineCardProps> = ({
	turbine,
	onClick,
	to,
	isCompact = false,
	activeAlarmSeverity = null,
}) => {
	const statusConfig = {
		[TurbineStatus.Producing]: { text: "Producing", color: "green" },
		[TurbineStatus.Available]: { text: "Available", color: "blue" },
		[TurbineStatus.Offline]: { text: "Offline", color: "red" },
		[TurbineStatus.Stopped]: { text: "Stopped", color: "yellow" },
		[TurbineStatus.Maintenance]: { text: "Maintenance", color: "grape" },
		[TurbineStatus.Fault]: { text: "Fault", color: "red" },
		[TurbineStatus.Warning]: { text: "Warning", color: "orange" },
		[TurbineStatus.Curtailment]: { text: "Curtailment", color: "indigo" },
	};

	const alarmConfig = {
		[AlarmSeverity.Critical]: { icon: IconAlertTriangle, color: "red" },
		[AlarmSeverity.Warning]: { icon: IconAlertTriangle, color: "yellow" },
		[AlarmSeverity.Info]: { icon: IconInfoCircle, color: "blue" },
	};

	const config = statusConfig[turbine.status];

	const CardContent = () => (
		<>
			{isCompact ? (
				<Stack gap={2} h="100%" justify="space-between">
					<Group justify="space-between" wrap="nowrap" gap={4}>
						<Group gap={2} wrap="nowrap">
							{activeAlarmSeverity && (
								<Box c={alarmConfig[activeAlarmSeverity].color}>
									{React.createElement(alarmConfig[activeAlarmSeverity].icon, {
										size: 12,
									})}
								</Box>
							)}
							<Text size="xs" fw={700} style={{ fontSize: 10 }}>
								{turbine.id}
							</Text>
						</Group>
						<Badge
							color={config.color}
							variant="light"
							size="xs"
							p={0}
							px={4}
							style={{ fontSize: 8, height: 14 }}
						>
							{config.text}
						</Badge>
					</Group>
					<Group justify="space-around" align="center" gap={4} flex={1}>
						<Box w={24} h={24}>
							<AnimatedTurbineIcon
								status={turbine.status}
								activePower={turbine.activePower}
								maxPower={turbine.maxPower}
							/>
						</Box>
						<Stack gap={0} align="center">
							<Box>
								<Text
									size="xs"
									c="dimmed"
									style={{ fontSize: 8, lineHeight: 1 }}
								>
									Pwr
								</Text>
								<Text
									size="xs"
									fw={700}
									style={{ fontSize: 9, lineHeight: 1.2 }}
								>
									{turbine.activePower !== null
										? `${turbine.activePower.toFixed(1)}`
										: "-"}
								</Text>
							</Box>
							<Box>
								<Text
									size="xs"
									c="dimmed"
									style={{ fontSize: 8, lineHeight: 1 }}
								>
									Wind
								</Text>
								<Text
									size="xs"
									fw={700}
									style={{ fontSize: 9, lineHeight: 1.2 }}
								>
									{turbine.windSpeed !== null
										? `${turbine.windSpeed.toFixed(1)}`
										: "-"}
								</Text>
							</Box>
						</Stack>
					</Group>
				</Stack>
			) : (
				<Stack gap="xs" h="100%">
					<Group justify="space-between" wrap="nowrap">
						<Group gap="xs">
							{activeAlarmSeverity && (
								<Box c={alarmConfig[activeAlarmSeverity].color}>
									{React.createElement(alarmConfig[activeAlarmSeverity].icon, {
										size: 16,
									})}
								</Box>
							)}
							<Text fw={700} size="sm">
								{turbine.id}
							</Text>
						</Group>
						<Badge color={config.color} variant="light" size="sm">
							{config.text}
						</Badge>
					</Group>

					<Center h={40} my={4}>
						<Box w={40} h={40}>
							<AnimatedTurbineIcon
								status={turbine.status}
								activePower={turbine.activePower}
								maxPower={turbine.maxPower}
							/>
						</Box>
					</Center>

					<Stack gap={4}>
						<Group justify="space-between">
							<Text size="xs" c="dimmed">
								Power
							</Text>
							<Text size="sm" fw={700}>
								{turbine.activePower !== null
									? `${turbine.activePower.toFixed(1)} MW`
									: "-"}
							</Text>
						</Group>
						<Group justify="space-between">
							<Text size="xs" c="dimmed">
								Wind
							</Text>
							<Text size="sm" fw={700}>
								{turbine.windSpeed !== null
									? `${turbine.windSpeed.toFixed(1)} m/s`
									: "-"}
							</Text>
						</Group>
					</Stack>
				</Stack>
			)}
		</>
	);

	const cardProps = {
		padding: isCompact ? 6 : "xs",
		radius: "md",
		withBorder: true,
		style: {
			borderLeftWidth: 4,
			borderLeftColor: `var(--mantine-color-${config.color}-filled)`,
			cursor: onClick || to ? "pointer" : "default",
			height: isCompact ? "100%" : "auto",
		},
	};

	if (to) {
		return (
			<Card
				component={Link}
				to={to}
				{...cardProps}
				className="turbine-card-hover"
			>
				<CardContent />
			</Card>
		);
	}

	return (
		<Card
			component={onClick ? "button" : "div"}
			onClick={onClick}
			{...cardProps}
			className="turbine-card-hover"
		>
			<CardContent />
		</Card>
	);
};

// Add hover effect style globally or in a CSS module if not using sx/styles prop extensively
// For now, relying on Mantine's default hover or adding a simple className if needed.
// But Mantine Card component doesn't have built-in hover lift.
// I'll add a style tag or class in global css for .turbine-card-hover

export default React.memo(TurbineCard);
