import React, { useState, useEffect } from 'react';
import issTracking from '../services/issTracking';

export const ISSTracker = () => {
  const [position, setPosition] = useState(null);
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setUserLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          });
        },
        () => {
          // Default to New York if geolocation fails
          setUserLocation({ lat: 40.7128, lon: -74.0060 });
        }
      );
    }
  }, []);

  // Subscribe to ISS updates
  useEffect(() => {
    const unsubscribe = issTracking.subscribe((pos, history) => {
      setPosition(pos);
      setLoading(false);
    });

    issTracking.startTracking(5000);

    return () => {
      unsubscribe();
      issTracking.stopTracking();
    };
  }, []);

  // Fetch ISS passes for user location
  useEffect(() => {
    if (userLocation) {
      issTracking.getISSPasses(userLocation.lat, userLocation.lon).then(setPasses);
    }
  }, [userLocation]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-900 to-blue-800 dark:from-slate-800 dark:to-slate-900 rounded-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
        ISS Real-Time Tracker
      </h2>

      {position && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-blue-200 text-sm">Latitude</p>
            <p className="text-3xl font-bold">{position.latitude.toFixed(4)}°</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-blue-200 text-sm">Longitude</p>
            <p className="text-3xl font-bold">{position.longitude.toFixed(4)}°</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-blue-200 text-sm">Updated</p>
            <p className="text-xl font-bold">{position.timestamp.toLocaleTimeString()}</p>
          </div>
        </div>
      )}

      {passes.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Next Visible Passes</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {passes.slice(0, 10).map((pass, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur rounded p-3 flex justify-between">
                <div>
                  <p className="font-semibold">{pass.riseTime.toLocaleString()}</p>
                  <p className="text-blue-200 text-sm">Duration: {pass.duration}s</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">{pass.maxElevation}°</p>
                  <p className="text-blue-200 text-sm">max elevation</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-blue-300 mt-4">
        Data from NASA ISS API • Updated every 5 seconds
      </p>
    </div>
  );
};
