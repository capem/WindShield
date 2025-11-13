import React from 'react';
import { Turbine, TurbineStatus, AlarmSeverity } from '../types';

interface TurbineCardProps {
  turbine: Turbine;
  onClick: () => void;
  isCompact?: boolean;
  activeAlarmSeverity?: AlarmSeverity | null;
}

const AnimatedTurbineIcon: React.FC<{ status: TurbineStatus; activePower: number | null; maxPower: number }> = ({ status, activePower, maxPower }) => {
    const baseColor = {
        [TurbineStatus.Producing]: 'text-green-500',
        [TurbineStatus.Available]: 'text-blue-500',
        [TurbineStatus.Offline]: 'text-red-400',
        [TurbineStatus.Stopped]: 'text-yellow-500',
    }[status];

    let animationStyle: React.CSSProperties = {};

    if (status === TurbineStatus.Producing && activePower && maxPower) {
        // Faster spin for higher power output. Duration from 4s (low power) to 0.5s (max power)
        const powerRatio = activePower / maxPower;
        const duration = Math.max(0.5, 4 - powerRatio * 3.5);
        animationStyle = { animation: `spin ${duration.toFixed(2)}s linear infinite` };
    } else if (status === TurbineStatus.Available) {
        animationStyle = { animation: 'spin 12s linear infinite' };
    }

    const blades = (
        <g style={animationStyle} className="origin-center">
            <path d="M12 12 L12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 12 L20.66 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 12 L3.34 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </g>
    );

    return (
        <svg viewBox="0 0 24 24" className={`w-full h-full ${baseColor}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Tower */}
            <path d="M12 22 L11 12.5 h2 L12 22" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" />
            {/* Blades */}
            {blades}
            {/* Hub */}
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
    );
};


const TurbineCard: React.FC<TurbineCardProps> = ({ turbine, onClick, isCompact = false, activeAlarmSeverity = null }) => {
    const statusConfig = {
        [TurbineStatus.Producing]: { text: 'Producing', classes: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50 border-green-500' },
        [TurbineStatus.Available]: { text: 'Available', classes: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 border-blue-500' },
        [TurbineStatus.Offline]: { text: 'Offline', classes: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 border-red-500' },
        [TurbineStatus.Stopped]: { text: 'Stopped', classes: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/50 border-yellow-500' },
    };

    const alarmConfig: { [key in AlarmSeverity]: { icon: string; color: string } } = {
        [AlarmSeverity.Critical]: { icon: 'fa-triangle-exclamation', color: 'text-red-500' },
        [AlarmSeverity.Warning]: { icon: 'fa-triangle-exclamation', color: 'text-yellow-500' },
        [AlarmSeverity.Info]: { icon: 'fa-circle-info', color: 'text-blue-500' },
    };

    const config = statusConfig[turbine.status];
    const statusClasses = config.classes.split(' ').filter(c => !c.startsWith('border-'));
    const borderClass = config.classes.split(' ').find(c => c.startsWith('border-'));

    if (isCompact) {
        return (
            <button onClick={onClick} className={`bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${borderClass} border-l-4 flex flex-col justify-between text-left w-full h-full`}>
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                        {activeAlarmSeverity && (
                            <i className={`fa-solid ${alarmConfig[activeAlarmSeverity].icon} ${alarmConfig[activeAlarmSeverity].color}`} title={`${activeAlarmSeverity} Alarm Active`}></i>
                        )}
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 text-xs">{turbine.id}</h3>
                    </div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusClasses.join(' ')}`}>
                        {config.text}
                    </span>
                </div>
                <div className="flex items-center justify-around gap-2 mt-1 flex-grow">
                    <div className="w-10 h-10 flex-shrink-0">
                        <AnimatedTurbineIcon status={turbine.status} activePower={turbine.activePower} maxPower={turbine.maxPower} />
                    </div>
                    <div className="text-xs text-center space-y-0.5">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-[10px]">Active Power</p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100 text-xs">
                                {turbine.activePower !== null ? `${turbine.activePower.toFixed(1)} MW` : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-[10px]">Wind Speed</p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100 text-xs">
                                {turbine.windSpeed !== null ? `${turbine.windSpeed.toFixed(1)} m/s` : '—'}
                            </p>
                        </div>
                    </div>
                </div>
            </button>
        );
    }

    return (
        <button onClick={onClick} className={`bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${borderClass} border-l-4 flex flex-col justify-between text-left w-full`}>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        {activeAlarmSeverity && (
                            <i className={`fa-solid ${alarmConfig[activeAlarmSeverity].icon} ${alarmConfig[activeAlarmSeverity].color}`} title={`${activeAlarmSeverity} Alarm Active`}></i>
                        )}
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{turbine.id}</h3>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusClasses.join(' ')}`}>
                        {config.text}
                    </span>
                </div>
                <div className="flex justify-center items-center my-3 h-16">
                    <div className="w-16 h-16">
                        <AnimatedTurbineIcon status={turbine.status} activePower={turbine.activePower} maxPower={turbine.maxPower} />
                    </div>
                </div>
            </div>
            
            <div className="text-xs text-center space-y-1 mt-2">
                <div>
                    <p className="text-gray-500 dark:text-gray-400">Active Power</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {turbine.activePower !== null ? `${turbine.activePower.toFixed(1)} MW` : '—'}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500 dark:text-gray-400">Wind Speed</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {turbine.windSpeed !== null ? `${turbine.windSpeed.toFixed(1)} m/s` : '—'}
                    </p>
                </div>
            </div>
        </button>
    );
};

export default TurbineCard;
