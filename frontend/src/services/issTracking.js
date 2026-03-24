import axios from 'axios';

const NASA_API_KEY = process.env.VITE_NASA_API_KEY || 'kkn8pA8Ac6Pwv0WFR1V83f2zewmnEbfIdrGaja86';

class ISSTrackingService {
  constructor() {
    this.issPosition = null;
    this.issHistory = [];
    this.updateInterval = null;
    this.listeners = [];
  }

  // Get current ISS position from NASA API
  async fetchISSPosition() {
    try {
      const response = await axios.get('https://api.nasa.gov/iss-now.json', {
        params: { api_key: NASA_API_KEY }
      });

      const position = {
        latitude: parseFloat(response.data.iss_position.latitude),
        longitude: parseFloat(response.data.iss_position.longitude),
        altitude: 408, // Average ISS altitude in km
        timestamp: new Date(),
        name: 'ISS'
      };

      // Keep history for trajectory (last 100 points)
      this.issHistory.push(position);
      if (this.issHistory.length > 100) {
        this.issHistory.shift();
      }

      this.issPosition = position;
      this.notifyListeners();

      return position;
    } catch (error) {
      console.error('Failed to fetch ISS position:', error);
      throw error;
    }
  }

  // Get ISS passes (next visible passes from ground)
  async getISSPasses(latitude, longitude, days = 5) {
    try {
      const response = await axios.get('https://api.nasa.gov/iss-passes.json', {
        params: {
          lat: latitude,
          lon: longitude,
          n: days,
          api_key: NASA_API_KEY
        }
      });

      return response.data.passes.map(pass => ({
        riseTime: new Date(pass.risetime * 1000),
        duration: pass.duration,
        maxElevation: pass.max_elevation
      }));
    } catch (error) {
      console.error('Failed to fetch ISS passes:', error);
      return [];
    }
  }

  // Start real-time updates
  startTracking(interval = 5000) {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Initial fetch
    this.fetchISSPosition();

    // Update every 5 seconds
    this.updateInterval = setInterval(() => {
      this.fetchISSPosition().catch(err => {
        console.error('ISS tracking update failed:', err);
      });
    }, interval);
  }

  // Stop tracking
  stopTracking() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Subscribe to position updates
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Notify all subscribers
  notifyListeners() {
    this.listeners.forEach(callback => {
      callback(this.issPosition, this.issHistory);
    });
  }

  // Get current position
  getPosition() {
    return this.issPosition;
  }

  // Get trajectory history
  getHistory() {
    return [...this.issHistory];
  }
}

// Export singleton instance
export default new ISSTrackingService();
