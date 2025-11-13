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
        <aside className={`bg-white dark:bg-gray-800 shadow-md flex-shrink-0 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className={`p-6 text-2xl font-bold text-gray-800 dark:text-gray-100 transition-all duration-300 text-center ${isCollapsed ? 'py-4' : ''}`}>
                {isCollapsed ? (
                    <i className="fa-solid fa-wind text-violet-600"></i>
                ) : (
                    <span>168X40</span>
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
                        className={`relative flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 group ${
                            activeItem === item.id
                                ? 'bg-violet-50 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        aria-label={item.label}
                    >
                        <i className={`fa-solid ${item.icon} w-6 text-center text-xl`}></i>
                        <span className={`font-semibold whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                            {item.label}
                        </span>
                        {isCollapsed && (
                             <span className="absolute left-full ml-4 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-gray-800 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 z-10">
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
