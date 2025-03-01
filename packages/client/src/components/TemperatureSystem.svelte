<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { TemperatureData } from 'shared';
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  
  // Props
  export let temperature: TemperatureData;
  
  // Local state using Svelte 5 runes
  let $state = {
    temperatureHistory: [] as TemperatureData[],
    warningThreshold: temperature.warningThreshold,
    criticalThreshold: temperature.criticalThreshold,
    cooling: false
  };
  
  $effect(() => {
    if (temperature) {
      // Add to history, keeping max 60 points
      $state.temperatureHistory = [
        ...$state.temperatureHistory.slice(-59),
        temperature
      ];
      
      // Update sliders if server thresholds change
      $state.warningThreshold = temperature.warningThreshold;
      $state.criticalThreshold = temperature.criticalThreshold;
    }
  });
  
  // SVG dimensions
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 400 - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom;
  
  let svg: SVGElement;
  
  onMount(() => {
    // Initialize D3 chart
    const svgEl = d3.select(svg);
    
    // Clear existing content
    svgEl.selectAll("*").remove();
    
    const chartGroup = svgEl
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // X scale
    const x = d3.scaleLinear()
      .domain([0, 59]) // 60 data points
      .range([0, width]);
    
    // Y scale
    const y = d3.scaleLinear()
      .domain([0, 100]) // Temperature in Celsius
      .range([height, 0]);
    
    // Line generator
    const line = d3.line<TemperatureData>()
      .x((d, i) => x(i))
      .y(d => y(d.value));
    
    // Add the X Axis
    chartGroup.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5));
    
    // Add the Y Axis
    chartGroup.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));
    
    // Add the line path
    chartGroup.append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5);
    
    // Add warning threshold line
    chartGroup.append("line")
      .attr("class", "warning-line")
      .attr("stroke", "var(--warning)")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "5,5");
    
    // Add critical threshold line
    chartGroup.append("line")
      .attr("class", "critical-line")
      .attr("stroke", "var(--critical)")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "5,5");
    
    // Update function
    function updateChart() {
      if ($state.temperatureHistory.length === 0) return;
      
      // Update line
      svgEl.select(".line")
        .datum($state.temperatureHistory)
        .attr("d", line);
      
      // Update warning threshold
      svgEl.select(".warning-line")
        .attr("x1", 0)
        .attr("y1", y($state.warningThreshold))
        .attr("x2", width)
        .attr("y2", y($state.warningThreshold));
      
      // Update critical threshold
      svgEl.select(".critical-line")
        .attr("x1", 0)
        .attr("y1", y($state.criticalThreshold))
        .attr("x2", width)
        .attr("y2", y($state.criticalThreshold));
      
      // Adjust Y domain based on data
      const maxTemp = Math.max(
        d3.max($state.temperatureHistory, d => d.value) || 0,
        $state.criticalThreshold + 10
      );
      y.domain([0, maxTemp]);
      
      // Update axes with transition
      svgEl.select(".y-axis")
        .transition()
        .duration(300)
        .call(d3.axisLeft(y));
    }
    
    // Set up the update interval
    const interval = setInterval(updateChart, 1000);
    
    return () => {
      clearInterval(interval);
    };
  });
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Threshold change handler
  function handleWarningThresholdChange(event: Event) {
    const value = parseFloat((event.target as HTMLInputElement).value);
    $state.warningThreshold = value;
    dispatch('control', { warningThreshold: value });
  }
  
  function handleCriticalThresholdChange(event: Event) {
    const value = parseFloat((event.target as HTMLInputElement).value);
    $state.criticalThreshold = value;
    dispatch('control', { criticalThreshold: value });
  }
  
  // Cooling toggle handler
  function toggleCooling() {
    $state.cooling = !$state.cooling;
    dispatch('control', { cooling: $state.cooling });
  }
  
  // Status color
  $derived statusColor = 
    temperature.value >= temperature.criticalThreshold
      ? 'text-critical'
      : temperature.value >= temperature.warningThreshold
        ? 'text-warning'
        : 'text-normal';
</script>

<div class="bg-factory-dark border border-gray-700 rounded-lg shadow-lg p-4">
  <h2 class="text-xl font-bold mb-4">Temperature System</h2>
  
  <div class="flex justify-between items-center mb-4">
    <div class="text-3xl font-bold {statusColor}">
      {temperature.value}°C
    </div>
    <button 
      class="px-4 py-2 rounded-md {$state.cooling ? 'bg-blue-500' : 'bg-gray-600'}"
      on:click={toggleCooling}
    >
      {$state.cooling ? 'Cooling On' : 'Cooling Off'}
    </button>
  </div>
  
  <div class="mb-4 bg-black bg-opacity-20 rounded-md p-2">
    <svg 
      bind:this={svg}
      width={width + margin.left + margin.right} 
      height={height + margin.top + margin.bottom}
      class="w-full"
    ></svg>
  </div>
  
  <div class="space-y-3">
    <div>
      <label class="block text-sm mb-1">
        Warning Threshold: {$state.warningThreshold}°C
      </label>
      <input 
        type="range" 
        min="20" 
        max="80" 
        step="1" 
        class="w-full"
        value={$state.warningThreshold}
        on:change={handleWarningThresholdChange}
      />
    </div>
    
    <div>
      <label class="block text-sm mb-1">
        Critical Threshold: {$state.criticalThreshold}°C
      </label>
      <input 
        type="range" 
        min="30" 
        max="90" 
        step="1" 
        class="w-full"
        value={$state.criticalThreshold}
        on:change={handleCriticalThresholdChange}
      />
    </div>
  </div>
</div>