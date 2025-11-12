import React from 'react';
import { Turbine, TurbineStatus } from '../types';

interface TurbineCardProps {
  turbine: Turbine;
  onClick: () => void;
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
        <svg viewBox="0 0 24 24" className={`w-16 h-16 ${baseColor}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Tower */}
            <path d="M12 22 L11 12.5 h2 L12 22" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" />
            {/* Blades */}
            {blades}
            {/* Hub */}
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
    );
};


const TurbineCard: React.FC<TurbineCardProps> = ({ turbine, onClick }) => {
    const statusConfig = {
        [TurbineStatus.Producing]: { text: 'Producing', textColor: 'text-green-700', bgColor: 'bg-green-100', borderColor: 'border-green-500' },
        [TurbineStatus.Available]: { text: 'Available', textColor: 'text-blue-700', bgColor: 'bg-blue-100', borderColor: 'border-blue-500' },
        [TurbineStatus.Offline]: { text: 'Offline', textColor: 'text-red-700', bgColor: 'bg-red-100', borderColor: 'border-red-500' },
        [TurbineStatus.Stopped]: { text: 'Stopped', textColor: 'text-yellow-700', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-500' },
    };

    const config = statusConfig[turbine.status];

    return (
        <button onClick={onClick} className={`bg-white rounded-lg p-3 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${config.borderColor} border-l-4 flex flex-col justify-between text-left w-full`}>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-800 text-sm">{turbine.id}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.bgColor} ${config.textColor}`}>
                        {config.text}
                    </span>
                </div>
                <div className="flex justify-center items-center my-3 h-16">
                    <AnimatedTurbineIcon status={turbine.status} activePower={turbine.activePower} maxPower={turbine.maxPower} />
                </div>
            </div>
            
            <div className="text-xs text-center space-y-1 mt-2">
                <div>
                    <p className="text-gray-500">Active Power</p>
                    <p className="font-semibold text-gray-900 text-sm">
                        {turbine.activePower !== null ? `${turbine.activePower.toFixed(1)} MW` : '—'}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500">Wind Speed</p>
                    <p className="font-semibold text-gray-900 text-sm">
                        {turbine.windSpeed !== null ? `${turbine.windSpeed.toFixed(1)} m/s` : '—'}
                    </p>
                </div>
            </div>
        </button>
    );
};

export default TurbineCard;