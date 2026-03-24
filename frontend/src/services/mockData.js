export const mockData = {
telemetry: {
spacecraft_id: 'ISS-01',
timestamp: new Date().toISOString(),
position: {
x: 6779.123,
y: 450.456,
z: 100.789,
},
velocity: {
vx: 0.123,
vy: 7.66,
vz: 0.045,
},
temperature: 22.5,
power_level: 87,
altitude: 408,
speed: 7.66,
battery_voltage: 28.5,
cpu_usage: 45,
memory_usage: 60,
signal_strength: 85,
anomalies: [],
},

missions: [
{
mission_id: 'MISSION-001',
name: 'ISS Resupply',
mission_type: 'communication',
status: 'active',
spacecraft_id: 'ISS-01',
start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
estimated_end_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
objectives: [
{ name: 'Establish connection', description: 'Connect to ISS', completed: true, priority: 1 },
{ name: 'Transfer data', description: 'Upload science data', completed: true, priority: 1 },
{ name: 'System check', description: 'Verify all systems', completed: false, priority: 2 },
],
progress: 75,
priority: 1,
description: 'Regular communication and data transfer',
},
{
mission_id: 'MISSION-002',
name: 'Earth Observation',
mission_type: 'observation',
status: 'active',
spacecraft_id: 'ISS-01',
start_time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
estimated_end_time: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
objectives: [
{ name: 'Scan weather systems', description: 'Monitor storms', completed: true, priority: 1 },
{ name: 'Capture imagery', description: 'High-res photos', completed: false, priority: 2 },
],
progress: 50,
priority: 2,
description: 'Environmental monitoring mission',
},
],

simulation: {
spacecraft_id: 'ISS-01',
status: 'idle',
current_time: 0,
current_position: { x: 6779, y: 0, z: 0 },
trajectory: [],
maneuver: null,
progress: 0,
},

statusCards: [
{
label: 'Altitude',
value: '408 km',
status: 'healthy',
},
{
label: 'Speed',
value: '7.66 km/s',
status: 'healthy',
},
{
label: 'Temperature',
value: '22.5°C',
status: 'healthy',
},
{
label: 'Power',
value: '87%',
status: 'healthy',
},
],

gaugeData: {
temperature: { value: 22.5, min: -30, max: 50, unit: '°C' },
power: { value: 87, min: 0, max: 100, unit: '%' },
signal: { value: 85, min: 0, max: 100, unit: '%' },
cpu: { value: 45, min: 0, max: 100, unit: '%' },
},
}

export default mockData