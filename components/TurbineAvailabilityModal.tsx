import { Group, Modal, Tabs, Text, ThemeIcon } from "@mantine/core";
import { IconBell, IconClock, IconWind } from "@tabler/icons-react";
import React, { useMemo, useState } from "react";
import {
	generateAlarmData,
	generateTimestampData,
} from "../availabilityDataUtils";
import type { TurbineAvailabilityModalProps } from "../availabilityTypes";
import AlarmView from "./AlarmView";
import TimestampView from "./TimestampView";

const TurbineAvailabilityModal: React.FC<TurbineAvailabilityModalProps> = ({
	turbineId,
	isOpen,
	onClose,
	initialView = "alarm",
}) => {
	const [activeView, setActiveView] = useState<string>(initialView);

	// Generate mock data for the selected turbine
	const alarmData = useMemo(() => generateAlarmData(turbineId), [turbineId]);
	const timestampData = useMemo(() => generateTimestampData(), []);

	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			title={
				<Group>
					<ThemeIcon size="lg" variant="light" color="cyan">
						<IconWind size={20} />
					</ThemeIcon>
					<div>
						<Text fw={700} size="lg">
							Turbine {turbineId} Availability Analysis
						</Text>
						<Text size="xs" c="dimmed">
							Detailed performance and alarm logs
						</Text>
					</div>
				</Group>
			}
			size="90%"
			padding="lg"
			overlayProps={{
				backgroundOpacity: 0.55,
				blur: 3,
			}}
			styles={{
				body: { height: "80vh", display: "flex", flexDirection: "column" },
				content: { height: "90vh", display: "flex", flexDirection: "column" },
			}}
			keepMounted
		>
			<Tabs
				value={activeView}
				onChange={(value) => setActiveView(value || "alarm")}
				keepMounted={true}
				style={{ flex: 1, display: "flex", flexDirection: "column" }}
			>
				<Tabs.List mb="md">
					<Tabs.Tab value="alarm" leftSection={<IconBell size={16} />}>
						Alarm View
					</Tabs.Tab>
					<Tabs.Tab value="timestamp" leftSection={<IconClock size={16} />}>
						10-Minute Timestamp View
					</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="alarm" style={{ flex: 1, minHeight: 0 }}>
					<AlarmView data={alarmData} />
				</Tabs.Panel>

				<Tabs.Panel value="timestamp" style={{ flex: 1, minHeight: 0 }}>
					<TimestampView data={timestampData} />
				</Tabs.Panel>
			</Tabs>
		</Modal>
	);
};

export default React.memo(TurbineAvailabilityModal);
