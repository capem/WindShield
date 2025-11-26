import { Stack } from "@mantine/core";
import React from "react";
import type { Alarm, Turbine } from "../types";
import DashboardContent from "./DashboardContent";
import DashboardHeader from "./DashboardHeader";

interface DashboardProps {
	turbines: Turbine[];
	alarms: Alarm[];
	// currentTime prop is removed as it's now handled internally by components that need it
	uploadedFileName: string | null;
	onSelectTurbine: (id: string) => void;
	isCompactView: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
	turbines,
	alarms,
	uploadedFileName,
	onSelectTurbine,
	isCompactView,
}) => {
	return (
		<Stack h="100%" gap="lg">
			<DashboardHeader />
			<DashboardContent
				turbines={turbines}
				alarms={alarms}
				uploadedFileName={uploadedFileName}
				onSelectTurbine={onSelectTurbine}
				isCompactView={isCompactView}
			/>
		</Stack>
	);
};

export default React.memo(Dashboard);
