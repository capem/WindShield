<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# WindShield - Wind Farm Monitoring System

**WindShield** is a comprehensive real-time monitoring and management dashboard for industrial wind turbine farms. Built with React and TypeScript, it provides operators with powerful tools to monitor turbine performance, track alarms, analyze historical data, and visualize the entire wind farm on an interactive map.

## 🌟 Features

### 📊 **Real-Time Dashboard**
- **Live Metrics**: Monitor active power (MW), reactive power (MVar), average wind speed, temperature, load factor, and daily production
- **Turbine Status Overview**: Track all 131 turbines across 8 different status states (Producing, Available, Stopped, Offline, Maintenance, Fault, Warning, Curtailment)
- **Zone-Based Organization**: Turbines organized by zones (North Zone, Tah Zone) and lines (Line 1-12)
- **Compact/Expanded Views**: Toggle between detailed and compact card layouts

### 🔧 **Turbine Detail View**
- **Comprehensive Metrics**: Detailed view of individual turbine performance including power output, wind conditions, RPM, and temperature
- **Visual Gauges**: Real-time power gauge with color-coded status indicators
- **Historical Charts**: Interactive charts showing power output, wind speed, and RPM trends over time
- **Alarm Management**: View and acknowledge turbine-specific alarms with severity indicators
- **Availability Analysis**: Track turbine uptime and availability metrics

### 🚨 **Alarm System**
- **Real-Time Alerts**: Monitor critical, warning, and info-level alarms across the farm
- **Acknowledgment System**: Track and acknowledge alarms with timestamp logging
- **Historical Alarm Data**: View resolved alarms with duration tracking

### 📈 **Analytics View**
- **Farm-Wide Analytics**: Aggregate performance metrics across all turbines
- **Time-Series Data**: Analyze trends over hours, days, and months
- **Performance Metrics**: Track production efficiency, capacity factors, and availability
- **Data Export**: Support for CSV data import/export

### 🗺️ **Interactive Map**
- **Geographic Visualization**: View all 131 turbines on an interactive Leaflet map
- **Real-Time Status**: Color-coded markers showing turbine status
- **Click-to-Details**: Click any turbine marker to view detailed information
- **Coordinate Mapping**: Precise GPS coordinates for each turbine

### ⚙️ **Settings & Customization**
- **Dark Mode**: Full dark mode support with smooth transitions
- **View Preferences**: Toggle compact view and sidebar collapse
- **Data Upload**: Import custom CSV data for historical analysis
- **Theme Persistence**: Settings saved across sessions

## 🏗️ Technical Architecture

### **Technology Stack**
- **Frontend Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: TailwindCSS 4.1.17
- **Icons**: Font Awesome 7.1.0
- **Mapping**: Leaflet 1.9.4 with React-Leaflet 5.0.0
- **Code Quality**: Biome 2.3.5 for linting and formatting

### **Project Structure**
```
WindShield/
├── components/          # React components
│   ├── AlarmView.tsx
│   ├── AnalyticsView.tsx
│   ├── Header.tsx
│   ├── MapView.tsx
│   ├── SettingsView.tsx
│   ├── Sidebar.tsx
│   ├── TurbineCard.tsx
│   ├── TurbineDetailView.tsx
│   └── ...
├── contexts/           # React contexts (Theme)
├── data/              # Static data (turbine coordinates)
├── styles/            # CSS stylesheets
├── App.tsx            # Main application component
├── types.ts           # TypeScript type definitions
└── ...
```

### **Key Components**

#### **Turbine Model (SWT-2.3-101)**
- **Rated Power**: 2.3 MW
- **RPM Range**: 6-16 RPM
- **Cut-in Wind Speed**: 3.5 m/s
- **Nominal Wind Speed**: 12.5 m/s
- **Cut-out Wind Speed**: 25 m/s

#### **Wind Farm Layout**
- **Total Turbines**: 131
- **North Zone**: 87 turbines (Lines 8-12)
- **Tah Zone**: 44 turbines (Lines 1-7)

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WindShield
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   Navigate to http://localhost:3000
   ```

### **Build for Production**
```bash
npm run build
npm run preview
```

## 📁 Data Import

WindShield supports CSV data import for historical analysis. The CSV file should include the following columns:

- `Turbine ID`: Numeric turbine identifier (1-131)
- `Timestamp`: ISO 8601 timestamp
- `Status`: Turbine status (producing, available, offline, etc.)
- `ActivePower(MW)`: Active power output
- `ReactivePower(MVar)`: Reactive power
- `WindSpeed(m/s)`: Wind speed
- `Direction(°)`: Wind direction
- `Temperature(°C)`: Ambient temperature
- `RPM`: Rotor speed
- `MaxPower(MW)`: Maximum rated power

## 🎨 Features in Detail

### **Dashboard Metrics**
- **Active Power**: Total real-time power generation across all producing turbines
- **Reactive Power**: Total reactive power for grid stability
- **Load Factor**: Percentage of installed capacity currently being utilized
- **Production (Today)**: Cumulative energy production since midnight (MWh)
- **Average Wind Speed**: Mean wind speed across all online turbines
- **Average Temperature**: Mean ambient temperature

### **Turbine Status States**
1. **Producing** 🟢: Actively generating power
2. **Available** 🔵: Ready to produce but wind below cut-in speed
3. **Stopped** 🟡: Intentionally stopped (high wind or low wind)
4. **Offline** 🔴: Not communicating or unavailable
5. **Maintenance** 🟣: Under scheduled maintenance
6. **Fault** 🔴: System fault detected
7. **Warning** 🟠: Warning condition active
8. **Curtailment** 🟣: Production limited by grid operator

## 🔄 Real-Time Updates

The dashboard updates in real-time with:
- Live clock display
- Automatic data refresh
- Status change notifications
- Alarm updates

## 🌙 Dark Mode

Full dark mode support with:
- Automatic theme detection
- Manual toggle in settings
- Smooth color transitions
- Optimized contrast ratios

## 📊 Analytics Capabilities

- **Time-Series Analysis**: View trends over custom time periods
- **Comparative Analysis**: Compare turbine performance
- **Availability Tracking**: Monitor uptime and downtime
- **Production Forecasting**: Based on historical patterns
- **Export Reports**: Generate CSV reports for external analysis

## 🛠️ Development

### **Code Quality**
```bash
# Run linter
npx biome check .

# Format code
npx biome format --write .
```

### **Type Checking**
```bash
npx tsc --noEmit
```

## 🔗 Links

- **Documentation**: See inline code documentation

## 🤝 Contributing

This application can be extended with additional features such as:
- Advanced weather integration
- Mobile responsive optimizations
- Multi-language support
- Export to PDF reports
- Real-time notifications

---

**Built with ❤️ using React, TypeScript**
