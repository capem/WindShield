import React, { useMemo, useState } from 'react';
import { Turbine, TurbineStatus, Alarm, AlarmSeverity } from '../types';

interface TurbineDetailViewProps {
  turbine: Turbine;
  onBack: () => void;
  historicalData?: any[];
  alarms: Alarm[];
  onAcknowledgeAlarm: (alarmId: string) => void;
}

const statusConfig = {
    [TurbineStatus.Producing]: { text: 'Producing', classes: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50' },
    [TurbineStatus.Available]: { text: 'Available', classes: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50' },
    [TurbineStatus.Offline]: { text: 'Offline', classes: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50' },
    [TurbineStatus.Stopped]: { text: 'Stopped', classes: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/50' },
};

const PowerGauge: React.FC<{ power: number; nominalMaxPower: number }> = ({ power, nominalMaxPower }) => {
    const GAUGE_MAX_POWER_FACTOR = 1.15;
    const GAUGE_RADIUS = 85;
    const GAUGE_WIDTH = 22;
    const VIEW_BOX_WIDTH = 200;
    const VIEW_BOX_HEIGHT = 125;
    const CX = VIEW_BOX_WIDTH / 2;
    const CY = VIEW_BOX_HEIGHT - 20;

    const gaugeMax = nominalMaxPower * GAUGE_MAX_POWER_FACTOR;
    const clampedPower = Math.max(0, Math.min(power, gaugeMax));
    const powerPercentage = nominalMaxPower > 0 ? (power / nominalMaxPower) * 100 : 0;

    const getAngle = (value: number) => (value / gaugeMax) * 180 - 90;

    const needleAngle = getAngle(clampedPower);
    const nominalMaxAngle = getAngle(nominalMaxPower);

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians),
        };
    };

    const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    };

    const powerValueColor = power > nominalMaxPower ? 'text-amber-500' : 'text-green-500';
    const majorTicksValues = [0, 0.5, 1.0, 1.5, 2.0, 2.5];

    return (
        <div className="relative w-full max-w-sm mx-auto">
            <svg viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`} className="w-full overflow-visible">
                <defs>
                    <linearGradient id="gaugeGreenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" /> <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                    <linearGradient id="gaugeAmberGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" /> <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                    <radialGradient id="hubGradient">
                        <stop offset="0%" stopColor="#f9fafb" />
                        <stop offset="100%" stopColor="#d1d5db" />
                    </radialGradient>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.1" />
                    </filter>
                     <filter id="text-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                
                <g filter="url(#shadow)">
                    {/* Gauge Background Arc */}
                    <path d={describeArc(CX, CY, GAUGE_RADIUS, -90, 90)} strokeWidth={GAUGE_WIDTH} className="stroke-slate-200 dark:stroke-slate-700" fill="none" />
                    <path d={describeArc(CX, CY, GAUGE_RADIUS, -90, 90)} strokeWidth={GAUGE_WIDTH} stroke="black" strokeOpacity="0.05" fill="none" style={{mixBlendMode: 'multiply'}} />


                    {/* Gauge Value Arcs */}
                    <path d={describeArc(CX, CY, GAUGE_RADIUS, -90, Math.min(needleAngle, nominalMaxAngle))} strokeWidth={GAUGE_WIDTH} stroke="url(#gaugeGreenGradient)" fill="none" style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.23, 1, 0.32, 1)' }} />
                    {clampedPower > nominalMaxPower && (
                        <path d={describeArc(CX, CY, GAUGE_RADIUS, nominalMaxAngle, needleAngle)} strokeWidth={GAUGE_WIDTH} stroke="url(#gaugeAmberGradient)" fill="none" style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.23, 1, 0.32, 1)' }}/>
                    )}
                </g>

                {/* Ticks and Labels */}
                {majorTicksValues.map(value => {
                    if (value > gaugeMax) return null;
                    const angle = getAngle(value);
                    const labelPos = polarToCartesian(CX, CY, GAUGE_RADIUS + 12, angle);
                    return (
                        <text key={`tick-label-${value}`} x={labelPos.x} y={labelPos.y} textAnchor="middle" alignmentBaseline="central" className="text-[9px] font-semibold fill-slate-500 dark:fill-slate-400">
                            {value.toFixed(1)}
                        </text>
                    );
                })}
                
                {/* Needle */}
                <g transform={`rotate(${needleAngle} ${CX} ${CY})`} style={{ transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' }}>
                    <path d={`M ${CX} ${CY - GAUGE_RADIUS + GAUGE_WIDTH/2 - 2} L ${CX} ${CY - 8}`} className="stroke-slate-800 dark:stroke-slate-200" strokeWidth="2" strokeLinecap="round" filter="url(#shadow)"/>
                </g>
                <circle cx={CX} cy={CY} r="8" fill="url(#hubGradient)" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="0.5"/>
                <circle cx={CX} cy={CY} r="4" className="fill-slate-700 dark:fill-slate-300" />
            </svg>
            <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className={`text-5xl font-bold ${powerValueColor}`} style={{ textShadow: `0 0 15px var(--tw-shadow-color)` }} >
                    {power.toFixed(2)}
                    <span className="text-xl font-medium text-slate-500 dark:text-slate-400 ml-2">MW</span>
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">{powerPercentage.toFixed(0)}% of nominal</p>
            </div>
        </div>
    );
};


const MetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-500', '-100')} dark:bg-opacity-10`}>
            <div className={`${color} text-2xl w-8 h-8 flex items-center justify-center`}>{icon}</div>
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
    </div>
);

