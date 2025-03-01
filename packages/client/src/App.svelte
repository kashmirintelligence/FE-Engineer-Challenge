<script lang="ts">
  // Nothing but a simple dark mode page with header
  let connected = true;
</script>

<main class="min-h-screen p-6 bg-panel">
  <div class="max-w-7xl mx-auto">
    <!-- Header bar -->
    <header class="bg-card rounded-lg p-5 mb-8 flex justify-between items-center shadow-lg">
      <h1 class="text-2xl font-bold">Refinery Monitoring Dashboard</h1>
      <div class="flex items-center">
        <div class="w-3 h-3 rounded-full mr-2" class:bg-normal={connected} class:bg-critical={!connected}></div>
        <span>{connected ? 'Connected' : 'Disconnected'}</span>
      </div>
    </header>
    
    <!-- Empty content area -->
    <div>
      <!-- Absolutely nothing else here yet -->
    </div>
  </div>
</main>