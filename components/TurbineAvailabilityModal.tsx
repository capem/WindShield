import React, { useState, useMemo } from 'react';
import type { TurbineAvailabilityModalProps } from '../availabilityTypes';
import { generateAlarmData, generateTimestampData } from '../availabilityDataUtils';
import AlarmView from './AlarmView';
import TimestampView from './TimestampView';

const TurbineAvailabilityModal: React.FC<TurbineAvailabilityModalProps> = ({
  turbineId,
  isOpen,
  onClose,
  initialView = 'alarm'
}) => {
  const [activeView, setActiveView] = useState<'alarm' | 'timestamp'>(initialView);
  
  // Generate mock data for the selected turbine
  const alarmData = useMemo(() => generateAlarmData(turbineId), [turbineId]);
  const timestampData = useMemo(() => generateTimestampData(turbineId), [turbineId]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black opacity-30 transition-opacity" 
          onClick={onClose}
        ></div>
        
        <div className="relative w-full max-w-7xl bg-white dark:bg-black rounded-lg shadow-xl transition-theme">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Turbine {turbineId} Availability Analysis
            </h2>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              onClick={onClose}
              aria-label="Close modal"
            >
              <i className="fa-solid fa-times text-xl"></i>
            </button>
          </div>
          
          {/* View Switcher */}
          <div className="flex border-b border-slate-200 dark:border-gray-700">
            <button
              type="button"
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeView === 'alarm'
                  ? 'text-violet-600 border-b-2 border-violet-600 dark:text-violet-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
              onClick={() => setActiveView('alarm')}
            >
              Alarm View
            </button>
            <button
              type="button"
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeView === 'timestamp'
                  ? 'text-violet-600 border-b-2 border-violet-600 dark:text-violet-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
              onClick={() => setActiveView('timestamp')}
            >
              10-Minute Timestamp View
            </button>
          </div>
          
          {/* Content Area */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {activeView === 'alarm' ? (
              <AlarmView data={alarmData} />
            ) : (
              <TimestampView data={timestampData} />
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default TurbineAvailabilityModal;