const HistoricalChart: React.FC<{ title: string; data: number[]; unit: string; color: string; maxVal: number }> = ({ title, data, unit, color, maxVal }) => {
    const width = 300;
    const height = 100;
    const [hoverData, setHoverData] = useState<{ x: number; y: number; value: number; index: number } | null>(null);

    if (!data || data.length === 0) return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm flex items-center justify-center h-[150px]">
             <p className="text-slate-500 dark:text-slate-400">No historical data available.</p>
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

    const handleMouseMove = (event: React.MouseEvent<SVGRectElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const index = Math.round((x / rect.width) * (data.length - 1));
        const value = data[index];
        const pointX = (index / (data.length - 1)) * width;
        const pointY = height - (value / maxDataVal) * height;
        setHoverData({ x: pointX, y: pointY, value, index });
    };

    const handleMouseLeave = () => {
        setHoverData(null);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300">{title}</h4>
                <p className="text-sm font-bold" style={{ color: color }}>
                    {data[data.length - 1].toFixed(1)} <span className="font-medium text-slate-500 dark:text-slate-400">{unit}</span>
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
                    <rect width={width} height={height} fill="transparent" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
                    {hoverData && (
                        <g>
                            <line x1={hoverData.x} y1="0" x2={hoverData.x} y2={height} stroke={color} strokeWidth="1" strokeDasharray="3,3" />
                            <circle cx={hoverData.x} cy={hoverData.y} r="4" fill="white" stroke={color} strokeWidth="2" />
                        </g>
                    )}
                </svg>
                 {hoverData && (
                    <div 
                        className="absolute p-2 text-xs bg-slate-800 text-white rounded-md shadow-lg pointer-events-none transition-opacity"
                        style={{
                            left: `${hoverData.x}px`,
                            top: `${hoverData.y}px`,
                            transform: `translate(-50%, -120%) translateX(${hoverData.x / width > 0.5 ? '-20px' : '20px'})`,
                        }}
                    >
                       <p className="font-bold">{hoverData.value.toFixed(2)} {unit}</p>
                       <p className="text-slate-300">~{24 - hoverData.index}h ago</p>
                    </div>
                )}
                <div className="absolute top-0 left-0 text-xs text-slate-400">{maxDataVal.toFixed(0)}</div>
                <div className="absolute bottom-0 left-0 text-xs text-slate-400">0</div>
                <div className="absolute -bottom-4 right-0 text-xs text-slate-400">Now</div>
                 <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-slate-400">12h ago</div>
                <div className="absolute -bottom-4 left-0 text-xs text-slate-400">24h ago</div>
            </div>
        </div>
    );
};


