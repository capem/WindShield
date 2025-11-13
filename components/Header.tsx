import React from 'react';
import { Alarm, AlarmSeverity } from '../types';

interface HeaderProps {
    onToggleSidebar: () => void;
    onUploadClick: () => void;
    unacknowledgedAlarms: Alarm[];
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onUploadClick, unacknowledgedAlarms, isDarkMode, onToggleDarkMode }) => {
    const count = unacknowledgedAlarms.length;
    let iconColor = 'text-slate-600 dark:text-slate-300';
    let hasCritical = false;
    let hasWarning = false;

    if (count > 0) {
        hasCritical = unacknowledgedAlarms.some(a => a.severity === AlarmSeverity.Critical);
        hasWarning = unacknowledgedAlarms.some(a => a.severity === AlarmSeverity.Warning);

        if (hasCritical) {
            iconColor = 'text-red-500 animate-pulse';
        } else if (hasWarning) {
            iconColor = 'text-yellow-500';
        } else {
            iconColor = 'text-blue-500';
        }
    }

    return (
        <header className="bg-white dark:bg-slate-800 h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={onToggleSidebar} className="text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors" aria-label="Toggle sidebar">
                    <i className="fa-solid fa-bars text-xl"></i>
                </button>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><i className="fa-solid fa-magnifying-glass"></i></span>
                    <input type="search" placeholder="Search" className="pl-10 pr-4 py-2 w-64 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                </div>
            </div>
            <div className="flex items-center gap-6 text-slate-600 dark:text-slate-300">
                 <div className="relative group">
                     <button onClick={onUploadClick} className="flex items-center gap-2 font-semibold text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors" aria-label="Upload SCADA Data">
                        <i className="fa-solid fa-upload text-lg"></i>
                        <span className="hidden sm:inline">Upload Data</span>
                     </button>
                     <div className="absolute top-full mt-2 w-max max-w-sm p-3 -translate-x-1/2 left-1/2 bg-slate-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-slate-800"></div>
                        <p className="mb-1 font-medium">Upload a CSV file with turbine data.</p>
                        <p className="font-bold">Required columns:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                            <code className="bg-slate-700 p-0.5 rounded text-violet-300 text-[11px]">Timestamp</code>
                            <code className="bg-slate-700 p-0.5 rounded text-violet-300 text-[11px]">Turbine ID</code>
                            <code className="bg-slate-700 p-0.5 rounded text-violet-300 text-[11px]">Status</code>
                            <code className="bg-slate-700 p-0.5 rounded text-violet-300 text-[11px]">ActivePower(MW)</code>
                            <code className="bg-slate-700 p-0.5 rounded text-violet-300 text-[11px]">ReactivePower(MVar)</code>
                            <code className="bg-slate-700 p-0.5 rounded text-violet-300 text-[11px]">WindSpeed(m/s)</code>
                            <code className="bg-slate-700 p-0.5 rounded text-violet-300 text-[11px]">Direction(°)</code>
                            <code className="bg-slate-700 p-0.5 rounded text-violet-300 text-[11px]">Temperature(°C)</code>
                            <code className="bg-slate-700 p-0.5 rounded text-violet-300 text-[11px]">RPM</code>
                            <code className="bg-slate-700 p-0.5 rounded text-violet-300 text-[11px]">MaxPower(MW)</code>
                        </div>
                    </div>
                 </div>
                 <div className="h-6 w-px bg-slate-200 dark:bg-slate-600"></div>
                 <button onClick={onToggleDarkMode} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors" aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
                    {isDarkMode ? (
                        <i className="fa-solid fa-sun text-lg"></i>
                    ) : (
                        <i className="fa-solid fa-moon text-lg"></i>
                    )}
                </button>
                 <button className={`relative hover:text-violet-600 dark:hover:text-violet-400 transition-colors ${iconColor}`} aria-label="Notifications">
                    <i className="fa-solid fa-bell text-lg"></i>
                    {count > 0 && (
                        <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border-2 border-white">
                            {count}
                        </span>
                    )}
                 </button>
                 <button className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors" aria-label="User profile"><i className="fa-solid fa-user text-lg"></i></button>
            </div>
        </header>
    );
}

export default Header;