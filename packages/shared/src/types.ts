export interface TemperatureData {
  timestamp: number;
  value: number;
  warningThreshold: number;
  criticalThreshold: number;
}

export interface PressureData {
  timestamp: number;
  value: number; // 0-100 percentage
  status: 'normal' | 'warning' | 'critical';
}

export interface FlowRateData {
  timestamp: number;
  rate: number; // 0-100 percentage
  valvePosition: number; // 0-100 percentage
  efficiency: number; // calculated efficiency
}

export type ThresholdStatus = 'normal' | 'warning' | 'critical';

export interface RefineryStatus {
  temperature: TemperatureData;
  pressure: PressureData;
  flowRate: FlowRateData;
}

// Socket events
export enum SocketEvents {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ERROR = 'error',
  TEMPERATURE_UPDATE = 'temperature:update',
  TEMPERATURE_CONTROL = 'temperature:control',
  PRESSURE_UPDATE = 'pressure:update',
  PRESSURE_RELEASE = 'pressure:release',
  FLOW_UPDATE = 'flow:update',
  FLOW_VALVE_ADJUST = 'flow:valve-adjust'
}