const SWT_2_3_101_SPECS = {
    RPM_RANGE: { min: 6, max: 16 },
    WIND_SPEED_CUT_OUT: 25,
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

        const w = Math.max(0, Math.min(SWT_2_3_101_SPECS.WIND_SPEED_CUT_OUT, (turbine.windSpeed ?? 0) * factor * randomFluctuation)); // Cap at cut-out speed
        wind.push(w);

        let r = 0;
        if (p > 0.1) { // Only have RPM if producing power
            const powerRatio = p / turbine.maxPower;
            r = SWT_2_3_101_SPECS.RPM_RANGE.min + powerRatio * (SWT_2_3_101_SPECS.RPM_RANGE.max - SWT_2_3_101_SPECS.RPM_RANGE.min); // Base RPM on generated power for consistency
            r *= randomFluctuation;
        }
        r = Math.max(0, Math.min(SWT_2_3_101_SPECS.RPM_RANGE.max, r)); // Cap RPM between 0 and max
        rpm.push(r);
    }
    return { power, wind, rpm };
};

const AlarmHistory: React.FC<{ alarms: Alarm[]; onAcknowledge: (id: string) => void }> = ({ alarms, onAcknowledge }) => {
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
    
    const sortedAlarms = useMemo(() => {
        const sortableAlarms = [...alarms];
        
        const severityOrder = { [AlarmSeverity.Critical]: 1, [AlarmSeverity.Warning]: 2, [AlarmSeverity.Info]: 3 };

        if (sortConfig !== null) {
            sortableAlarms.sort((a, b) => {
                let aVal: any, bVal: any;
                
                switch(sortConfig.key) {
                    case 'severity':
                        aVal = severityOrder[a.severity];
                        bVal = severityOrder[b.severity];
                        break;
                    case 'description':
                        aVal = a.description;
                        bVal = b.description;
                        break;
                    case 'timeOn':
                        aVal = a.timeOn.getTime();
                        bVal = b.timeOn.getTime();
                        break;
                    default:
                        return 0;
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        } else {
             sortableAlarms.sort((a, b) => {
                if (!a.timeOff && b.timeOff) return -1; // Active alarms first
                if (a.timeOff && !b.timeOff) return 1;
                return b.timeOn.getTime() - a.timeOn.getTime(); // Then by most recent
            });
        }
        return sortableAlarms;
    }, [alarms, sortConfig]);

    const requestSort = (key: string) => {
        if (sortConfig && sortConfig.key === key) {
            // If same key, toggle direction or remove sort
            if(sortConfig.direction === 'desc') {
                setSortConfig(null); // Return to default sort
            } else {
                setSortConfig({ key, direction: 'desc' });
            }
        } else {
            setSortConfig({ key, direction: 'asc' });
        }
    };

    const getSortIcon = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <i className="fa-solid fa-sort sort-icon ml-2"></i>;
        }
        if (sortConfig.direction === 'asc') {
            return <i className="fa-solid fa-sort-up sort-icon active ml-2"></i>;
        }
        return <i className="fa-solid fa-sort-down sort-icon active ml-2"></i>;
    };
    
    const severityConfig = {
        [AlarmSeverity.Critical]: { icon: 'fa-triangle-exclamation', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
        [AlarmSeverity.Warning]: { icon: 'fa-triangle-exclamation', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
        [AlarmSeverity.Info]: { icon: 'fa-circle-info', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    };

    const formatDuration = (start: Date, end: Date | null): string => {
        const endDate = end || new Date();
        const diffMs = endDate.getTime() - start.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        if (diffHours > 0) return `${diffHours}h ${diffMins}m`;
        return `${diffMins}m`;
    };

    if (alarms.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm text-center">
                <p className="text-slate-500 dark:text-slate-400">No alarms recorded for this turbine.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 uppercase">
                    <tr>
                        <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('severity')}>Severity {getSortIcon('severity')}</th>
                        <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('description')}>Description {getSortIcon('description')}</th>
                        <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('timeOn')}>Start Time {getSortIcon('timeOn')}</th>
                        <th scope="col" className="px-6 py-3">Duration</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAlarms.map(alarm => {
                        const config = severityConfig[alarm.severity];
                        const isActive = !alarm.timeOff;
                        return (
                            <tr key={alarm.id} className={`border-b dark:border-slate-700 ${isActive ? config.bg : 'bg-white dark:bg-slate-800'}`}>
                                <td className="px-6 py-4 font-medium">
                                    <div className={`flex items-center gap-2 ${config.color}`}>
                                        <i className={`fa-solid ${config.icon}`}></i>
                                        <span>{alarm.severity}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-800 dark:text-slate-200">{alarm.description}</td>
                                <td className="px-6 py-4">{alarm.timeOn.toLocaleString()}</td>
                                <td className="px-6 py-4">{formatDuration(alarm.timeOn, alarm.timeOff)}</td>
                                <td className="px-6 py-4">
                                    {isActive ? (
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${alarm.acknowledged ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>
                                            {alarm.acknowledged ? 'Active (Ack)' : 'Active (New)'}
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">Resolved</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {isActive && !alarm.acknowledged && (
                                        <button onClick={() => onAcknowledge(alarm.id)} className="font-medium text-violet-600 hover:text-violet-800 bg-violet-100 hover:bg-violet-200 dark:text-violet-400 dark:bg-violet-900/50 dark:hover:bg-violet-900 px-3 py-1 rounded-md transition">
                                            Acknowledge
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};


const TurbineDetailView: React.FC<TurbineDetailViewProps> = ({ turbine, onBack, historicalData, alarms, onAcknowledgeAlarm }) => {
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

    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white mb-4">
                <i className="fa-solid fa-arrow-left"></i>
                Back to Dashboard
            </button>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Turbine {turbine.id}</h1>
                        <p className="text-slate-500 dark:text-slate-400">Detailed operational metrics and status.</p>
                    </div>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${config.classes}`}>{config.text}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                 <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2 text-center">Active Power Output</h3>
                    <PowerGauge
                        power={turbine.activePower ?? 0}
                        nominalMaxPower={turbine.maxPower}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
                <MetricCard title="Reactive Power" value={turbine.reactivePower !== null ? `${turbine.reactivePower} MVar` : '—'} icon={<i className="fa-solid fa-bolt-lightning"></i>} color="text-blue-500" />
                <MetricCard title="Wind Speed" value={turbine.windSpeed !== null ? `${turbine.windSpeed} m/s` : '—'} icon={<i className="fa-solid fa-wind"></i>} color="text-pink-500" />
                <MetricCard title="Direction" value={turbine.direction !== null ? `${turbine.direction}°` : '—'} icon={<i className="fa-solid fa-compass"></i>} color="text-teal-500" />
                <MetricCard title="Temperature" value={turbine.temperature !== null ? `${turbine.temperature}°C` : '—'} icon={<i className="fa-solid fa-temperature-half"></i>} color="text-orange-500" />
                <MetricCard title="RPM" value={turbine.rpm !== null ? `${turbine.rpm}` : '—'} icon={<i className="fa-solid fa-arrows-spin"></i>} color="text-indigo-500" />
            </div>
            
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Historical Performance (Last 24h)</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <HistoricalChart title="Power Output" data={chartData.power} unit="MW" color="#10b981" maxVal={turbine.maxPower} />
                    <HistoricalChart title="Wind Speed" data={chartData.wind} unit="m/s" color="#ec4899" maxVal={30} />
                    <HistoricalChart title="Rotor Speed" data={chartData.rpm} unit="RPM" color="#6366f1" maxVal={SWT_2_3_101_SPECS.RPM_RANGE.max + 4} />
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Alarm History & Status</h2>
                <AlarmHistory alarms={alarms} onAcknowledge={onAcknowledgeAlarm} />
            </div>
        </div>
    );
};

export default TurbineDetailView;