import React, { useState, useEffect } from 'react';
import { Turbine, TurbineStatus } from './types';
import TurbineCard from './components/TurbineCard';
import TurbineDetailView from './components/TurbineDetailView';

// --- MOCK DATA ---
const initialTurbines: Turbine[] = [
    { id: 'T 001', status: TurbineStatus.Producing, activePower: 3.6, maxPower: 4.0, reactivePower: 0.3, windSpeed: 9.4, direction: 99, temperature: 15, rpm: 14.8 },
    { id: 'T 002', status: TurbineStatus.Producing, activePower: 2.4, maxPower: 4.0, reactivePower: 0.2, windSpeed: 6.9, direction: 87, temperature: 14, rpm: 11.2 },
    { id: 'T 003', status: TurbineStatus.Producing, activePower: 4.0, maxPower: 4.0, reactivePower: 0.4, windSpeed: 11.4, direction: 117, temperature: 16, rpm: 15.0 },
    { id: 'T 004', status: TurbineStatus.Producing, activePower: 2.2, maxPower: 4.0, reactivePower: 0.2, windSpeed: 6.9, direction: 128, temperature: 14, rpm: 10.9 },
    { id: 'T 005', status: TurbineStatus.Available, activePower: 0.0, maxPower: 4.0, reactivePower: 0.0, windSpeed: 5.4, direction: 88, temperature: 12, rpm: 0 },
    { id: 'T 006', status: TurbineStatus.Producing, activePower: 2.0, maxPower: 4.0, reactivePower: 0.1, windSpeed: 7.6, direction: 90, temperature: 15, rpm: 11.5 },
    { id: 'T 007', status: TurbineStatus.Offline, activePower: null, maxPower: 4.0, reactivePower: null, windSpeed: null, direction: null, temperature: null, rpm: null },
    { id: 'T 008', status: TurbineStatus.Producing, activePower: 3.4, maxPower: 4.0, reactivePower: 0.3, windSpeed: 9.9, direction: 145, temperature: 16, rpm: 14.2 },
    { id: 'T 009', status: TurbineStatus.Producing, activePower: 1.1, maxPower: 4.0, reactivePower: 0.2, windSpeed: 7.1, direction: 135, temperature: 13, rpm: 8.5 },
    { id: 'T 010', status: TurbineStatus.Producing, activePower: 3.8, maxPower: 4.0, reactivePower: 0.5, windSpeed: 10.2, direction: 162, temperature: 17, rpm: 14.9 },
    { id: 'T 011', status: TurbineStatus.Producing, activePower: 2.5, maxPower: 4.0, reactivePower: 0.2, windSpeed: 5.4, direction: 164, temperature: 14, rpm: 11.3 },
    { id: 'T 012', status: TurbineStatus.Stopped, activePower: 0.0, maxPower: 4.0, reactivePower: 0.0, windSpeed: 3.1, direction: 159, temperature: 11, rpm: 0 },
];

// --- UI COMPONENTS ---

const Sidebar = () => (
    <aside className="w-64 bg-white shadow-md flex-shrink-0">
        <div className="p-6 text-2xl font-bold text-gray-800">168X40</div>
        <nav className="mt-6 px-4">
            <a href="#" className="flex items-center gap-4 px-4 py-3 text-violet-600 bg-violet-50 rounded-lg">
                <i className="fa-solid fa-table-cells-large"></i>
                <span className="font-semibold">Dashboard</span>
            </a>
        </nav>
    </aside>
);

const Header = () => (
    <header className="bg-white h-16 flex items-center justify-between px-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
            <button className="text-gray-600"><i className="fa-solid fa-bars"></i></button>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><i className="fa-solid fa-magnifying-glass"></i></span>
                <input type="search" placeholder="Search" className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
        </div>
        <div className="flex items-center gap-4 text-gray-600">
            <button><i className="fa-solid fa-sun"></i></button>
            <button><i className="fa-solid fa-moon"></i></button>
            <button><i className="fa-solid fa-bell"></i></button>
            <button><i className="fa-solid fa-user"></i></button>
        </div>
    </header>
);

const SummaryCard: React.FC<{
    title: string;
    value: string;
    unit: string;
    icon: React.ReactNode;
    color: string;
}> = ({ title, value, unit, icon, color }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-start justify-between">
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">
                {value} <span className="text-lg font-medium text-gray-600">{unit}</span>
            </p>
        </div>
        <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100').replace('-500', '-100')}`}>
            <div className={`${color} text-xl w-6 h-6 flex items-center justify-center`}>{icon}</div>
        </div>
    </div>
);

const TurbineStatusSummaryCard: React.FC<{
    counts: {
        producing: number;
        available: number;
        stopped: number;
        offline: number;
    }
}> = ({ counts }) => {
    const statusItems = [
        { name: 'Producing', count: counts.producing, icon: <i className="fa-solid fa-circle-check"></i>, color: 'text-green-500' },
        { name: 'Available', count: counts.available, icon: <i className="fa-solid fa-circle-info"></i>, color: 'text-blue-500' },
        { name: 'Stopped', count: counts.stopped, icon: <i className="fa-solid fa-circle-pause"></i>, color: 'text-yellow-500' },
        { name: 'Offline', count: counts.offline, icon: <i className="fa-solid fa-circle-xmark"></i>, color: 'text-red-500' },
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 font-semibold mb-3">Turbine Status</p>
            <div className="space-y-2">
                {statusItems.map(item => (
                    <div key={item.name} className="flex justify-between items-center text-sm">
                        <div className={`flex items-center gap-2 font-medium ${item.color}`}>
                            {item.icon}
                            <span>{item.name}</span>
                        </div>
                        <span className="font-bold text-gray-800">{item.count}</span>
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

    const selectedTurbine = turbines.find(t => t.id === selectedTurbineId);

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

    const summaryData = [
        { title: 'Active Power', value: totalActivePower.toFixed(1), unit: 'MW', icon: <i className="fa-solid fa-bolt"></i>, color: 'text-violet-600' },
        { title: 'Reactive Power', value: totalReactivePower.toFixed(1), unit: 'MVar', icon: <i className="fa-solid fa-bolt-lightning"></i>, color: 'text-cyan-500' },
        { title: 'Load Factor', value: loadFactor.toFixed(1), unit: '%', icon: <i className="fa-solid fa-gauge-high"></i>, color: 'text-purple-600' },
        { title: 'Production (Today)', value: productionTodayMWh.toFixed(1), unit: 'MWh', icon: <i className="fa-solid fa-solar-panel"></i>, color: 'text-green-600' },
    ];
     
    const summaryData2 = [
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
        <div className="flex h-screen bg-gray-100 text-gray-800 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto">
                    {selectedTurbine ? (
                        <TurbineDetailView turbine={selectedTurbine} onBack={handleCloseDetailView} />
                    ) : (
                        <>
                            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
                                {summaryData.map((data, index) => <SummaryCard key={data.title + index} {...data} />)}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
                                {summaryData2.map((data, index) => <SummaryCard key={data.title + index} {...data} />)}
                                <TurbineStatusSummaryCard counts={turbineStatusCounts} />
                            </div>
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <div className="pb-4 mb-4 border-b border-gray-200 flex justify-between items-center text-sm">
                                    <span className="font-semibold text-gray-700">
                                        {formattedDate} at {formattedTime}
                                    </span>
                                    <span className="text-gray-500">
                                        Last updated: {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                {turbines.map(turbine => (
                                        <TurbineCard key={turbine.id} turbine={turbine} onClick={() => handleSelectTurbine(turbine.id)} />
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