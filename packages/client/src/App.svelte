<script lang="ts">
  import { onMount } from 'svelte';
  import { io, Socket } from 'socket.io-client';
  import { SocketEvents } from 'shared';
  
  // Socket connection
  let socket: Socket;
  
  // Example of Svelte 5 runes - replace with your implementation
  const state = $state({
    connected: false,
    temperature: null,
    pressure: null,
    flowRate: null
  });
  
  onMount(() => {
    // Connect to the Socket.IO server
    socket = io('http://localhost:3001');
    
    socket.on(SocketEvents.CONNECT, () => {
      state.connected = true;
    });
    
    socket.on(SocketEvents.DISCONNECT, () => {
      state.connected = false;
    });
    
    // Listen for data updates
    socket.on(SocketEvents.TEMPERATURE_UPDATE, (data) => {
      state.temperature = data;
    });
    
    socket.on(SocketEvents.PRESSURE_UPDATE, (data) => {
      state.pressure = data;
    });
    
    socket.on(SocketEvents.FLOW_UPDATE, (data) => {
      state.flowRate = data;
    });
    
    return () => {
      socket.disconnect();
    };
  });
</script>

<main class="min-h-screen p-4 md:p-8">
  <div class="max-w-7xl mx-auto">
    <header class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Refinery Monitoring Dashboard</h1>
      <div class="flex items-center">
        <div class="w-3 h-3 rounded-full mr-2" class:bg-green-500={state.connected} class:bg-red-500={!state.connected}></div>
        <span>{state.connected ? 'Connected' : 'Disconnected'}</span>
      </div>
    </header>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Implement your monitoring panels here -->
      {#if state.temperature}
        <div class="border border-gray-700 rounded-lg p-4 text-center">
          <p>Temperature System Panel</p>
          <p>Current value: {state.temperature.value}°C</p>
          <p class="text-gray-400">Implement your component here</p>
        </div>
      {/if}
      
      {#if state.pressure}
        <div class="border border-gray-700 rounded-lg p-4 text-center">
          <p>Pressure Vessel Panel</p>
          <p>Current value: {state.pressure.value}%</p>
          <p class="text-gray-400">Implement your component here</p>
        </div>
      {/if}
      
      {#if state.flowRate}
        <div class="border border-gray-700 rounded-lg p-4 text-center">
          <p>Flow Rate Panel</p>
          <p>Current value: {state.flowRate.rate}%</p>
          <p class="text-gray-400">Implement your component here</p>
        </div>
      {/if}
    </div>
  </div>
</main>
