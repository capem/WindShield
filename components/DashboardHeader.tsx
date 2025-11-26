import { Group, Text, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";

const DashboardHeader: React.FC = () => {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	const weekday = currentTime.toLocaleDateString("en-US", {
		weekday: "long",
	});
	const day = currentTime.getDate();
	const month = currentTime.toLocaleDateString("en-US", { month: "long" });
	const year = currentTime.getFullYear();
	const formattedDate = `${weekday} ${day} ${month} ${year}`;
	const formattedTime = currentTime.toLocaleTimeString("fr-FR");

	return (
		<Group justify="space-between" align="center">
			<Title order={2} fw={800} c="dimmed">
				Dashboard
			</Title>
			<Text size="sm" c="dimmed" fw={500}>
				{formattedDate} • {formattedTime}
			</Text>
		</Group>
	);
};

export default React.memo(DashboardHeader);
