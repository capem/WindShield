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
    { id: 'T 012', status: TurbineStatus.Available, activePower: 0.0, maxPower: 4.0, reactivePower: 0.0, windSpeed: 3.1, direction: 159, temperature: 11, rpm: 0 },
];


// --- SVG ICONS ---
const Icon = ({ path, className = 'w-6 h-6' }: { path: string, className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={path} /></svg>;
const DashboardIcon = () => <Icon path="M3 10h18M3 14h18M3 6h18M3 18h18" />;
const MenuIcon = () => <Icon path="M4 6h16M4 12h16M4 18h16" />;
const SearchIcon = () => <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />;
const SunIcon = () => <Icon path="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />;
const MoonIcon = () => <Icon path="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />;
const BellIcon = () => <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />;
const UserIcon = () => <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />;
const LightningIcon = ({ className = 'w-6 h-6' }) => <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className={className} />;
const WindIcon = ({ className = 'w-6 h-6' }) => <Icon path="M4 4v.01M4 8v.01M4 12v.01M4 16v.01M4 20v.01M8 4v.01M8 8v.01M8 12v.01M8 16v.01M8 20v.01M12 4v.01M12 8v.01M12 12v.01M12 16v.01M12 20v.01M16 4v.01M16 8v.01M16 12v.01M16 16v.01M16 20v.01M20 4v.01M20 8v.01M20 12v.01M20 16v.01M20 20v.01" className={className} />;

// --- UI COMPONENTS ---

const Sidebar = () => (
    <aside className="w-64 bg-white shadow-md flex-shrink-0">
        <div className="p-6 text-2xl font-bold text-gray-800">168X40</div>
        <nav className="mt-6 px-4">
            <a href="#" className="flex items-center gap-4 px-4 py-3 text-violet-600 bg-violet-50 rounded-lg">
                <DashboardIcon />
                <span className="font-semibold">Dashboard</span>
            </a>
        </nav>
    </aside>
);

const Header = () => (
    <header className="bg-white h-16 flex items-center justify-between px-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
            <button className="text-gray-600"><MenuIcon /></button>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                <input type="search" placeholder="Search" className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
        </div>
        <div className="flex items-center gap-4 text-gray-600">
            <button><SunIcon /></button>
            <button><MoonIcon /></button>
            <button><BellIcon /></button>
            <button><UserIcon /></button>
        </div>
    </header>
);

const SummaryCard: React.FC<{
    title: string;
    value: string;
    unit: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
}> = ({ title, value, unit, subtitle, icon, color }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-start justify-between">
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">
                {value} <span className="text-lg font-medium text-gray-600">{unit}</span>
            </p>
            <p className={`text-xs font-semibold ${color}`}>{subtitle}</p>
        </div>
        <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100').replace('-500', '-100')}`}>
            <div className={`${color}`}>{icon}</div>
        </div>
    </div>
);

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

    const totalActivePower = turbines.reduce((sum, t) => sum + (t.activePower || 0), 0);
    const producingReactivePower = turbines.filter(t => t.status === TurbineStatus.Producing).reduce((sum, t) => sum + (t.reactivePower || 0), 0);
    const availableReactivePower = turbines.filter(t => t.status === TurbineStatus.Available).reduce((sum, t) => sum + (t.reactivePower || 0), 0);
    const offlineReactivePower = turbines.filter(t => t.status === TurbineStatus.Offline).length;
    const loadFactor = totalActivePower / turbines.reduce((sum, t) => sum + (t.status !== TurbineStatus.Offline ? t.maxPower : 0), 0) * 10.14;
    const averageWindSpeed = turbines.filter(t => t.windSpeed !== null).reduce((sum, t, _, arr) => sum + (t.windSpeed! / arr.length), 0);

    const summaryData = [
        { title: 'Puissance active', value: totalActivePower.toFixed(1), unit: 'MW', subtitle: '', icon: <LightningIcon />, color: 'text-violet-600' },
        { title: 'Puissance réactive', value: producingReactivePower.toFixed(1), unit: 'MVar', subtitle: 'Producing', icon: <LightningIcon />, color: 'text-green-600' },
        { title: 'Puissance réactive', value: availableReactivePower.toFixed(1), unit: 'MVar', subtitle: 'Available', icon: <LightningIcon />, color: 'text-blue-600' },
        { title: 'Puissance réactive', value: '0,0', unit: 'MVar', subtitle: 'Stopped', icon: <LightningIcon />, color: 'text-yellow-600' },
        { title: 'Puissance réactive', value: offlineReactivePower.toFixed(0), unit: 'Offline', subtitle: '', icon: <LightningIcon />, color: 'text-red-600' },
        { title: 'Facteur de charge', value: loadFactor.toFixed(2), unit: 'MW', subtitle: '', icon: <div className="font-bold text-lg">›</div>, color: 'text-purple-600' },
        { title: 'Vitesse moyenne du vent', value: averageWindSpeed.toFixed(1), unit: 'm/s', subtitle: '', icon: <WindIcon />, color: 'text-pink-500' },
        { title: 'Température', value: '12', unit: '°C', subtitle: '', icon: <Icon path="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0zM12 11a2 2 0 100-4 2 2 0 000 4z" />, color: 'text-indigo-500' },
    ];
    
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 my-6">
                                {summaryData.slice(0, 5).map(data => <SummaryCard key={data.title + data.subtitle} {...data} />)}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
                                {summaryData.slice(5).map(data => <SummaryCard key={data.title + data.subtitle} {...data} />)}
                            </div>
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <div className="pb-4 mb-4 border-b border-gray-200 flex justify-between items-center text-sm">
                                    <span className="font-semibold text-gray-700">
                                        {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} à {currentTime.toLocaleTimeString('fr-FR')}
                                    </span>
                                    <span className="text-gray-500">
                                        Dernière mise à jour : {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
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