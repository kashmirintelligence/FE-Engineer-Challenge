import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import { 
  SocketEvents,
  DEFAULT_TEMPERATURE,
  DEFAULT_PRESSURE,
  DEFAULT_FLOW_RATE,
  DEFAULT_VALVE_POSITION,
  DEFAULT_WARNING_TEMPERATURE,
  DEFAULT_CRITICAL_TEMPERATURE,
  PRESSURE_WARNING_THRESHOLD,
  PRESSURE_CRITICAL_THRESHOLD,
  UPDATE_INTERVAL
} from 'shared';

import { TemperatureSimulator } from './simulators/temperature';
import { PressureSimulator } from './simulators/pressure';
import { FlowRateSimulator } from './simulators/flowRate';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'online' });
});

// Create simulators
const temperatureSimulator = new TemperatureSimulator(
  DEFAULT_TEMPERATURE,
  DEFAULT_WARNING_TEMPERATURE,
  DEFAULT_CRITICAL_TEMPERATURE
);

const pressureSimulator = new PressureSimulator(
  DEFAULT_PRESSURE,
  PRESSURE_WARNING_THRESHOLD,
  PRESSURE_CRITICAL_THRESHOLD
);

const flowRateSimulator = new FlowRateSimulator(
  DEFAULT_FLOW_RATE,
  DEFAULT_VALVE_POSITION
);

// Socket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial data
  socket.emit(SocketEvents.TEMPERATURE_UPDATE, temperatureSimulator.getData());
  socket.emit(SocketEvents.PRESSURE_UPDATE, pressureSimulator.getData());
  socket.emit(SocketEvents.FLOW_UPDATE, flowRateSimulator.getData());
  
  // Temperature controls
  socket.on(SocketEvents.TEMPERATURE_CONTROL, (data: { warningThreshold?: number; criticalThreshold?: number; cooling?: boolean }) => {
    if (data.warningThreshold !== undefined) {
      temperatureSimulator.setWarningThreshold(data.warningThreshold);
    }
    
    if (data.criticalThreshold !== undefined) {
      temperatureSimulator.setCriticalThreshold(data.criticalThreshold);
    }
    
    if (data.cooling !== undefined) {
      temperatureSimulator.setCooling(data.cooling);
    }
    
    socket.emit(SocketEvents.TEMPERATURE_UPDATE, temperatureSimulator.getData());
  });
  
  // Pressure controls
  socket.on(SocketEvents.PRESSURE_RELEASE, () => {
    pressureSimulator.emergencyRelease();
    socket.emit(SocketEvents.PRESSURE_UPDATE, pressureSimulator.getData());
  });
  
  // Flow rate controls
  socket.on(SocketEvents.FLOW_VALVE_ADJUST, (valvePosition: number) => {
    flowRateSimulator.adjustValve(valvePosition);
    socket.emit(SocketEvents.FLOW_UPDATE, flowRateSimulator.getData());
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start simulation intervals
const startSimulations = () => {
  setInterval(() => {
    temperatureSimulator.update();
    pressureSimulator.update();
    flowRateSimulator.update();
    
    io.emit(SocketEvents.TEMPERATURE_UPDATE, temperatureSimulator.getData());
    io.emit(SocketEvents.PRESSURE_UPDATE, pressureSimulator.getData());
    io.emit(SocketEvents.FLOW_UPDATE, flowRateSimulator.getData());
  }, UPDATE_INTERVAL);
};

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startSimulations();
});