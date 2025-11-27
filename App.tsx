import { AppShell, MantineProvider } from "@mantine/core";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	BrowserRouter,
	Navigate,
	Route,
	Routes,
	useLocation,
	useNavigate,
	useParams,
} from "react-router-dom";
import AnalyticsView from "./components/AnalyticsView";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import ReportsView from "./components/ReportsView";
import SettingsView from "./components/SettingsView";
import Sidebar from "./components/Sidebar";
import TurbineDetailView from "./components/TurbineDetailView";
import {
	ThemeConsumer,
	ThemeProvider,
	useTheme,
} from "./contexts/ThemeContext";
import {
	allTurbineIds,
	generateInitialAlarms,
	generateMockAnalyticsData,
	initialTurbines,
	mapCsvRowToTurbine,
	parseCSV,
} from "./data/mockdata/turbines";
import { theme } from "./theme";
import { TurbineStatus, type Alarm, type Turbine } from "./types";

// Wrapper for TurbineDetailView to handle routing params
const TurbineDetailWrapper: React.FC<{
	turbines: Turbine[];
	alarms: Alarm[];
	onAcknowledgeAlarm: (id: string) => void;
	historicalDataMap: Record<string, Array<Record<string, unknown>>> | null;
}> = ({ turbines, alarms, onAcknowledgeAlarm, historicalDataMap }) => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const decodedId = id ? decodeURIComponent(id) : null;
	const turbine = turbines.find((t) => t.id === decodedId);

	if (!turbine) {
		return <Navigate to="/" replace />;
	}

	const turbineAlarms = alarms.filter((a) => a.turbineId === turbine.id);
	const historicalData = historicalDataMap?.[turbine.id] as
		| Array<Record<string, string>>
		| undefined;

	return (
		<TurbineDetailView
			turbine={turbine}
			onBack={() => navigate(-1)}
			alarms={turbineAlarms}
			onAcknowledgeAlarm={onAcknowledgeAlarm}
			historicalData={historicalData}
		/>
	);
};

