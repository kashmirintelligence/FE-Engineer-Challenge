import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PressureSimulator } from '../simulators/pressure';

describe('PressureSimulator', () => {
  // Mock Date.now for consistent timestamps in tests
  vi.spyOn(Date, 'now').mockImplementation(() => 123456789);
  
  let simulator: PressureSimulator;
  
  beforeEach(() => {
    // Create a new simulator before each test with standard values
    simulator = new PressureSimulator(50, 75, 90);
    // Stable random for predictable test behavior
    vi.spyOn(Math, 'random').mockImplementation(() => 0.5);
  });
  
  it('should initialize with correct values', () => {
    const data = simulator.getData();
    expect(data.value).toBe(50);
    expect(data.status).toBe('normal');
    expect(data.timestamp).toBe(123456789);
  });
  
  it('should increase pressure over time by default', () => {
    const before = simulator.getData().value;
    
    // Update several times to see the increase
    for (let i = 0; i < 5; i++) {
      simulator.update();
    }
    
    const after = simulator.getData().value;
    expect(after).toBeGreaterThan(before);
  });
  
  it('should show warning status when above warning threshold', () => {
    // Get it above warning threshold
    simulator = new PressureSimulator(76, 75, 90);
    
    const data = simulator.getData();
    expect(data.status).toBe('warning');
  });
  
  it('should show critical status when above critical threshold', () => {
    // Get it above critical threshold
    simulator = new PressureSimulator(91, 75, 90);
    
    const data = simulator.getData();
    expect(data.status).toBe('critical');
  });
  
  it('should decrease pressure on emergency release', () => {
    // Start with high pressure
    simulator = new PressureSimulator(80, 75, 90);
    
    const before = simulator.getData().value;
    simulator.emergencyRelease();
    const after = simulator.getData().value;
    
    // Should drop by approximately 30%
    expect(after).toBe(50); // 80 - 30 = 50
    expect(after).toBeLessThan(before);
  });
  
  it('should not go below 0 or above 100 pressure', () => {
    // Test upper bound
    simulator = new PressureSimulator(99, 75, 90);
    
    // Force pressure to rise
    vi.spyOn(Math, 'random').mockImplementation(() => 1);
    
    for (let i = 0; i < 10; i++) {
      simulator.update();
    }
    
    expect(simulator.getData().value).toBeLessThanOrEqual(100);
    
    // Test lower bound
    simulator = new PressureSimulator(5, 75, 90);
    simulator.emergencyRelease(); // This should drop it below 0
    
    expect(simulator.getData().value).toBeGreaterThanOrEqual(0);
  });
  
  it('should start decreasing trend naturally when pressure is very high', () => {
    // Start with very high pressure
    simulator = new PressureSimulator(96, 75, 90);
    
    // Neutral random
    vi.spyOn(Math, 'random').mockImplementation(() => 0.5);
    
    const initial = simulator.getData().value;
    
    // Let it run for a while to observe natural trend
    for (let i = 0; i < 20; i++) {
      simulator.update();
    }
    
    const final = simulator.getData().value;
    
    // Pressure should naturally decrease when very high
    expect(final).toBeLessThan(initial);
  });
});
