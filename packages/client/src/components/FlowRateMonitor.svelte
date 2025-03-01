<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { FlowRateData } from 'shared';
  
  // Props
  export let flowRate: FlowRateData;
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Handle valve adjustment
  function handleValveAdjust(event: Event) {
    const value = parseFloat((event.target as HTMLInputElement).value);
    dispatch('adjust', value);
  }
  
  // Derived values for visualization
  $derived flowSpeed = flowRate.rate * 10; // Map to animation speed (ms)
  $derived flowOpacity = flowRate.rate / 100; // Map to opacity
  $derived pipeColor = getEfficiencyColor(flowRate.efficiency);
  
  // Get color based on efficiency value
  function getEfficiencyColor(efficiency: number): string {
    if (efficiency >= 80) return 'var(--normal)';
    if (efficiency >= 50) return 'var(--warning)';
    return 'var(--critical)';
  }
  
  // Calculate flow animation duration based on rate
  $derived animationDuration = Math.max(100, 1000 - flowSpeed * 9) + 'ms';
</script>

<div class="bg-factory-dark border border-gray-700 rounded-lg shadow-lg p-4">
  <h2 class="text-xl font-bold mb-4">Flow Rate Monitor</h2>
  
  <div class="flex justify-between items-center mb-4">
    <div>
      <span class="text-sm">Flow Rate:</span>
      <span class="text-2xl font-bold ml-2">{flowRate.rate.toFixed(1)}%</span>
    </div>
    <div>
      <span class="text-sm">Efficiency:</span>
      <span class="text-2xl font-bold ml-2" style="color: {pipeColor}">
        {flowRate.efficiency.toFixed(1)}%
      </span>
    </div>
  </div>
  
  <!-- Pipe visualization -->
  <div class="relative h-24 mb-6 bg-gray-800 rounded-lg overflow-hidden">
    <!-- Pipe body -->
    <div class="absolute inset-0 flex items-center">
      <div class="w-full h-12 bg-gray-700"></div>
    </div>
    
    <!-- Flow animation -->
    <div 
      class="absolute inset-y-0 left-0 w-full flex items-center"
      style="opacity: {flowOpacity}"
    >
      <div class="w-full h-8 overflow-hidden relative">
        <!-- Animated flow pattern -->
        <div 
          class="absolute inset-0"
          style="
            background: repeating-linear-gradient(
              to right,
              transparent,
              transparent 20px,
              {pipeColor} 20px,
              {pipeColor} 40px
            );
            animation: flowAnimation {animationDuration} linear infinite;
          "
        ></div>
      </div>
    </div>
    
    <!-- Valve indicator -->
    <div 
      class="absolute top-0 bottom-0 w-1 bg-white"
      style="left: calc({flowRate.valvePosition}% - 2px);"
    ></div>
  </div>
  
  <!-- Valve control -->
  <div class="space-y-2">
    <label class="block text-sm">
      Valve Position: {flowRate.valvePosition.toFixed(1)}%
    </label>
    <input 
      type="range" 
      min="0" 
      max="100" 
      step="1" 
      class="w-full"
      value={flowRate.valvePosition}
      on:input={handleValveAdjust}
    />
    <div class="flex justify-between text-xs text-gray-400">
      <span>Closed</span>
      <span>Open</span>
    </div>
  </div>
  
  <!-- Efficiency explanation -->
  <div class="mt-4 text-sm text-gray-400">
    <p>Efficiency is optimal at mid-range valve positions. Too open or too closed reduces efficiency.</p>
  </div>
</div>