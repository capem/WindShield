import React, { useState, useEffect } from 'react';
import { Turbine, TurbineStatus } from '../types';
import { getTurbineStatusDescription } from '../services/geminiService';

interface TurbineDetailViewProps {
  turbine: Turbine;
  onBack: () => void;
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

const TurbineDetailView: React.FC<TurbineDetailViewProps> = ({ turbine, onBack }) => {
    const [aiStatus, setAiStatus] = useState<string>('Generating analysis...');
    const [isLoadingAi, setIsLoadingAi] = useState(true);
    
    useEffect(() => {
        const fetchStatus = async () => {
            if (turbine.status === TurbineStatus.Producing && turbine.rpm !== null && turbine.temperature !== null && turbine.activePower !== null) {
                setIsLoadingAi(true);
                try {
                    const description = await getTurbineStatusDescription(turbine.rpm, turbine.temperature, turbine.activePower);
                    setAiStatus(description);
                } catch (error) {
                    setAiStatus("Could not retrieve AI analysis.");
                } finally {
                    setIsLoadingAi(false);
                }
            } else {
                let statusMessage = "Turbine is not producing. No data available for analysis.";
                if (turbine.status === TurbineStatus.Offline) {
                    statusMessage = "Turbine is offline. No data available for analysis.";
                } else if (turbine.status === TurbineStatus.Available) {
                    statusMessage = "Turbine is available but not producing. No data for analysis.";
                } else if (turbine.status === TurbineStatus.Stopped) {
                    statusMessage = "Turbine is stopped. No data for analysis.";
                }
                setAiStatus(statusMessage);
                setIsLoadingAi(false);
            }
        };

        fetchStatus();
    }, [turbine]);

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

            <div className="bg-white rounded-lg shadow-sm p-6">
                 <h3 className="font-semibold text-gray-700 mb-2">AI-Powered Status Analysis</h3>
                 <div className={`p-4 rounded-md ${isLoadingAi ? 'bg-gray-50' : 'bg-violet-50'}`}>
                    {isLoadingAi ? (
                        <div className="flex items-center gap-3">
                             <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-violet-500"></div>
                            <p className="text-gray-500 italic">{aiStatus}</p>
                        </div>
                    ) : (
                        <p className="text-gray-800">{aiStatus}</p>
                    )}
                 </div>
                 <p className="text-xs text-right text-gray-400 mt-2">Powered by Gemini</p>
            </div>
        </div>
    );
};

export default TurbineDetailView;