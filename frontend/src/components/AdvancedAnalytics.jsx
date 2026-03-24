import React, { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const AdvancedAnalytics = ({ telemetryData = [] }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [analyticsData, setAnalyticsData] = useState({
    temperature: [],
    power: [],
    signal: [],
    anomalies: [],
    systemHealth: []
  });

  useEffect(() => {
    generateAnalytics();
  }, [telemetryData, timeRange]);

  const generateAnalytics = () => {
    const now = new Date();
    const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;

    // Generate mock data (in real scenario, this comes from backend)
    const tempData = [];
    const powerData = [];
    const signalData = [];

    for (let i = hours; i > 0; i--) {
      const time = new Date(now - i * 3600000);
      tempData.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: 45 + Math.sin(i / 10) * 15 + Math.random() * 5,
        avg: 50
      });
      powerData.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: 80 + Math.cos(i / 12) * 20 + Math.random() * 3
      });
      signalData.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: 85 + Math.random() * 10
      });
    }

    setAnalyticsData({
      temperature: tempData.slice(-20),
      power: powerData.slice(-20),
      signal: signalData.slice(-20),
      anomalies: [
        { type: 'Thermal', count: 3, percentage: 30 },
        { type: 'Power', count: 2, percentage: 20 },
        { type: 'Signal', count: 1, percentage: 10 },
        { type: 'Other', count: 4, percentage: 40 }
      ],
      systemHealth: [
        { component: 'Propulsion', health: 98 },
        { component: 'Power', health: 92 },
        { component: 'Communication', health: 95 },
        { component: 'Thermal', health: 87 },
        { component: 'Navigation', health: 99 }
      ]
    });
  };

  const downloadData = (format) => {
    const data = JSON.stringify(analyticsData, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/${format === 'json' ? 'json' : 'csv'};charset=utf-8,${encodeURIComponent(data)}`);
    element.setAttribute('download', `as3-analytics.${format}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex gap-2">
          {['24h', '7d', '30d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded transition-all ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => downloadData('json')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
            Export JSON
          </button>
          <button
            onClick={() => downloadData('csv')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Temperature Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.temperature}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#ef4444" name="Actual" />
              <Line type="monotone" dataKey="avg" stroke="#3b82f6" name="Average" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Power Levels */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Power Consumption</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.power}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
              <Bar dataKey="value" fill="#fbbf24" name="Power %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Anomaly Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Anomaly Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.anomalies}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ type, percentage }) => `${type}: ${percentage}%`}
              >
                {analyticsData.anomalies.map((_, idx) => (
                  <circle key={idx} fill={['#ef4444', '#f59e0b', '#eab308', '#3b82f6'][idx]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* System Health */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Component Health</h3>
          <div className="space-y-3">
            {analyticsData.systemHealth.map((component, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{component.component}</span>
                  <span className={`text-sm font-bold ${component.health >= 95 ? 'text-green-500' : component.health >= 90 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {component.health}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      component.health >= 95 ? 'bg-green-500' : component.health >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${component.health}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Avg Temperature</p>
          <p className="text-3xl font-bold">45.6°C</p>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Power Level</p>
          <p className="text-3xl font-bold">87%</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Signal Strength</p>
          <p className="text-3xl font-bold">92%</p>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Anomalies Detected</p>
          <p className="text-3xl font-bold">10</p>
        </div>
      </div>
    </div>
  );
};
