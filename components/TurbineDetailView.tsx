import React, { useMemo } from 'react';
import { Turbine, TurbineStatus } from '../types';

interface TurbineDetailViewProps {
  turbine: Turbine;
  onBack: () => void;
  historicalData?: any[];
}

const statusConfig = {
    [TurbineStatus.Producing]: { text: 'Producing', textColor: 'text-green-700', bgColor: 'bg-green-100', borderColor: 'border-green-500' },
    [TurbineStatus.Available]: { text: 'Available', textColor: 'text-blue-700', bgColor: 'bg-blue-100', borderColor: 'border-blue-500' },
    [TurbineStatus.Offline]: { text: 'Offline', textColor: 'text-red-700', bgColor: 'bg-red-100', borderColor: 'border-red-500' },
    [TurbineStatus.Stopped]: { text: 'Stopped', textColor: 'text-yellow-700', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-500' },
};

const MetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100').replace('-500', '-100')}`}>
            <div className={`${color} text-2xl w-8 h-8 flex items-center justify-center`}>{icon}</div>
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


const HistoricalChart: React.FC<{ title: string; data: number[]; unit: string; color: string; maxVal: number }> = ({ title, data, unit, color, maxVal }) => {
    const width = 300;
    const height = 100;

    if (!data || data.length === 0) return (
        <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-center h-[150px]">
             <p className="text-gray-500">No historical data available.</p>
        </div>
    );

    const maxDataVal = maxVal > 0 ? maxVal : Math.max(...data) > 0 ? Math.max(...data) : 1;

    const points = data.map((val, i) => {
        const x = data.length > 1 ? (i / (data.length - 1)) * width : width / 2;
        const y = height - (val / maxDataVal) * height;
        return `${x},${y}`;
    }).join(' ');

    const areaPath = `M${points} L${width},${height} L0,${height} Z`;
    const linePath = `M${points}`;

    const gradientId = `gradient-${color.replace(/\s/g, '-')}`;

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-semibold text-gray-700">{title}</h4>
                <p className="text-sm font-bold" style={{ color: color }}>
                    {data[data.length - 1].toFixed(1)} <span className="font-medium text-gray-500">{unit}</span>
                </p>
            </div>
            <div className="relative">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={areaPath} fill={`url(#${gradientId})`} />
                    <path d={linePath} fill="none" stroke={color} strokeWidth="2" />
                </svg>
                <div className="absolute top-0 left-0 text-xs text-gray-400">{maxDataVal.toFixed(0)}</div>
                <div className="absolute bottom-0 left-0 text-xs text-gray-400">0</div>
                <div className="absolute bottom-0 right-0 text-xs text-gray-400">Now</div>
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-gray-400">12h ago</div>
                <div className="absolute bottom-0 left-0 text-xs text-gray-400">24h ago</div>
            </div>
        </div>
    );
};

const generateHistoricalData = (turbine: Turbine): { power: number[], wind: number[], rpm: number[] } => {
    const dataPoints = 24;
    const power: number[] = [];
    const wind: number[] = [];
    const rpm: number[] = [];

    if (turbine.status !== TurbineStatus.Producing) {
        return {
            power: Array(dataPoints).fill(0),
            wind: Array(dataPoints).fill(turbine.windSpeed ?? 0),
            rpm: Array(dataPoints).fill(0),
        };
    }
    
    for (let i = 0; i < dataPoints; i++) {
        const factor = Math.sin((i / dataPoints) * Math.PI * 2 - Math.PI / 2) * 0.4 + 0.6; // Simulate daily cycle
        const randomFluctuation = 1 + (Math.random() - 0.5) * 0.2;
        
        const p = Math.max(0, Math.min(turbine.maxPower, (turbine.activePower ?? 0) * factor * randomFluctuation));
        power.push(p);

        const w = Math.max(0, Math.min(25, (turbine.windSpeed ?? 0) * factor * randomFluctuation)); // Cap at cut-out speed
        wind.push(w);

        let r = 0;
        if (p > 0.1) { // Only have RPM if producing power
            const powerRatio = p / turbine.maxPower;
            r = 6 + powerRatio * (16 - 6); // Base RPM on generated power for consistency
            r *= randomFluctuation;
        }
        r = Math.max(0, Math.min(16, r)); // Cap RPM between 0 and 16
        rpm.push(r);
    }
    return { power, wind, rpm };
};

const TurbineDetailView: React.FC<TurbineDetailViewProps> = ({ turbine, onBack, historicalData }) => {
    const chartData = useMemo(() => {
        if (historicalData && historicalData.length > 0) {
            const reversedData = [...historicalData].reverse();
            return {
                power: reversedData.map(d => parseFloat(d['ActivePower(MW)']) || 0),
                wind: reversedData.map(d => parseFloat(d['WindSpeed(m/s)']) || 0),
                rpm: reversedData.map(d => parseFloat(d['RPM']) || 0),
            };
        }
        return generateHistoricalData(turbine);
    }, [turbine, historicalData]);

    const config = statusConfig[turbine.status];
    const powerPercentage = turbine.activePower !== null ? (turbine.activePower / turbine.maxPower) * 100 : 0;

    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4">
                <i className="fa-solid fa-arrow-left"></i>
                Back to Dashboard
            </button>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Turbine {turbine.id}</h1>
                        <p className="text-gray-500">Detailed operational metrics and status.</p>
                    </div>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${config.bgColor} ${config.textColor}`}>{config.text}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2 lg:col-span-3 bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-700 mb-1">Active Power Output</h3>
                    <p className="text-3xl font-bold text-gray-800 mb-2">{turbine.activePower?.toFixed(2) ?? 'N/A'} <span className="text-xl font-medium text-gray-500">MW</span></p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${powerPercentage}%` }}></div>
                    </div>
                    <p className="text-right text-sm text-gray-500 mt-1">{powerPercentage.toFixed(0)}% of max power ({turbine.maxPower} MW)</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
                <MetricCard title="Reactive Power" value={turbine.reactivePower !== null ? `${turbine.reactivePower} MVar` : '—'} icon={<i className="fa-solid fa-bolt-lightning"></i>} color="text-blue-500" />
                <MetricCard title="Wind Speed" value={turbine.windSpeed !== null ? `${turbine.windSpeed} m/s` : '—'} icon={<i className="fa-solid fa-wind"></i>} color="text-pink-500" />
                <MetricCard title="Direction" value={turbine.direction !== null ? `${turbine.direction}°` : '—'} icon={<i className="fa-solid fa-compass"></i>} color="text-teal-500" />
                <MetricCard title="Temperature" value={turbine.temperature !== null ? `${turbine.temperature}°C` : '—'} icon={<i className="fa-solid fa-temperature-half"></i>} color="text-orange-500" />
                <MetricCard title="RPM" value={turbine.rpm !== null ? `${turbine.rpm}` : '—'} icon={<i className="fa-solid fa-arrows-spin"></i>} color="text-indigo-500" />
            </div>
            
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Historical Performance (Last 24h)</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <HistoricalChart title="Power Output" data={chartData.power} unit="MW" color="#10b981" maxVal={turbine.maxPower} />
                    <HistoricalChart title="Wind Speed" data={chartData.wind} unit="m/s" color="#ec4899" maxVal={30} />
                    <HistoricalChart title="Rotor Speed" data={chartData.rpm} unit="RPM" color="#6366f1" maxVal={20} />
                </div>
            </div>
        </div>
    );
};

export default TurbineDetailView;