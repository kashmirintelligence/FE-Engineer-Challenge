import { describe, it, expect } from 'vitest';
import './temperatureSimulator.test';
import './pressureSimulator.test';
import './flowRateSimulator.test';

// Main test suite wrapper
describe('Refinery Simulators', () => {
  it('passes sanity check', () => {
    expect(true).toBe(true);
  });
});

