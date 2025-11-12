import React from 'react';

interface HeaderProps {
    onToggleSidebar: () => void;
    onUploadClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onUploadClick }) => (
    <header className="bg-white h-16 flex items-center justify-between px-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-4">
            <button onClick={onToggleSidebar} className="text-gray-600 hover:text-violet-600 transition-colors" aria-label="Toggle sidebar">
                <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><i className="fa-solid fa-magnifying-glass"></i></span>
                <input type="search" placeholder="Search" className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
        </div>
        <div className="flex items-center gap-6 text-gray-600">
             <div className="relative group">
                 <button onClick={onUploadClick} className="flex items-center gap-2 font-semibold text-gray-600 hover:text-violet-600 transition-colors" aria-label="Upload SCADA Data">
                    <i className="fa-solid fa-upload text-lg"></i>
                    <span className="hidden sm:inline">Upload Data</span>
                 </button>
                 <div className="absolute top-full mt-2 w-max max-w-sm p-3 -translate-x-1/2 left-1/2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-gray-800"></div>
                    <p className="mb-1 font-medium">Upload a CSV file with turbine data.</p>
                    <p className="font-bold">Required columns:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                        <code className="bg-gray-700 p-0.5 rounded text-violet-300 text-[11px]">Timestamp</code>
                        <code className="bg-gray-700 p-0.5 rounded text-violet-300 text-[11px]">Turbine ID</code>
                        <code className="bg-gray-700 p-0.5 rounded text-violet-300 text-[11px]">Status</code>
                        <code className="bg-gray-700 p-0.5 rounded text-violet-300 text-[11px]">ActivePower(MW)</code>
                        <code className="bg-gray-700 p-0.5 rounded text-violet-300 text-[11px]">ReactivePower(MVar)</code>
                        <code className="bg-gray-700 p-0.5 rounded text-violet-300 text-[11px]">WindSpeed(m/s)</code>
                        <code className="bg-gray-700 p-0.5 rounded text-violet-300 text-[11px]">Direction(°)</code>
                        <code className="bg-gray-700 p-0.5 rounded text-violet-300 text-[11px]">Temperature(°C)</code>
                        <code className="bg-gray-700 p-0.5 rounded text-violet-300 text-[11px]">RPM</code>
                        <code className="bg-gray-700 p-0.5 rounded text-violet-300 text-[11px]">MaxPower(MW)</code>
                    </div>
                </div>
             </div>
             <div className="h-6 w-px bg-gray-200"></div>
             <button className="hover:text-violet-600 transition-colors" aria-label="Light mode"><i className="fa-solid fa-sun text-lg"></i></button>
             <button className="hover:text-violet-600 transition-colors" aria-label="Dark mode"><i className="fa-solid fa-moon text-lg"></i></button>
             <button className="hover:text-violet-600 transition-colors" aria-label="Notifications"><i className="fa-solid fa-bell text-lg"></i></button>
             <button className="hover:text-violet-600 transition-colors" aria-label="User profile"><i className="fa-solid fa-user text-lg"></i></button>
        </div>
    </header>
);

export default Header;