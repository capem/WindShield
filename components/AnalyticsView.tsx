import React, { useMemo, useState } from 'react';
import { Turbine, TurbineStatus } from '../types';

// FIX: Define a type for historical data rows to resolve typing errors.
type HistoricalDataRow = {
    Timestamp: string;
    'Turbine ID': string | number;
    Status: string;
    'ActivePower(MW)': string | number | null;
    'ReactivePower(MVar)': string | number | null;
    'WindSpeed(m/s)': string | number | null;
    'Direction(°)': string | number | null;
    'Temperature(°C)': string | number | null;
    'RPM': string | number | null;
    'MaxPower(MW)': string | number | null;
};

interface AnalyticsViewProps {
    historicalData: Record<string, any[]> | null;
    turbines: Turbine[];
}

const KpiCard: React.FC<{ title: string, value: string, icon: React.ReactNode, color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-black p-4 rounded-xl shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 transition-theme">
        <div className={`p-4 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-').replace('-500', '-100')} dark:bg-opacity-20`}>
             <div className={`${color} text-3xl w-8 h-8 flex items-center justify-center`}>{icon}</div>
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
        </div>
    </div>
);

const AvailabilityChart: React.FC<{ data: { date: string, time: number, energy: number }[] }> = ({ data }) => {
    const width = 500;
    const height = 180; // Make chart more compact
    const padding = { top: 10, right: 0, bottom: 30, left: 35 };
    const [hoverData, setHoverData] = useState<{ index: number; x: number; date: string; time: number; energy: number } | null>(null);

    if (!data || data.length === 0) return null;

    const chartAreaWidth = width - padding.left - padding.right;
    const groupWidth = chartAreaWidth / data.length;
    const barWidth = groupWidth / 3;

    const handleMouseMove = (event: React.MouseEvent<SVGRectElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const mouseX = event.clientX - rect.left; // Mouse position in pixels, relative to the chart area rect

        // Correctly map the mouse's pixel position to the chart's internal SVG coordinate system.
        // The mouseX is relative to the chart area (the <rect> element), which has a rendered width of `rect.width`.
        // We map this to the SVG coordinate width of the chart area (`chartAreaWidth`).
        const chartAreaX = (mouseX / rect.width) * chartAreaWidth;

        // The index is the position within the chart area divided by the width of each bar group.
        const index = Math.floor(chartAreaX / groupWidth);
        
        if (index >= 0 && index < data.length) {
            const d = data[index];
            // The hover line's x position should be in the middle of the bar group.
            const groupCenterX = padding.left + (index * groupWidth) + (groupWidth / 2);
            setHoverData({
                index,
                x: groupCenterX, // x is in the full SVG coordinate system
                date: d.date,
                time: d.time,
                energy: d.energy,
            });
        } else {
            setHoverData(null);
        }
    };

    const handleMouseLeave = () => {
        setHoverData(null);
    };

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                {/* Y-axis */}
                {[0, 25, 50, 75, 100].map(y => (
                    <g key={y}>
                        <line
                            x1={padding.left} y1={height - padding.bottom - (y / 100) * (height - padding.top - padding.bottom)}
                            x2={width - padding.right} y2={height - padding.bottom - (y / 100) * (height - padding.top - padding.bottom)}
                            className="stroke-slate-200 dark:stroke-gray-800" strokeDasharray="2,2"
                        />
                        <text x={padding.left - 8} y={height - padding.bottom - (y / 100) * (height - padding.top - padding.bottom)} textAnchor="end" alignmentBaseline="middle" className="text-[5px] fill-slate-500 dark:fill-gray-400">{y}%</text>
                    </g>
                ))}

                {/* Bars */}
                {data.map((d, i) => {
                    const groupX = padding.left + i * groupWidth;
                    const bar1X = groupX + groupWidth / 2 - barWidth - barWidth * 0.1;
                    const bar2X = groupX + groupWidth / 2 + barWidth * 0.1;

                    const timeY = height - padding.bottom - (d.time / 100) * (height - padding.top - padding.bottom);
                    const energyY = height - padding.bottom - (d.energy / 100) * (height - padding.top - padding.bottom);

                    const isHovered = hoverData?.index === i;
                    
                    // The bars under the mouse are highlighted, the rest are dimmed.
                    const timeBarColor = isHovered ? 'fill-cyan-500' : 'fill-cyan-300 dark:fill-cyan-700';
                    const energyBarColor = isHovered ? 'fill-violet-600' : 'fill-violet-400 dark:fill-violet-800';
                    const opacity = hoverData ? (isHovered ? 'opacity-100' : 'opacity-30') : 'opacity-100';
                    
                    return (
                        <g key={d.date} className={`${opacity} transition-opacity duration-200`}>
                             <rect x={bar1X} y={timeY} width={barWidth} height={Math.max(0, height - padding.bottom - timeY)} className={timeBarColor} rx="2" />
                             <rect x={bar2X} y={energyY} width={barWidth} height={Math.max(0, height - padding.bottom - energyY)} className={energyBarColor} rx="2" />
                        </g>
                    )
                })}
                
                 {/* X-axis */}
                {data.map((d, i) => {
                    if (data.length > 15 && i % 3 !== 0) return null; // Show fewer labels if crowded
                    const x = padding.left + i * groupWidth + groupWidth / 2;
                    return (
                        <text key={d.date} x={x} y={height - padding.bottom + 15} textAnchor="middle" className="text-[5px] fill-slate-500 dark:fill-gray-400">
                           {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}
                        </text>
                    )
                })}

                {/* Hover interactions */}
                <rect x={padding.left} y={padding.top} width={chartAreaWidth} height={height - padding.top - padding.bottom} fill="transparent" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
                {hoverData && (
                    <g pointerEvents="none">
                        <line x1={hoverData.x} y1={padding.top} x2={hoverData.x} y2={height - padding.bottom} className="stroke-slate-400 dark:stroke-gray-600" strokeWidth="1" strokeDasharray="3,3" />
                    </g>
                )}
            </svg>
             {hoverData && (
                <div
                    className="absolute p-2 text-xs bg-gray-900 text-white rounded-md shadow-lg pointer-events-none transition-opacity dark:bg-black ring-1 ring-gray-800 transition-theme"
                    style={{
                        left: `${(hoverData.x / width) * 100}%`,
                        top: `${padding.top}px`,
                        transform: `translate(-50%, -105%)`,
                    }}
                >
                   <p className="font-bold mb-1 text-center whitespace-nowrap">{new Date(hoverData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}</p>
                   <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-cyan-400"></div>Time: <span className="font-semibold">{hoverData.time.toFixed(1)}%</span></div>
                   <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-violet-500"></div>Energy: <span className="font-semibold">{hoverData.energy.toFixed(1)}%</span></div>
                   <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900 dark:border-t-black"></div>
                </div>
            )}
        </div>
    )
}

