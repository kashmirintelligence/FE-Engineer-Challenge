<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { PressureData } from 'shared';
  
  // Props
  export let pressure: PressureData;
  
  // Gauge dimensions
  const radius = 120;
  const strokeWidth = 20;
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Emergency release function
  function handleEmergencyRelease() {
    dispatch('release');
  }
  
  // Calculate the arc path for the gauge
  function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  }
  
  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number): { x: number; y: number } {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }
  
  // Calculate angles for the gauge
  $derived startAngle = -180;
  $derived endAngle = -180 + (pressure.value / 100 * 180);
  
  // Status-based elements
  $derived warningVisible = pressure.status === 'warning' || pressure.status === 'critical';
  $derived criticalVisible = pressure.status === 'critical';
  $derived gaugeColor = 
    pressure.status === 'critical' ? 'var(--critical)' : 
    pressure.status === 'warning' ? 'var(--warning)' : 
    'var(--normal)';
  
  // Blinking effect for critical status
  let $state = {
    blinkVisible: true,
    warningMessage: ''
  };
  
  // Initialize warning message
  $effect(() => {
    if (pressure.status === 'warning') {
      $state.warningMessage = 'Pressure warning: consider release';
    } else if (pressure.status === 'critical') {
      $state.warningMessage = 'CRITICAL PRESSURE! Emergency release recommended';
    } else {
      $state.warningMessage = '';
    }
  });
  
  // Set up blinking effect
  let blinkInterval: number;
  
  $effect(() => {
    if (criticalVisible && !blinkInterval) {
      blinkInterval = setInterval(() => {
        $state.blinkVisible = !$state.blinkVisible;
      }, 500) as unknown as number;
    } else if (!criticalVisible && blinkInterval) {
      clearInterval(blinkInterval);
      blinkInterval = 0;
    }
  });
</script>

<div class="bg-factory-dark border border-gray-700 rounded-lg shadow-lg p-4">
  <h2 class="text-xl font-bold mb-4">Pressure Vessel</h2>
  
  <div class="flex flex-col items-center mb-4">
    <svg width="250" height="200" viewBox="0 0 250 200">
      <!-- Background arc -->
      <path 
        d={describeArc(125, 150, radius, -180, 0)}
        fill="none"
        stroke="#333"
        stroke-width={strokeWidth}
        stroke-linecap="round"
      />
      
      <!-- Value arc -->
      <path 
        d={describeArc(125, 150, radius, startAngle, endAngle)}
        fill="none"
        stroke={gaugeColor}
        stroke-width={strokeWidth}
        stroke-linecap="round"
      />
      
      <!-- Gauge ticks -->
      {#each Array(11) as _, i}
        {@const tickAngle = -180 + (i * 18)}
        {@const tickStart = polarToCartesian(125, 150, radius - strokeWidth/2 - 5, tickAngle)}
        {@const tickEnd = polarToCartesian(125, 150, radius - strokeWidth/2 + 15, tickAngle)}
        <line 
          x1={tickStart.x} 
          y1={tickStart.y} 
          x2={tickEnd.x} 
          y2={tickEnd.y} 
          stroke="white" 
          stroke-width="2"
        />
        
        {@const labelPos = polarToCartesian(125, 150, radius - strokeWidth/2 + 30, tickAngle)}
        <text 
          x={labelPos.x} 
          y={labelPos.y} 
          text-anchor="middle" 
          dominant-baseline="middle"
          fill="white"
          font-size="12"
        >
          {i * 10}
        </text>
      {/each}
      
      <!-- Center value text -->
      <text 
        x="125" 
        y="150" 
        text-anchor="middle" 
        dominant-baseline="middle"
        fill="white"
        font-weight="bold"
        font-size="24"
      >
        {pressure.value.toFixed(1)}%
      </text>
    </svg>
    
    <!-- Warning indicators -->
    {#if warningVisible}
      <div class="mt-2 text-center text-warning font-bold {criticalVisible && $state.blinkVisible ? 'text-critical' : ''}">
        {$state.warningMessage}
      </div>
    {/if}
  </div>
  
  <div class="mt-4 flex justify-center">
    <button 
      class="px-6 py-3 bg-critical text-white font-bold rounded-md shadow-lg hover:bg-red-600 transition-colors"
      on:click={handleEmergencyRelease}
    >
      EMERGENCY RELEASE
    </button>
  </div>
</div>