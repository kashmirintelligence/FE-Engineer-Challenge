import { PressureData, ThresholdStatus, PRESSURE_FLUCTUATION } from '../lib';

export class PressureSimulator {
  private pressure: number;
  private warningThreshold: number;
  private criticalThreshold: number;
  private trend: number = 0.2; // Natural increasing trend
  
  constructor(
    initialPressure: number,
    warningThreshold: number,
    criticalThreshold: number
  ) {
    this.pressure = initialPressure;
    this.warningThreshold = warningThreshold;
    this.criticalThreshold = criticalThreshold;
  }
  
  public update(): void {
    // Random fluctuation
    const randomChange = (Math.random() - 0.5) * PRESSURE_FLUCTUATION;
    
    // Calculate new pressure
    this.pressure += randomChange + this.trend;
    
    // Constraints
    if (this.pressure < 0) {
      this.pressure = 0;
    } else if (this.pressure > 100) {
      this.pressure = 100;
    }
    
    // If pressure gets very high, natural slowdown
    if (this.pressure > 95) {
      this.trend = -0.1; // Start decreasing
    } else if (this.pressure < 20) {
      this.trend = 0.2; // Reset trend to increasing
    }
  }
  
  public getData(): PressureData {
    let status: ThresholdStatus = 'normal';
    
    if (this.pressure >= this.criticalThreshold) {
      status = 'critical';
    } else if (this.pressure >= this.warningThreshold) {
      status = 'warning';
    }
    
    return {
      timestamp: Date.now(),
      value: parseFloat(this.pressure.toFixed(1)),
      status
    };
  }
  
  public emergencyRelease(): void {
    // Emergency release drops pressure by 30%
    this.pressure = Math.max(0, this.pressure - 30);
    this.trend = 0.05; // Reset trend to slow increase
  }
}