const TurbinePerformanceTable: React.FC<{ data: any[] }> = ({ data }) => {
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>({ key: 'energyAvailability', direction: 'asc'});

    const sortedData = useMemo(() => {
        const sortableItems = [...data];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
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
    
    return (
        <div className="bg-white dark:bg-black rounded-lg shadow-sm overflow-hidden transition-theme">
            <table className="w-full text-sm text-left text-slate-600 dark:text-gray-400">
                <thead className="bg-slate-50 dark:bg-gray-900 text-xs text-slate-700 dark:text-gray-300 uppercase">
                    <tr>
                        <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('id')}>Turbine ID {getSortIcon('id')}</th>
                        <th scope="col" className="px-6 py-3 cursor-pointer text-right" onClick={() => requestSort('timeAvailability')}>Time Availability {getSortIcon('timeAvailability')}</th>
                        <th scope="col" className="px-6 py-3 cursor-pointer text-right" onClick={() => requestSort('energyAvailability')}>Energy Availability {getSortIcon('energyAvailability')}</th>
                        <th scope="col" className="px-6 py-3 cursor-pointer text-right" onClick={() => requestSort('totalProduction')}>Total Production (MWh) {getSortIcon('totalProduction')}</th>
                        <th scope="col" className="px-6 py-3 cursor-pointer text-right" onClick={() => requestSort('downTime')}>Downtime (Hours) {getSortIcon('downTime')}</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map(turbine => (
                        <tr key={turbine.id} className="border-b dark:border-gray-800 bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-gray-900/50">
                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{turbine.id}</td>
                            <td className="px-6 py-4 text-right font-medium">{turbine.timeAvailability.toFixed(2)}%</td>
                            <td className="px-6 py-4 text-right font-medium">{turbine.energyAvailability.toFixed(2)}%</td>
                            <td className="px-6 py-4 text-right">{turbine.totalProduction.toFixed(1)}</td>
                            <td className="px-6 py-4 text-right">{turbine.downTime.toFixed(1)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ historicalData, turbines }) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const [startDate, setStartDate] = useState(startOfMonth.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

    const dateFilteredData = useMemo(() => {
        if (!historicalData) return [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include the whole end day

        // FIX: Cast the array to the defined type to enable type checking.
        const allEntries = Object.values(historicalData).flat() as HistoricalDataRow[];
        return allEntries.filter(d => {
            const entryDate = new Date(d.Timestamp);
            return entryDate >= start && entryDate <= end;
        });
    }, [historicalData, startDate, endDate]);

    const availabilityMetrics = useMemo(() => {
        if (dateFilteredData.length === 0) return { time: 0, energy: 0, production: 0 };
        
        let uptimeHours = 0;
        let actualProduction = 0;
        let potentialProduction = 0;
        
        dateFilteredData.forEach(d => {
            const status = d['Status'];
            if (status === TurbineStatus.Producing || status === TurbineStatus.Available) {
                uptimeHours += 1; // Assuming hourly data points
            }

            const activePower = Number(d['ActivePower(MW)']) || 0;
            const windSpeed = Number(d['WindSpeed(m/s)']) || 0;
            const maxPower = Number(d['MaxPower(MW)']) || 2.3;

            actualProduction += activePower;

            if (windSpeed >= 3.5 && windSpeed <= 25) {
                potentialProduction += maxPower;
            }
        });

        const totalHours = dateFilteredData.length;
        const timeAvailability = totalHours > 0 ? (uptimeHours / totalHours) * 100 : 0;
        const energyAvailability = potentialProduction > 0 ? (actualProduction / potentialProduction) * 100 : 0;

        return {
            time: timeAvailability,
            energy: energyAvailability,
            production: actualProduction,
        };
    }, [dateFilteredData]);

    const dailyChartData = useMemo(() => {
        const dataByDay: Record<string, { uptimeHours: number, totalHours: number, actualProd: number, potentialProd: number }> = {};

        dateFilteredData.forEach(d => {
            const day = new Date(d.Timestamp).toISOString().split('T')[0];
            if (!dataByDay[day]) {
                dataByDay[day] = { uptimeHours: 0, totalHours: 0, actualProd: 0, potentialProd: 0 };
            }

            dataByDay[day].totalHours += 1;

            if (d['Status'] === TurbineStatus.Producing || d['Status'] === TurbineStatus.Available) {
                dataByDay[day].uptimeHours += 1;
            }

            const activePower = Number(d['ActivePower(MW)']) || 0;
            const windSpeed = Number(d['WindSpeed(m/s)']) || 0;
            const maxPower = Number(d['MaxPower(MW)']) || 2.3;

            dataByDay[day].actualProd += activePower;
            if (windSpeed >= 3.5 && windSpeed <= 25) {
                dataByDay[day].potentialProd += maxPower;
            }
        });

        return Object.entries(dataByDay)
            .map(([date, values]) => ({
                date,
                time: values.totalHours > 0 ? (values.uptimeHours / values.totalHours) * 100 : 0,
                energy: values.potentialProd > 0 ? (values.actualProd / values.potentialProd) * 100 : 0,
            }))
            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    }, [dateFilteredData]);

    const turbineTableData = useMemo(() => {
        const dataByTurbine: Record<string, { id: string, uptimeHours: number, totalHours: number, actualProd: number, potentialProd: number }> = {};
        
        turbines.forEach(t => {
             dataByTurbine[t.id] = { id: t.id, uptimeHours: 0, totalHours: 0, actualProd: 0, potentialProd: 0 };
        })

        dateFilteredData.forEach(d => {
            const id = `T ${String(d['Turbine ID']).padStart(3, '0')}`;
            if (!dataByTurbine[id]) return;

            dataByTurbine[id].totalHours += 1;
            if (d['Status'] === TurbineStatus.Producing || d['Status'] === TurbineStatus.Available) {
                dataByTurbine[id].uptimeHours += 1;
            }

            const activePower = Number(d['ActivePower(MW)']) || 0;
            const windSpeed = Number(d['WindSpeed(m/s)']) || 0;
            const maxPower = Number(d['MaxPower(MW)']) || 2.3;

            dataByTurbine[id].actualProd += activePower;
            if (windSpeed >= 3.5 && windSpeed <= 25) {
                dataByTurbine[id].potentialProd += maxPower;
            }
        });

        return Object.values(dataByTurbine).map(d => ({
            id: d.id,
            timeAvailability: d.totalHours > 0 ? (d.uptimeHours / d.totalHours) * 100 : 0,
            energyAvailability: d.potentialProd > 0 ? (d.actualProd / d.potentialProd) * 100 : 0,
            totalProduction: d.actualProd,
            downTime: d.totalHours - d.uptimeHours,
        }));

    }, [dateFilteredData, turbines]);

    return (
        <div className="animate-fade-in space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-theme">Analytics</h1>
            
            <div className="bg-white dark:bg-black rounded-lg shadow-sm p-4 flex flex-wrap items-center gap-4 transition-theme">
                <label htmlFor="start-date" className="font-semibold text-slate-700 dark:text-gray-300">Date Range:</label>
                <div className="flex items-center gap-2">
                    <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white transition-theme" />
                    <span className="text-slate-500">-</span>
                    <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white transition-theme" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="Time-Based Availability" value={`${availabilityMetrics.time.toFixed(2)}%`} icon={<i className="fa-regular fa-clock"></i>} color="text-cyan-500" />
                <KpiCard title="Energy-Based Availability" value={`${availabilityMetrics.energy.toFixed(2)}%`} icon={<i className="fa-solid fa-bolt"></i>} color="text-violet-500" />
                <KpiCard title="Total Production" value={`${(availabilityMetrics.production / 1000).toFixed(2)} GWh`} icon={<i className="fa-solid fa-chart-line"></i>} color="text-green-500" />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Availability Trend</h2>
                 <div className="flex items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-cyan-400"></div><span className="text-slate-600 dark:text-slate-300">Time-Based</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-violet-500"></div><span className="text-slate-600 dark:text-slate-300">Energy-Based</span></div>
                </div>
                {dailyChartData.length > 0 ? <AvailabilityChart data={dailyChartData} /> : <p className="text-center text-slate-500 dark:text-slate-400 py-10">No data available for the selected range.</p>}
            </div>

            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Turbine Performance</h2>
                <TurbinePerformanceTable data={turbineTableData} />
            </div>

        </div>
    );
};

export default AnalyticsView;