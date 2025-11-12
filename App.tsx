import React, { useState, useEffect, useRef } from 'react';
import { Turbine, TurbineStatus } from './types';
import TurbineCard from './components/TurbineCard';
import TurbineDetailView from './components/TurbineDetailView';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// --- CSV PARSING & DATA MAPPING UTILITIES ---

const parseCSV = (text: string): Record<string, string>[] => {
    try {
        const lines = text.trim().split(/\r\n|\n/);
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            if (values.length === headers.length) {
                return headers.reduce((obj, header, index) => {
                    obj[header] = values[index];
                    return obj;
                }, {} as Record<string, string>);
            }
            return null;
        }).filter((row): row is Record<string, string> => row !== null);
        
        return data;
    } catch (error) {
        console.error("Error parsing CSV:", error);
        return [];
    }
};

const mapCsvRowToTurbine = (row: Record<string, string>): Turbine => {
    const statusMap: { [key: string]: TurbineStatus } = {
        'producing': TurbineStatus.Producing,
        'available': TurbineStatus.Available,
        'offline': TurbineStatus.Offline,
        'stopped': TurbineStatus.Stopped,
    };
    const getNumber = (key: string): number | null => {
        const val = parseFloat(row[key]);
        return isNaN(val) ? null : val;
    };
    return {
        id: `T ${String(row['Turbine ID']).padStart(3, '0')}`,
        status: statusMap[(row['Status'] || '').toLowerCase()] || TurbineStatus.Offline,
        maxPower: getNumber('MaxPower(MW)') || 2.3,
        activePower: getNumber('ActivePower(MW)'),
        reactivePower: getNumber('ReactivePower(MVar)'),
        windSpeed: getNumber('WindSpeed(m/s)'),
        direction: getNumber('Direction(°)'),
        temperature: getNumber('Temperature(°C)'),
        rpm: getNumber('RPM'),
    };
};


// --- WIND FARM LAYOUT & MOCK DATA GENERATION ---

const layout = {
  "North Zone": [
    { name: "Line 12", ids: Array.from({ length: 18 }, (_, i) => i + 1) },
    { name: "Line 11", ids: Array.from({ length: 18 }, (_, i) => 36 - i) },
    { name: "Line 10", ids: Array.from({ length: 18 }, (_, i) => i + 37) },
    { name: "Line 9", ids: Array.from({ length: 19 }, (_, i) => 73 - i) },
    { name: "Line 8", ids: Array.from({ length: 14 }, (_, i) => i + 74) },
  ],
  "Tah Zone": [
    { name: "Line 7", ids: Array.from({ length: 7 }, (_, i) => 94 - i) },
    { name: "Line 6", ids: Array.from({ length: 6 }, (_, i) => i + 95) },
    { name: "Line 5", ids: Array.from({ length: 6 }, (_, i) => 106 - i) },
    { name: "Line 4", ids: Array.from({ length: 6 }, (_, i) => i + 107) },
    { name: "Line 3", ids: Array.from({ length: 6 }, (_, i) => 118 - i) },
    { name: "Line 2", ids: Array.from({ length: 7 }, (_, i) => i + 119) },
    { name: "Line 1", ids: Array.from({ length: 6 }, (_, i) => 131 - i) },
  ],
};

