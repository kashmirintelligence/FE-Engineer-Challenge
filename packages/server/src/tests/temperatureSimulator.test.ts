import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TemperatureSimulator } from '../simulators/temperature';

describe('TemperatureSimulator', () => {
  // Mock Date.now for consistent timestamps in tests
  vi.spyOn(Date, 'now').mockImplementation(() => 123456789);
  
  let simulator: TemperatureSimulator;
  
  beforeEach(() => {
    // Create a new simulator before each test with standard values
    simulator = new TemperatureSimulator(50, 70, 90);
  });
  
  it('should initialize with correct values', () => {
    const data = simulator.getData();
    expect(data.value).toBe(50);
    expect(data.warningThreshold).toBe(70);
    expect(data.criticalThreshold).toBe(90);
    expect(data.timestamp).toBe(123456789);
  });
  
  it('should update thresholds correctly', () => {
    simulator.setWarningThreshold(60);
    simulator.setCriticalThreshold(80);
    
    const data = simulator.getData();
    expect(data.warningThreshold).toBe(60);
    expect(data.criticalThreshold).toBe(80);
  });
  
  it('should decrease temperature when cooling is enabled', () => {
    // Set up controlled test
    simulator = new TemperatureSimulator(50, 70, 90);
    
    // Run updates without cooling
    simulator.setCooling(false);
    let beforeCooling = simulator.getData().value;
    
    // Replace random fluctuation with predictable behavior for test
    vi.spyOn(Math, 'random').mockImplementation(() => 0.5);
    
    for (let i = 0; i < 10; i++) {
      simulator.update();
    }
    
    const afterNoCooling = simulator.getData().value;
    
    // Should be increasing or staying roughly the same without cooling
    expect(afterNoCooling).toBeGreaterThanOrEqual(beforeCooling);
    
    // Now enable cooling and test again
    simulator.setCooling(true);
    beforeCooling = simulator.getData().value;
    
    for (let i = 0; i < 10; i++) {
      simulator.update();
    }
    
    const afterCooling = simulator.getData().value;
    
    // Should be decreasing with cooling
    expect(afterCooling).toBeLessThan(beforeCooling);
  });
  
  it('should not allow temperature to drop below 20°C', () => {
    simulator = new TemperatureSimulator(21, 70, 90);
    simulator.setCooling(true);
    
    // Force temperature to drop
    vi.spyOn(Math, 'random').mockImplementation(() => 0);
    
    // Update many times to try to push below minimum
    for (let i = 0; i < 100; i++) {
      simulator.update();
    }
    
    const data = simulator.getData();
    expect(data.value).toBeGreaterThanOrEqual(20);
  });
  
  it('should automatically start cooling when over critical threshold', () => {
    // Start near critical threshold
    simulator = new TemperatureSimulator(89, 70, 90);
    simulator.setCooling(false);
    
    // Force temperature to rise
    vi.spyOn(Math, 'random').mockImplementation(() => 1);
    
    // Update to exceed critical threshold
    for (let i = 0; i < 5; i++) {
      simulator.update();
    }
    
    // Check temperature is at or above critical
    let data = simulator.getData();
    expect(data.value).toBeGreaterThanOrEqual(90);
    
    // Now let natural cooling happen (trend should be negative)
    vi.spyOn(Math, 'random').mockImplementation(() => 0.5);
    
    const initialTemp = data.value;
    for (let i = 0; i < 20; i++) {
      simulator.update();
    }
    
    data = simulator.getData();
    // Temperature should start trending down even without manual cooling
    expect(data.value).toBeLessThan(initialTemp);
  });
});
