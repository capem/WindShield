import React from "react";
import { useMemo, useState } from "react";
import {
	generateAlarmData,
	generateTimestampData,
} from "../availabilityDataUtils";
import type { TurbineAvailabilityModalProps } from "../availabilityTypes";
import AlarmView from "./AlarmView";
import TimestampView from "./TimestampView";
import { Modal, Tabs, Group, Text } from "@mantine/core";
import { IconBell, IconClock } from "@tabler/icons-react";

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

	// Keep content mounted to avoid re-rendering heavy views when switching tabs
	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			title={
				<Text fw={700} size="lg">
					Turbine {turbineId} Availability Analysis
				</Text>
			}
			size="xl"
			padding="lg"
			overlayProps={{
				backgroundOpacity: 0.55,
			}}
			transitionProps={{ duration: 0 }}
			keepMounted
		>
			<Tabs
				value={activeView}
				onChange={(value) => setActiveView(value || "alarm")}
				keepMounted={true}
			>
				<Tabs.List mb="md">
					<Tabs.Tab value="alarm" leftSection={<IconBell size={16} />}>
						Alarm View
					</Tabs.Tab>
					<Tabs.Tab value="timestamp" leftSection={<IconClock size={16} />}>
						10-Minute Timestamp View
					</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="alarm">
					<AlarmView data={alarmData} />
				</Tabs.Panel>

				<Tabs.Panel value="timestamp">
					<TimestampView data={timestampData} />
				</Tabs.Panel>
			</Tabs>
		</Modal>
	);
};

export default React.memo(TurbineAvailabilityModal);
