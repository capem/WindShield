import React from 'react';

interface HeaderProps {
    onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => (
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
        <div className="flex items-center gap-4 text-gray-600">
             <button className="hover:text-violet-600 transition-colors" aria-label="Light mode"><i className="fa-solid fa-sun text-lg"></i></button>
             <button className="hover:text-violet-600 transition-colors" aria-label="Dark mode"><i className="fa-solid fa-moon text-lg"></i></button>
             <button className="hover:text-violet-600 transition-colors" aria-label="Notifications"><i className="fa-solid fa-bell text-lg"></i></button>
             <button className="hover:text-violet-600 transition-colors" aria-label="User profile"><i className="fa-solid fa-user text-lg"></i></button>
        </div>
    </header>
);

export default Header;
