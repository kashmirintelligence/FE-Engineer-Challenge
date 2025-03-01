import { TemperatureData, ThresholdStatus, TEMPERATURE_FLUCTUATION } from 'shared';

export class TemperatureSimulator {
  private temperature: number;
  private warningThreshold: number;
  private criticalThreshold: number;
  private cooling: boolean = false;
  private trend: number = 0.1; // Natural warming trend
  
  constructor(
    initialTemperature: number,
    warningThreshold: number,
    criticalThreshold: number
  ) {
    this.temperature = initialTemperature;
    this.warningThreshold = warningThreshold;
    this.criticalThreshold = criticalThreshold;
  }
  
  public update(): void {
    // Random fluctuation
    const randomChange = (Math.random() - 0.5) * TEMPERATURE_FLUCTUATION;
    
    // Apply cooling if enabled
    const coolingEffect = this.cooling ? -0.3 : 0;
    
    // Calculate new temperature
    this.temperature += randomChange + this.trend + coolingEffect;
    
    // Temperature can't go below ambient room temp (20°C)
    if (this.temperature < 20) {
      this.temperature = 20;
    }
    
    // If temperature gets too high, increase cooling trend naturally
    if (this.temperature > this.criticalThreshold) {
      this.trend = -0.2; // Start cooling down 
    } else if (this.temperature < this.warningThreshold) {
      this.trend = 0.1; // Reset trend to warming
    }
  }
  
  public getData(): TemperatureData {
    let status: ThresholdStatus = 'normal';
    
    if (this.temperature >= this.criticalThreshold) {
      status = 'critical';
    } else if (this.temperature >= this.warningThreshold) {
      status = 'warning';
    }
    
    return {
      timestamp: Date.now(),
      value: parseFloat(this.temperature.toFixed(1)),
      warningThreshold: this.warningThreshold,
      criticalThreshold: this.criticalThreshold
    };
  }
  
  public setWarningThreshold(threshold: number): void {
    this.warningThreshold = threshold;
  }
  
  public setCriticalThreshold(threshold: number): void {
    this.criticalThreshold = threshold;
  }
  
  public setCooling(enabled: boolean): void {
    this.cooling = enabled;
  }
}