const generateTurbineData = (id: number): Turbine => {
    const statuses = [
        TurbineStatus.Producing, TurbineStatus.Producing, TurbineStatus.Producing, TurbineStatus.Producing,
        TurbineStatus.Available, TurbineStatus.Stopped, TurbineStatus.Offline
    ];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const maxPower = 2.3; // SWT-2.3-101 model
    let activePower: number | null = null, 
        windSpeed: number | null = null, 
        rpm: number | null = null, 
        temperature: number | null = null, 
        reactivePower: number | null = null, 
        direction: number | null = null;

    if (status === TurbineStatus.Producing) {
        activePower = Math.random() * 2.2 + 0.1; // Range 0.1 to 2.3
        const powerRatio = activePower / maxPower;

        // Realistic wind speed based on power output (3.5 m/s cut-in, 12.5 m/s nominal)
        windSpeed = 3.5 + Math.pow(powerRatio, 0.7) * (12.5 - 3.5); 
        windSpeed += (Math.random() - 0.5) * 0.5; // Add some noise
        if (windSpeed > 25) windSpeed = 25; // Cap at cut-out speed

        // Realistic RPM based on power output (6-16 rpm range)
        rpm = 6 + powerRatio * (16 - 6);
        rpm += (Math.random() - 0.5) * 0.5; // Add some noise
        if (rpm > 16) rpm = 16;
        if (rpm < 6) rpm = 6;
        
        temperature = 10 + Math.random() * 15;
        reactivePower = activePower * 0.1;
        direction = Math.floor(Math.random() * 360);

    } else if (status === TurbineStatus.Available) {
        activePower = 0.0;
        windSpeed = Math.random() * 3.5; // Wind speed below cut-in
        rpm = 0;
        temperature = 10 + Math.random() * 8;
        reactivePower = 0.0;
        direction = Math.floor(Math.random() * 360);
    } else if (status === TurbineStatus.Stopped) {
        activePower = 0.0;
        // Could be high wind (above cut-out 25m/s) or very low wind
        windSpeed = Math.random() > 0.5 ? Math.random() * 3 : 25 + Math.random() * 5;
        rpm = 0;
        temperature = 10 + Math.random() * 8;
        reactivePower = 0.0;
        direction = Math.floor(Math.random() * 360);
    }
    
    return {
        id: `T ${String(id).padStart(3, '0')}`,
        status,
        maxPower,
        activePower: activePower !== null ? parseFloat(activePower.toFixed(2)) : null,
        reactivePower: reactivePower !== null ? parseFloat(reactivePower.toFixed(1)) : null,
        windSpeed: windSpeed !== null ? parseFloat(windSpeed.toFixed(1)) : null,
        direction,
        temperature: temperature !== null ? Math.round(temperature) : null,
        rpm: rpm !== null ? parseFloat(rpm.toFixed(1)) : null,
    };
};

const allTurbineIds = Object.values(layout).flatMap(zone => zone.flatMap(line => line.ids));
const initialTurbines: Turbine[] = allTurbineIds.map(generateTurbineData);


// --- UI COMPONENTS ---

const iconColorMap: { [key: string]: string } = {
    'text-violet-600': 'bg-gradient-to-br from-violet-50 to-violet-200',
    'text-cyan-500': 'bg-gradient-to-br from-cyan-50 to-cyan-200',
    'text-purple-600': 'bg-gradient-to-br from-purple-50 to-purple-200',
    'text-green-600': 'bg-gradient-to-br from-green-50 to-green-200',
    'text-pink-500': 'bg-gradient-to-br from-pink-50 to-pink-200',
    'text-orange-500': 'bg-gradient-to-br from-orange-50 to-orange-200',
};

const SummaryCard: React.FC<{
    title: string;
    value: string;
    unit: string;
    icon: React.ReactNode;
    color: string;
}> = ({ title, value, unit, icon, color }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-start justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
                {value} <span className="text-xl font-medium text-gray-500">{unit}</span>
            </p>
        </div>
        <div className={`p-3 rounded-lg ${iconColorMap[color] || 'bg-gray-100'}`}>
            <div className={`${color} text-2xl w-7 h-7 flex items-center justify-center`}>{icon}</div>
        </div>
    </div>
);

