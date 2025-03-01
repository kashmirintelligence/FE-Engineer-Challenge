<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { io, Socket } from 'socket.io-client';
  import { SocketEvents } from 'shared';
  
  import TemperatureSystem from './components/TemperatureSystem.svelte';
  import PressureVessel from './components/PressureVessel.svelte';
  import FlowRateMonitor from './components/FlowRateMonitor.svelte';
  
  let socket: Socket;
  
  // Using Svelte 5 runes for state
  let $state = {
    connected: false,
    temperature: null,
    pressure: null,
    flowRate: null,
  };
  
  onMount(() => {
    // Connect to the Socket.IO server
    socket = io('http://localhost:3001');
    
    socket.on(SocketEvents.CONNECT, () => {
      $state.connected = true;
    });
    
    socket.on(SocketEvents.DISCONNECT, () => {
      $state.connected = false;
    });
    
    socket.on(SocketEvents.TEMPERATURE_UPDATE, (data) => {
      $state.temperature = data;
    });
    
    socket.on(SocketEvents.PRESSURE_UPDATE, (data) => {
      $state.pressure = data;
    });
    
    socket.on(SocketEvents.FLOW_UPDATE, (data) => {
      $state.flowRate = data;
    });
    
    return () => {
      socket.disconnect();
    };
  });
  
  // Handler functions to pass to components
  function handleTemperatureControl(event: CustomEvent) {
    socket.emit(SocketEvents.TEMPERATURE_CONTROL, event.detail);
  }
  
  function handlePressureRelease() {
    socket.emit(SocketEvents.PRESSURE_RELEASE);
  }
  
  function handleValveAdjust(event: CustomEvent) {
    socket.emit(SocketEvents.FLOW_VALVE_ADJUST, event.detail);
  }
</script>

<main class="min-h-screen p-4 md:p-8">
  <div class="max-w-7xl mx-auto">
    <header class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Refinery Monitoring Dashboard</h1>
      <div class="flex items-center">
        <div class="w-3 h-3 rounded-full mr-2 {$state.connected ? 'bg-normal' : 'bg-critical'}"></div>
        <span>{$state.connected ? 'Connected' : 'Disconnected'}</span>
      </div>
    </header>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#if $state.temperature}
        <TemperatureSystem 
          temperature={$state.temperature} 
          on:control={handleTemperatureControl} 
        />
      {/if}
      
      {#if $state.pressure}
        <PressureVessel 
          pressure={$state.pressure} 
          on:release={handlePressureRelease} 
        />
      {/if}
      
      {#if $state.flowRate}
        <FlowRateMonitor 
          flowRate={$state.flowRate} 
          on:adjust={handleValveAdjust} 
        />
      {/if}
    </div>
  </div>
</main>