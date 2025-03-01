import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FlowRateSimulator } from '../simulators/flowRate';

describe('FlowRateSimulator', () => {
  // Mock Date.now for consistent timestamps in tests
  vi.spyOn(Date, 'now').mockImplementation(() => 123456789);
  
  let simulator: FlowRateSimulator;
  
  beforeEach(() => {
    // Create a new simulator before each test with standard values
    simulator = new FlowRateSimulator(40, 50);
    // Stable random for predictable test behavior
    vi.spyOn(Math, 'random').mockImplementation(() => 0.5);
  });
  
  it('should initialize with correct values', () => {
    const data = simulator.getData();
    expect(data.rate).toBe(40);
    expect(data.valvePosition).toBe(50);
    expect(data.timestamp).toBe(123456789);
  });
  
  it('should adjust valve position correctly', () => {
    simulator.adjustValve(75);
    expect(simulator.getData().valvePosition).toBe(75);
    
    // Test upper bound
    simulator.adjustValve(150);
    expect(simulator.getData().valvePosition).toBe(100);
    
    // Test lower bound
    simulator.adjustValve(-10);
    expect(simulator.getData().valvePosition).toBe(0);
  });
  
  it('should gradually adjust flow rate towards target based on valve position', () => {
    simulator = new FlowRateSimulator(20, 80);
    
    // Neutralize random factor
    vi.spyOn(Math, 'random').mockImplementation(() => 0.5);
    
    const initialRate = simulator.getData().rate;
    
    // Update several times
    for (let i = 0; i < 10; i++) {
      simulator.update();
    }
    
    const updatedRate = simulator.getData().rate;
    
    // Flow rate should move toward valve position (adjusted by the 0.9 factor)
    expect(updatedRate).toBeGreaterThan(initialRate);
    expect(updatedRate).toBeLessThanOrEqual(80 * 0.9);
  });
  
  it('should calculate efficiency correctly based on valve position', () => {
    // At optimal position (50), efficiency should be max
    simulator = new FlowRateSimulator(40, 50);
    vi.spyOn(Math, 'random').mockImplementation(() => 0.5); // Neutral random
    
    const optimalData = simulator.getData();
    expect(optimalData.efficiency).toBeCloseTo(100);
    
    // At extreme position, efficiency should be lower
    simulator = new FlowRateSimulator(40, 0);
    const extremeData = simulator.getData();
    expect(extremeData.efficiency).toBeLessThan(optimalData.efficiency);
    
    // Midway should be... midway
    simulator = new FlowRateSimulator(40, 25);
    const midwayData = simulator.getData();
    expect(midwayData.efficiency).toBeGreaterThan(extremeData.efficiency);
    expect(midwayData.efficiency).toBeLessThan(optimalData.efficiency);
  });
  
  it('should not allow flow rate to go below 0 or above 100', () => {
    // Test lower bound
    simulator = new FlowRateSimulator(1, 0);
    
    // Force rate to drop
    vi.spyOn(Math, 'random').mockImplementation(() => 0);
    
    for (let i = 0; i < 20; i++) {
      simulator.update();
    }
    
    expect(simulator.getData().rate).toBeGreaterThanOrEqual(0);
    
    // Test upper bound
    simulator = new FlowRateSimulator(99, 100);
    
    // Force rate to rise
    vi.spyOn(Math, 'random').mockImplementation(() => 1);
    
    for (let i = 0; i < 20; i++) {
      simulator.update();
    }
    
    expect(simulator.getData().rate).toBeLessThanOrEqual(100);
  });
});