const TurbineStatusSummaryCard: React.FC<{
    counts: {
        producing: number;
        available: number;
        stopped: number;
        offline: number;
    };
    className?: string;
}> = ({ counts, className }) => {
    const statusItems = [
        { name: 'Producing', count: counts.producing, icon: <i className="fa-solid fa-circle-check"></i>, color: 'text-green-500' },
        { name: 'Available', count: counts.available, icon: <i className="fa-solid fa-circle-info"></i>, color: 'text-blue-500' },
        { name: 'Stopped', count: counts.stopped, icon: <i className="fa-solid fa-circle-pause"></i>, color: 'text-yellow-500' },
        { name: 'Offline', count: counts.offline, icon: <i className="fa-solid fa-circle-xmark"></i>, color: 'text-red-500' },
    ];

    return (
        <div className={`bg-white p-4 rounded-xl shadow-sm h-full flex flex-col ${className} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
            <p className="text-sm text-gray-500 font-medium mb-3">Turbine Status</p>
            <div className="flex-grow flex flex-col justify-around">
                {statusItems.map(item => (
                    <div key={item.name} className="flex justify-between items-center">
                        <div className={`flex items-center gap-3 font-medium ${item.color}`}>
                             <span className="text-lg w-5 text-center">{item.icon}</span>
                            <span className="text-sm text-gray-700 font-semibold">{item.name}</span>
                        </div>
                        <span className="font-bold text-lg text-gray-800">{item.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


function App() {
    const [turbines, setTurbines] = useState<Turbine[]>(initialTurbines);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedTurbineId, setSelectedTurbineId] = useState<string | null>(null);
    const [isCompactView, setIsCompactView] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [allHistoricalData, setAllHistoricalData] = useState<Record<string, any[]> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

    const handleSelectTurbine = (turbineId: string) => {
        setSelectedTurbineId(turbineId);
    };

    const handleCloseDetailView = () => {
        setSelectedTurbineId(null);
    };

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    }

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
                alert("Could not parse CSV file. Please ensure it has headers and is formatted correctly.");
                return;
            }

            const dataByTurbine = parsedData.reduce((acc, row) => {
                if (row['Turbine ID']) {
                    const turbineId = `T ${String(row['Turbine ID']).padStart(3, '0')}`;
                    if (!acc[turbineId]) acc[turbineId] = [];
                    acc[turbineId].push(row);
                }
                return acc;
            }, {} as Record<string, any[]>);

            Object.values(dataByTurbine).forEach(rows => {
                rows.sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());
            });

            const latestTurbineData = Object.values(dataByTurbine).map(rows => mapCsvRowToTurbine(rows[0]));

            const finalTurbines = allTurbineIds.map(id => {
                const idStr = `T ${String(id).padStart(3, '0')}`;
                const found = latestTurbineData.find(t => t.id === idStr);
                return found || {
                    id: idStr, status: TurbineStatus.Offline, maxPower: 2.3, activePower: null,
                    reactivePower: null, windSpeed: null, direction: null, temperature: null, rpm: null
                };
            });

            setTurbines(finalTurbines);
            setAllHistoricalData(dataByTurbine);
            setUploadedFileName(file.name);
        };
        reader.onerror = () => alert("Error reading file.");
        reader.readAsText(file);
        event.target.value = '';
    };


    const selectedTurbine = turbines.find(t => t.id === selectedTurbineId);
    const historicalDataForSelectedTurbine = selectedTurbineId && allHistoricalData ? allHistoricalData[selectedTurbineId] : undefined;

    // --- COHERENT DATA CALCULATIONS ---
    const onlineTurbines = turbines.filter(t => t.status !== TurbineStatus.Offline);
    const totalActivePower = onlineTurbines.reduce((sum, t) => sum + (t.activePower || 0), 0);
    const totalReactivePower = onlineTurbines.reduce((sum, t) => sum + (t.reactivePower || 0), 0);

    const turbineStatusCounts = {
        producing: turbines.filter(t => t.status === TurbineStatus.Producing).length,
        available: turbines.filter(t => t.status === TurbineStatus.Available).length,
        stopped: turbines.filter(t => t.status === TurbineStatus.Stopped).length,
        offline: turbines.filter(t => t.status === TurbineStatus.Offline).length,
    };
        
    const totalInstalledCapacity = turbines.reduce((sum, t) => sum + t.maxPower, 0);
    const loadFactor = totalInstalledCapacity > 0 ? (totalActivePower / totalInstalledCapacity) * 100 : 0;
    
    // Simulate production today in MWh based on current active power
    const hoursToday = currentTime.getHours() + currentTime.getMinutes() / 60;
    const productionTodayMWh = totalActivePower * hoursToday;


    const onlineTurbinesWithWind = onlineTurbines.filter(t => t.windSpeed !== null);
    const averageWindSpeed = onlineTurbinesWithWind.length > 0 
        ? onlineTurbinesWithWind.reduce((sum, t) => sum + t.windSpeed!, 0) / onlineTurbinesWithWind.length
        : 0;

    const onlineTurbinesWithTemp = onlineTurbines.filter(t => t.temperature !== null);
    const averageTemperature = onlineTurbinesWithTemp.length > 0
        ? onlineTurbinesWithTemp.reduce((sum, t) => sum + t.temperature!, 0) / onlineTurbinesWithTemp.length
        : 0;

    const summaryDataTop = [
        { title: 'Active Power', value: totalActivePower.toFixed(1), unit: 'MW', icon: <i className="fa-solid fa-bolt"></i>, color: 'text-violet-600' },
        { title: 'Reactive Power', value: totalReactivePower.toFixed(1), unit: 'MVar', icon: <i className="fa-solid fa-bolt-lightning"></i>, color: 'text-cyan-500' },
        { title: 'Load Factor', value: loadFactor.toFixed(1), unit: '%', icon: <i className="fa-solid fa-gauge-high"></i>, color: 'text-purple-600' },
        { title: 'Production (Today)', value: productionTodayMWh.toFixed(1), unit: 'MWh', icon: <i className="fa-solid fa-solar-panel"></i>, color: 'text-green-600' },
    ];
     
    const summaryDataBottom = [
         { title: 'Average Wind Speed', value: averageWindSpeed.toFixed(1), unit: 'm/s', icon: <i className="fa-solid fa-wind"></i>, color: 'text-pink-500' },
         { title: 'Average Temperature', value: averageTemperature.toFixed(0), unit: '°C', icon: <i className="fa-solid fa-temperature-half"></i>, color: 'text-orange-500' },
    ];

    // --- CUSTOM DATE/TIME FORMATTING ---
    const weekday = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
    const day = currentTime.getDate();
    const month = currentTime.toLocaleDateString('en-US', { month: 'long' });
    const year = currentTime.getFullYear();
    const formattedDate = `${weekday} ${day} ${month} ${year}`;
    const formattedTime = currentTime.toLocaleTimeString('fr-FR');
    
    return (
        <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
            <Sidebar isCollapsed={isSidebarCollapsed} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onToggleSidebar={handleToggleSidebar} onUploadClick={handleUploadClick} />
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
                <main className="flex-1 p-6 overflow-y-auto">
                    {selectedTurbine ? (
                        <TurbineDetailView 
                          turbine={selectedTurbine} 
                          onBack={handleCloseDetailView} 
                          historicalData={historicalDataForSelectedTurbine}
                        />
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {summaryDataTop.map((data) => <SummaryCard key={data.title} {...data} />)}
                                {summaryDataBottom.map((data) => <SummaryCard key={data.title} {...data} />)}
                                <TurbineStatusSummaryCard counts={turbineStatusCounts} className="sm:col-span-2 lg:col-span-2" />
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
                                <div className="pb-4 mb-4 border-b border-gray-200 flex justify-between items-center text-sm">
                                    <span className="font-semibold text-gray-700">
                                        {uploadedFileName
                                            ? <>Displaying data from <span className="text-violet-600 font-bold">{uploadedFileName}</span></>
                                            : <>{formattedDate} at {formattedTime}</>
                                        }
                                    </span>
                                    <div className="flex items-center gap-6">
                                        <label htmlFor="compact-toggle" className="flex items-center cursor-pointer">
                                            <span className="mr-2 text-gray-600 font-medium">Compact view</span>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    id="compact-toggle"
                                                    className="sr-only"
                                                    checked={isCompactView}
                                                    onChange={() => setIsCompactView(!isCompactView)}
                                                />
                                                <div className={`block w-10 h-6 rounded-full transition-colors ${isCompactView ? 'bg-violet-500' : 'bg-gray-200'}`}></div>
                                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${isCompactView ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                            </div>
                                        </label>
                                        <span className="text-gray-500">
                                            Last updated: {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    {Object.entries(layout).map(([zoneName, lines]) => (
                                        <div key={zoneName}>
                                            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-violet-200">{zoneName}</h2>
                                            <div className="space-y-6">
                                                {lines.map(line => {
                                                    const lineTurbines = line.ids.map(id => 
                                                        turbines.find(t => t.id === `T ${String(id).padStart(3, '0')}`)
                                                    ).filter((t): t is Turbine => !!t);

                                                    return (
                                                        <div key={line.name}>
                                                            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">{line.name}</h3>
                                                            <div 
                                                                className="grid gap-4"
                                                                style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${isCompactView ? '10rem' : '12rem'}, 1fr))` }}
                                                            >
                                                                {lineTurbines.map(turbine => (
                                                                    <TurbineCard key={turbine.id} turbine={turbine} onClick={() => handleSelectTurbine(turbine.id)} isCompact={isCompactView} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default App;