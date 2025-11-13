import React from 'react';

interface SidebarProps {
    isCollapsed: boolean;
    activeItem: string;
    onNavigate: (itemId: string) => void;
}

const menuItems = [
    { id: 'dashboard', icon: 'fa-table-cells-large', label: 'Dashboard' },
    { id: 'analytics', icon: 'fa-chart-pie', label: 'Analytics' },
    { id: 'map', icon: 'fa-map-location-dot', label: 'Map View' },
    { id: 'reports', icon: 'fa-file-lines', label: 'Reports' },
    { id: 'settings', icon: 'fa-gear', label: 'Settings' },
];


const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, activeItem, onNavigate }) => {
    return (
        <aside className={`bg-white dark:bg-black shadow-md flex-shrink-0 flex flex-col transition-all duration-300 transition-theme ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className={`p-6 text-2xl font-bold text-slate-800 dark:text-white transition-all duration-300 text-center ${isCollapsed ? 'py-4' : ''} transition-theme`}>
                {isCollapsed ? (
                    <i className="fa-solid fa-wind text-violet-600"></i>
                ) : (
                    <span>WindGrid</span>
                )}
            </div>
            <nav className="mt-6 px-4 space-y-2">
                {menuItems.map(item => (
                    <a
                        key={item.id}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onNavigate(item.id);
                        }}
                        className={`relative flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 group transition-theme ${
                            activeItem === item.id
                                ? 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400'
                                : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-900'
                        }`}
                        aria-label={item.label}
                    >
                        {activeItem === item.id && (
                            <div className="absolute left-0 top-2 bottom-2 w-1 bg-violet-600 dark:bg-violet-400 rounded-r-full transition-theme"></div>
                        )}
                        <i className={`fa-solid ${item.icon} w-6 text-center text-xl`}></i>
                        <span className={`font-semibold whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                            {item.label}
                        </span>
                        {isCollapsed && (
                             <span className="absolute left-full ml-4 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-gray-900 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 z-10 transition-theme">
                                {item.label}
                            </span>
                        )}
                    </a>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;