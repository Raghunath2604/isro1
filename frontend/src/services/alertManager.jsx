import React, { useState, useEffect } from 'react';

class AlertManager {
  constructor() {
    this.alerts = [];
    this.listeners = [];
    this.nextId = 1;
  }

  addAlert(alert) {
    const id = this.nextId++;
    const newAlert = {
      id,
      timestamp: new Date(),
      read: false,
      ...alert
    };
    this.alerts.push(newAlert);
    this.notifyListeners();

    // Send browser notification
    if (Notification.permission === 'granted') {
      new Notification(alert.title, {
        body: alert.message,
        icon: alert.icon || '/favicon.ico',
        tag: 'as3-alert'
      });
    }

    // Send email if critical
    if (alert.severity === 'critical') {
      this.sendEmailAlert(newAlert);
    }

    return id;
  }

  sendEmailAlert(alert) {
    // Will be called via API to backend
    fetch('/api/alerts/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert)
    }).catch(err => console.error('Failed to send email alert:', err));
  }

  removeAlert(id) {
    this.alerts = this.alerts.filter(a => a.id !== id);
    this.notifyListeners();
  }

  markAsRead(id) {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.read = true;
      this.notifyListeners();
    }
  }

  clearAll() {
    this.alerts = [];
    this.notifyListeners();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.alerts));
  }

  getAlerts() {
    return [...this.alerts];
  }
}

export const alertManager = new AlertManager();

// Alert Notification Component
export const AlertNotification = ({ alert, onClose }) => {
  const severityColors = {
    critical: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    success: 'bg-green-500'
  };

  const severityIcons = {
    critical: '🚨',
    warning: '⚠️',
    info: 'ℹ️',
    success: '✅'
  };

  return (
    <div
      className={`${severityColors[alert.severity] || 'bg-blue-500'} text-white px-4 py-3 rounded shadow-lg mb-2 flex justify-between items-start`}
      role="alert"
    >
      <div className="flex items-start">
        <span className="mr-3 text-xl">{severityIcons[alert.severity]}</span>
        <div>
          <p className="font-bold">{alert.title}</p>
          <p className="text-sm opacity-90">{alert.message}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="ml-4 font-bold text-xl opacity-75 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
};

// Alert Toast Container
export const AlertContainer = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const unsubscribe = alertManager.subscribe(setAlerts);
    return unsubscribe;
  }, []);

  return (
    <div
      className="fixed bottom-4 right-4 z-50 max-w-md"
      role="region"
      aria-label="Notifications"
    >
      {alerts.map(alert => (
        <AlertNotification
          key={alert.id}
          alert={alert}
          onClose={() => alertManager.removeAlert(alert.id)}
        />
      ))}
    </div>
  );
};

// Alert Rules Manager Component
export const AlertRulesManager = ({ onRuleChange }) => {
  const [rules, setRules] = useState([
    { id: 1, name: 'High Temperature', condition: 'temp > 70', enabled: true },
    { id: 2, name: 'Low Power', condition: 'power < 30', enabled: true },
    { id: 3, name: 'Signal Loss', condition: 'signal < 50', enabled: true },
    { id: 4, name: 'Anomaly Detected', condition: 'anomaly_severity > 0.8', enabled: true }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', condition: '', enabled: true });

  const handleAddRule = () => {
    const newRule = {
      id: Math.max(...rules.map(r => r.id), 0) + 1,
      ...formData
    };
    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    onRuleChange(updatedRules);
    setFormData({ name: '', condition: '', enabled: true });
    setShowForm(false);
  };

  const toggleRule = (id) => {
    const updatedRules = rules.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    setRules(updatedRules);
    onRuleChange(updatedRules);
  };

  const deleteRule = (id) => {
    const updatedRules = rules.filter(r => r.id !== id);
    setRules(updatedRules);
    onRuleChange(updatedRules);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Alert Rules</h2>

      <div className="space-y-3 mb-6">
        {rules.map(rule => (
          <div key={rule.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded">
            <div className="flex-1">
              <p className="font-semibold text-gray-800 dark:text-white">{rule.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{rule.condition}</p>
            </div>
            <div className="flex gap-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={() => toggleRule(rule.id)}
                  className="mr-2 w-4 h-4 rounded"
                />
                <span className="text-sm">Active</span>
              </label>
              <button
                onClick={() => deleteRule(rule.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded mb-4 space-y-3">
          <input
            type="text"
            placeholder="Rule name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
          />
          <input
            type="text"
            placeholder="Condition (e.g., temp > 70)"
            value={formData.condition}
            onChange={e => setFormData({ ...formData, condition: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddRule}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Rule
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
        >
          + New Alert Rule
        </button>
      )}
    </div>
  );
};

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}
