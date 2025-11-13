import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

// Props for the main component
interface SettingsViewProps {
    isCompactView: boolean;
    setIsCompactView: (value: boolean) => void;
    isSidebarCollapsed: boolean;
    setIsSidebarCollapsed: (value: boolean) => void;
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
}

// Reusable Toggle Switch component
const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; id: string; }> = ({ checked, onChange, id }) => {
    return (
        <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
            <input
                type="checkbox"
                id={id}
                className="sr-only peer"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <label
                htmlFor={id}
                className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors transition-theme ${checked ? 'bg-violet-500' : 'bg-gray-300 dark:bg-gray-700'}`}
            >
            </label>
            <span className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${checked ? 'translate-x-4' : ''}`}></span>
        </div>
    );
};

// Reusable Setting Row component
const SettingRow: React.FC<{ title: string; description: string; children: React.ReactNode; }> = ({ title, description, children }) => (
    <div className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-theme">
        <div>
            <h4 className="font-semibold text-gray-800 dark:text-white">{title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div>{children}</div>
    </div>
);

const CardSizePreview: React.FC<{
    title: string;
    isSelected: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ title, isSelected, onClick, children }) => (
    <div className="text-center w-40">
        <button
            onClick={onClick}
            className={`rounded-lg p-3 border-2 transition-all duration-200 w-full h-36 flex flex-col items-center justify-center shadow-sm transition-theme ${
                isSelected
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30 scale-105'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/50 hover:border-violet-400 dark:hover:border-violet-600'
            }`}
        >
            {children}
        </button>
        <p className={`mt-2 text-sm font-semibold transition-colors transition-theme ${isSelected ? 'text-violet-600 dark:text-violet-400' : 'text-gray-600 dark:text-gray-400'}`}>
            {title}
        </p>
    </div>
);

const PreviewTurbineIcon: React.FC = () => (
     <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22 L11 12.5 h2 L12 22" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" />
        <g className="origin-center">
            <path d="M12 12 L12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 12 L20.66 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 12 L3.34 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
);


// Main Settings View component
const SettingsView: React.FC<SettingsViewProps> = ({
    isCompactView,
    setIsCompactView,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isDarkMode,
    setIsDarkMode,
}) => {
    const { setDarkMode } = useTheme();
    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 dark:text-white transition-theme">Settings</h1>
            <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-black transition-theme">
                <h2 className="text-xl font-bold text-gray-800 mb-2 pb-3 border-b-2 border-violet-200 dark:text-white dark:border-violet-700 transition-theme">Appearance</h2>
                
                <SettingRow title="Theme" description="Switch between light and dark visual modes.">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setDarkMode(false)} className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm transition-theme ${!isDarkMode ? 'bg-violet-500 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}>
                            <i className="fa-solid fa-sun mr-2"></i> Light
                        </button>
                        <button onClick={() => setDarkMode(true)} className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm transition-theme ${isDarkMode ? 'bg-violet-500 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}>
                            <i className="fa-solid fa-moon mr-2"></i> Dark
                        </button>
                    </div>
                </SettingRow>

                <div className="py-4 border-b border-gray-200 dark:border-gray-700 transition-theme">
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white">Turbine Card Size</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose the display size for turbine cards on the dashboard.</p>
                    </div>
                    <div className="flex justify-center items-start gap-8 mt-2">
                        <CardSizePreview title="Expanded" isSelected={!isCompactView} onClick={() => setIsCompactView(false)}>
                            <div className="w-full text-center space-y-2 bg-white dark:bg-gray-900 p-2 rounded-md transition-theme">
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">T 001</p>
                                <div className="w-10 h-10 mx-auto">
                                   <PreviewTurbineIcon />
                                </div>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">Active Power</p>
                                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">2.1 MW</p>
                            </div>
                        </CardSizePreview>
                        <CardSizePreview title="Compact" isSelected={isCompactView} onClick={() => setIsCompactView(true)}>
                             <div className="w-full h-full text-left bg-white dark:bg-gray-900 p-2 rounded-md flex flex-col justify-between transition-theme">
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">T 001</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-8 h-8 flex-shrink-0">
                                        <PreviewTurbineIcon />
                                    </div>
                                    <div className="text-xs space-y-1">
                                         <div>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Power</p>
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">2.1 MW</p>
                                        </div>
                                         <div>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Wind</p>
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">12 m/s</p>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </CardSizePreview>
                    </div>
                </div>

                <SettingRow title="Default Sidebar State" description="Set the sidebar to be collapsed by default.">
                     <ToggleSwitch id="sidebar-toggle" checked={isSidebarCollapsed} onChange={setIsSidebarCollapsed} />
                </SettingRow>
            </div>
        </div>
    );
};

export default SettingsView;
