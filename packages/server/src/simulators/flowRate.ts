import { FlowRateData, FLOW_FLUCTUATION } from '../lib';

export class FlowRateSimulator {
  private rate: number;
  private valvePosition: number;
  
  constructor(initialRate: number, initialValvePosition: number) {
    this.rate = initialRate;
    this.valvePosition = initialValvePosition;
  }
  
  public update(): void {
    // Random fluctuation
    const randomChange = (Math.random() - 0.5) * FLOW_FLUCTUATION;
    
    // Flow rate is influenced by valve position with some randomness
    const targetRate = this.valvePosition * 0.9; // Maximum 90% of valve position
    const rateAdjustment = (targetRate - this.rate) * 0.2; // Gradual adjustment
    
    this.rate += randomChange + rateAdjustment;
    
    // Constraints
    if (this.rate < 0) {
      this.rate = 0;
    } else if (this.rate > 100) {
      this.rate = 100;
    }
  }
  
  public getData(): FlowRateData {
    // Calculate efficiency
    // Efficiency is best at mid-range valve positions, worse at extremes
    const optimalPoint = 50; // Optimal valve position
    const distanceFromOptimal = Math.abs(this.valvePosition - optimalPoint);
    const baseEfficiency = 100 - (distanceFromOptimal / 2); // Reduced by distance from optimal
    
    // Add some random variation to efficiency
    const efficiency = Math.min(100, Math.max(0, 
      baseEfficiency + (Math.random() - 0.5) * 5
    ));
    
    return {
      timestamp: Date.now(),
      rate: parseFloat(this.rate.toFixed(1)),
      valvePosition: parseFloat(this.valvePosition.toFixed(1)),
      efficiency: parseFloat(efficiency.toFixed(1))
    };
  }
  
  public adjustValve(position: number): void {
    this.valvePosition = Math.min(100, Math.max(0, position));
  }
}