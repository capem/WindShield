import {
	ActionIcon,
	Badge,
	Box,
	Button,
	Divider,
	Group,
	ScrollArea,
	Stack,
	Text,
	ThemeIcon,
} from "@mantine/core";
import {
	IconAlertCircle,
	IconAlertTriangle,
	IconCheck,
	IconInfoCircle,
} from "@tabler/icons-react";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Alarm } from "../types";
import { AlarmSeverity } from "../types";

interface NotificationPanelProps {
	alarms: Alarm[];
	opened: boolean;
	onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
	alarms,
	onClose,
}) => {
	const [readNotifications, setReadNotifications] = useState<Set<string>>(
		new Set(),
	);
	const navigate = useNavigate();

	const unreadAlarms = alarms.filter(
		(alarm) => !readNotifications.has(alarm.id),
	);

	const markAsRead = (alarmId: string) => {
		setReadNotifications((prev) => new Set(prev).add(alarmId));
	};

	const markAllAsRead = () => {
		setReadNotifications(new Set(alarms.map((a) => a.id)));
	};

	const handleAlarmClick = (alarm: Alarm) => {
		markAsRead(alarm.id);
		navigate(`/turbine/${encodeURIComponent(alarm.turbineId)}`);
		onClose();
	};

	const getAlarmIcon = (severity: AlarmSeverity) => {
		switch (severity) {
			case AlarmSeverity.Critical:
				return <IconAlertCircle size={18} />;
			case AlarmSeverity.Warning:
				return <IconAlertTriangle size={18} />;
			default:
				return <IconInfoCircle size={18} />;
		}
	};

	const getAlarmColor = (severity: AlarmSeverity) => {
		switch (severity) {
			case AlarmSeverity.Critical:
				return "red";
			case AlarmSeverity.Warning:
				return "yellow";
			default:
				return "blue";
		}
	};

	const formatTimestamp = (date: Date) => {
		const now = new Date();
		const diff = now.getTime() - new Date(date).getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (minutes < 1) return "Just now";
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		return `${days}d ago`;
	};

	return (
		<Box style={{ width: 380, maxWidth: "90vw" }}>
			<Group justify="space-between" p="md" pb="sm">
				<Text size="lg" fw={600}>
					Notifications
				</Text>
				{unreadAlarms.length > 0 && (
					<Button
						variant="subtle"
						size="xs"
						onClick={markAllAsRead}
						leftSection={<IconCheck size={14} />}
					>
						Mark all read
					</Button>
				)}
			</Group>

			<Divider />

			<ScrollArea h={400} type="auto">
				{alarms.length === 0 ? (
					<Stack align="center" justify="center" h={400} gap="xs">
						<ThemeIcon size={60} radius="xl" variant="light" color="gray">
							<IconCheck size={30} />
						</ThemeIcon>
						<Text size="sm" c="dimmed" ta="center">
							No notifications
						</Text>
						<Text size="xs" c="dimmed" ta="center">
							You're all caught up!
						</Text>
					</Stack>
				) : (
					<Stack gap={0}>
						{alarms.map((alarm) => {
							const isRead = readNotifications.has(alarm.id);
							const color = getAlarmColor(alarm.severity);

							return (
								<Box
									key={alarm.id}
									p="md"
									style={{
										cursor: "pointer",
										backgroundColor: isRead
											? "transparent"
											: "var(--mantine-color-default-hover)",
										borderLeft: `3px solid var(--mantine-color-${color}-6)`,
										transition: "background-color 0.2s",
									}}
									onClick={() => handleAlarmClick(alarm)}
								>
									<Group align="flex-start" gap="sm" wrap="nowrap">
										<ThemeIcon
											size="md"
											radius="xl"
											variant="light"
											color={color}
										>
											{getAlarmIcon(alarm.severity)}
										</ThemeIcon>

										<Box style={{ flex: 1, minWidth: 0 }}>
											<Group justify="space-between" gap="xs" mb={4}>
												<Text size="sm" fw={600} lineClamp={1}>
													{alarm.description}
												</Text>
												{!isRead && (
													<Badge size="xs" variant="filled" color={color}>
														New
													</Badge>
												)}
											</Group>

											<Text size="xs" c="dimmed" mb={4}>
												Turbine {alarm.turbineId} • Code {alarm.code}
											</Text>

											<Group justify="space-between" align="center">
												<Text size="xs" c="dimmed">
													{formatTimestamp(alarm.timeOn)}
												</Text>
												{!isRead && (
													<ActionIcon
														size="xs"
														variant="subtle"
														color="gray"
														onClick={(e) => {
															e.stopPropagation();
															markAsRead(alarm.id);
														}}
													>
														<IconCheck size={12} />
													</ActionIcon>
												)}
											</Group>
										</Box>
									</Group>
								</Box>
							);
						})}
					</Stack>
				)}
			</ScrollArea>
		</Box>
	);
};

export default NotificationPanel;
