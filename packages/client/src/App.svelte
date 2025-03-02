<script lang="ts">
  import { onMount } from 'svelte';
  import socket, { connected } from './lib/socket';
  
  // Using connected state directly instead of tracking separately
  let timer = 0;
  let intervalId = null;
  
  function toggleSimulation() {
    if (!$connected) {
      // Start simulation
      socket.connect();
      startTimer();
    } else {
      // Stop simulation but keep timer value
      socket.disconnect();
      stopTimer();
    }
  }
  
  function resetSimulation() {
    socket.emit('simulation:reset');
    resetTimer();
  }
  
  function startTimer() {
    if (!intervalId) {
      intervalId = setInterval(() => {
        timer += 10; // Add 10ms each tick
      }, 10);
    }
  }
  
  function stopTimer() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
  
  function resetTimer() {
    timer = 0;
  }
  
  function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}`;
  }
  
  onMount(() => {
    // Start disconnected
    socket.disconnect();
    
    return () => {
      socket.disconnect();
      stopTimer();
    };
  });
</script>

<main class="min-h-screen p-6 bg-panel">
  <div class="max-w-7xl mx-auto">
    <!-- Header bar -->
    <header class="bg-card rounded-lg p-5 mb-8 flex justify-between items-center shadow-lg">
      <h1 class="text-2xl font-bold">Refinery Monitoring Dashboard</h1>
      <div class="flex items-center gap-4">
        <div class="flex items-center">
          <button 
            class="px-3 py-1 mr-2 rounded bg-white text-black border border-gray-200" 
            on:click={toggleSimulation}
          >
            {$connected ? 'Stop' : 'Start'}
          </button>
          <button 
            class="px-3 py-1 rounded bg-white text-black border border-gray-200" 
            on:click={resetSimulation}
          >
            Reset
          </button>
        </div>
        
        <!-- Timer display -->
        <div class="font-mono text-white">
          {formatTime(timer)}s
        </div>
        
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full mr-2" class:bg-normal={$connected} class:bg-critical={!$connected}></div>
          <span>{$connected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
    </header>
    
    <!-- Dashboard Grid -->
    <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <!-- Temperature Panel -->
      <div class="dashboard__panel bg-card p-5 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4">Temperature System</h2>
        <div class="dashboard__visualization">
          <p class="text-text-secondary">Temperature visualization goes here</p>
        </div>
      </div>
      
      <!-- Pressure Panel -->
      <div class="dashboard__panel bg-card p-5 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4">Pressure Vessel</h2>
        <div class="dashboard__visualization">
          <p class="text-text-secondary">Pressure visualization goes here</p>
        </div>
      </div>
      
      <!-- Flow Rate Panel -->
      <div class="dashboard__panel bg-card p-5 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4">Flow Rate Monitor</h2>
        <div class="dashboard__visualization">
          <p class="text-text-secondary">Flow rate visualization goes here</p>
        </div>
      </div>
    </div>
  </div>
</main>