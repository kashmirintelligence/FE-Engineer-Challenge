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

export interface TemperatureData {
  timestamp: number;
  value: number;
  warningThreshold: number;
  criticalThreshold: number;
  status?: ThresholdStatus;
}

export interface PressureData {
  timestamp: number;
  value: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface FlowRateData {
  timestamp: number;
  rate: number;
  valvePosition: number;
  efficiency: number;
}

export type ThresholdStatus = 'normal' | 'warning' | 'critical';

// Default values
export const DEFAULT_TEMPERATURE = 25; 
export const DEFAULT_WARNING_TEMPERATURE = 35;
export const DEFAULT_CRITICAL_TEMPERATURE = 45;

export const DEFAULT_PRESSURE = 50;
export const PRESSURE_WARNING_THRESHOLD = 75;
export const PRESSURE_CRITICAL_THRESHOLD = 90;

export const DEFAULT_FLOW_RATE = 40;
export const DEFAULT_VALVE_POSITION = 50;

// Simulation constants
export const UPDATE_INTERVAL = 1000;
export const MAX_DATA_POINTS = 60;
export const TEMPERATURE_FLUCTUATION = 0.5;
export const PRESSURE_FLUCTUATION = 2;
export const FLOW_FLUCTUATION = 1;