function AppContent() {
	const { isDarkMode, toggleDarkMode } = useTheme();
	const [turbines, setTurbines] = useState<Turbine[]>(initialTurbines);
	const [alarms, setAlarms] = useState<Alarm[]>(() =>
		generateInitialAlarms(initialTurbines),
	);
	const [isCompactView, setIsCompactView] = useState(false);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
	const [allHistoricalData, setAllHistoricalData] = useState<Record<
		string,
		Array<Record<string, unknown>>
	> | null>(null);
	const [analyticsData, setAnalyticsData] = useState<Record<
		string,
		Array<Record<string, unknown>>
	> | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		setAnalyticsData(generateMockAnalyticsData(initialTurbines));
	}, []);

	// Scroll to top on route change
	useEffect(() => {
		if (location.pathname) {
			window.scrollTo(0, 0);
		}
	}, [location.pathname]);

	const handleAcknowledgeAlarm = (alarmId: string) => {
		setAlarms((currentAlarms) => {
			const alarmIndex = currentAlarms.findIndex(
				(alarm) => alarm.id === alarmId,
			);

			if (alarmIndex === -1 || currentAlarms[alarmIndex].acknowledged) {
				return currentAlarms;
			}

			const newAlarms = [...currentAlarms];

			newAlarms[alarmIndex] = {
				...currentAlarms[alarmIndex],
				acknowledged: true,
			};

			return newAlarms;
		});
	};

	const handleToggleSidebar = () => {
		setIsSidebarCollapsed(!isSidebarCollapsed);
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result as string;
			const parsedData = parseCSV(text);
			if (parsedData.length === 0) {
				alert(
					"Could not parse CSV file. Please ensure it has headers and is formatted correctly.",
				);
				return;
			}

			const dataByTurbine = parsedData.reduce(
				(acc, row) => {
					if (row["Turbine ID"]) {
						const turbineId = `T ${String(row["Turbine ID"]).padStart(3, "0")}`;
						if (!acc[turbineId]) acc[turbineId] = [];
						acc[turbineId].push(row);
					}
					return acc;
				},
				{} as Record<string, Array<Record<string, string>>>,
			);

			Object.values(dataByTurbine).forEach((rows) => {
				rows.sort(
					(a, b) =>
						new Date(b.Timestamp as string).getTime() -
						new Date(a.Timestamp as string).getTime(),
				);
			});

			const latestTurbineData = Object.values(dataByTurbine).map((rows) =>
				mapCsvRowToTurbine(rows[0] as Record<string, string>),
			);

			const finalTurbines = allTurbineIds.map((id) => {
				const idStr = `T ${String(id).padStart(3, "0")}`;
				const found = latestTurbineData.find((t) => t.id === idStr);
				return (
					found || {
						id: idStr,
						status: TurbineStatus.Offline,
						maxPower: 2.3,
						activePower: null,
						reactivePower: null,
						windSpeed: null,
						direction: null,
						temperature: null,
						rpm: null,
					}
				);
			});

			setTurbines(finalTurbines);
			setAllHistoricalData(dataByTurbine);
			setAnalyticsData(dataByTurbine);
			setUploadedFileName(file.name);
			setAlarms(generateInitialAlarms(finalTurbines));
		};
		reader.onerror = () => alert("Error reading file.");
		reader.readAsText(file);
		event.target.value = "";
	};

	const unacknowledgedAlarms = alarms.filter(
		(a) => !a.timeOff && !a.acknowledged,
	);

	return (
		<AppShell
			layout="alt"
			header={{ height: 64 }}
			navbar={{
				width: isSidebarCollapsed ? 80 : 250,
				breakpoint: "sm",
			}}
			padding="md"
		>
			<AppShell.Header>
				<Header
					onToggleSidebar={handleToggleSidebar}
					onUploadClick={handleUploadClick}
					unacknowledgedAlarms={unacknowledgedAlarms}
				/>
			</AppShell.Header>

			<AppShell.Navbar p="md">
				<Sidebar
					isCollapsed={isSidebarCollapsed}
					onToggle={handleToggleSidebar}
				/>
			</AppShell.Navbar>

			<AppShell.Main>
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					style={{ display: "none" }}
					accept=".csv"
				/>
				<Routes>
					<Route
						path="/"
						element={
							<Dashboard
								turbines={turbines}
								alarms={alarms}
								uploadedFileName={uploadedFileName}
								onSelectTurbine={useCallback(
									(id) => navigate(`/turbine/${encodeURIComponent(id)}`),
									[navigate],
								)}
								isCompactView={isCompactView}
							/>
						}
					/>
					<Route
						path="/turbine/:id"
						element={
							<TurbineDetailWrapper
								turbines={turbines}
								alarms={alarms}
								onAcknowledgeAlarm={handleAcknowledgeAlarm}
								historicalDataMap={allHistoricalData || analyticsData}
							/>
						}
					/>
					<Route
						path="/analytics"
						element={
							<AnalyticsView
								analyticsData={analyticsData}
								turbines={turbines}
								alarms={alarms}
							/>
						}
					/>
					<Route path="/reports" element={<ReportsView />} />
					<Route
						path="/settings"
						element={
							<SettingsView
								isCompactView={isCompactView}
								setIsCompactView={setIsCompactView}
								isSidebarCollapsed={isSidebarCollapsed}
								setIsSidebarCollapsed={setIsSidebarCollapsed}
								isDarkMode={isDarkMode}
								setIsDarkMode={toggleDarkMode}
							/>
						}
					/>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</AppShell.Main>
		</AppShell>
	);
}

function App() {
	return (
		<BrowserRouter>
			<ThemeProvider>
				<ThemeConsumer>
					{({ isDarkMode }) => (
						<MantineProvider
							theme={theme}
							forceColorScheme={isDarkMode ? "dark" : "light"}
						>
							<AppContent />
						</MantineProvider>
					)}
				</ThemeConsumer>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
