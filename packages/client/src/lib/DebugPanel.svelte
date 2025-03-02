<script lang="ts">
  import { onMount } from 'svelte';
  import socket from './socket';
  import type { SocketData } from './types';
  
  interface EventLog {
    type: string;
    data: SocketData;
    timestamp: string;
  }
  
  export let events: EventLog[] = [];
  let expanded = false;
  const MAX_EVENTS = 100;
  
  function togglePanel(): void {
    expanded = !expanded;
  }
  
  function clearEvents(): void {
    events = [];
  }
  
  function addEvent(type: string, data: SocketData): void {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    events = [{ type, data, timestamp }, ...events.slice(0, MAX_EVENTS - 1)];
  }
  
  function formatData(data: SocketData): string {
    if (data === undefined) return 'undefined';
    if (data === null) return 'null';
    
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return String(data);
    }
  }
  
  // Socket event types we're interested in
  const eventTypes: string[] = [
    'connect',
    'disconnect',
    'temperature:update',
    'temperature:control',
    'pressure:update',
    'pressure:release',
    'flow:update',
    'flow:valve-adjust'
  ];
  
  // Generic handler for all event types
  function createHandler(eventType: string) {
    return (data: SocketData) => addEvent(eventType, data);
  }
  
  // Set up listeners for all socket events
  const handlers: Record<string, (data: SocketData) => void> = {};
  eventTypes.forEach(eventType => {
    const handler = createHandler(eventType);
    handlers[eventType] = handler;
    socket.on(eventType, handler);
  });
  
  onMount(() => {
    return () => {
      // Clean up all event listeners
      Object.entries(handlers).forEach(([eventType, handler]) => {
        socket.off(eventType, handler);
      });
    };
  });
</script>

<div class="debug-panel" class:expanded>
  <button class="debug-panel__toggle" on:click={togglePanel}>
    {expanded ? 'Hide' : 'Show'} Debug Panel
  </button>
  
  {#if expanded}
    <div class="debug-panel__content">
      <div class="debug-panel__header">
        <h3>Socket Events</h3>
        <button class="debug-panel__clear" on:click={clearEvents}>Clear</button>
      </div>
      
      <div class="debug-panel__events">
        {#if events.length === 0}
          <div class="debug-panel__empty">No events recorded yet</div>
        {:else}
          {#each events as event}
            <div class="debug-panel__event">
              <div class="debug-panel__event-header">
                <span class="debug-panel__event-type">{event.type}</span>
                <span class="debug-panel__event-time">{event.timestamp}</span>
              </div>
              <pre class="debug-panel__event-data">{formatData(event.data)}</pre>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .debug-panel {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 1000;
    
    &__toggle {
      background: #333;
      color: white;
      border: none;
      border-top-left-radius: 4px;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 12px;
    }
    
    &__content {
      background: rgba(0, 0, 0, 0.85);
      border-top-left-radius: 4px;
      width: 400px;
      max-height: 50vh;
      overflow-y: auto;
    }
    
    &__header {
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #444;
      
      h3 {
        margin: 0;
        font-size: 14px;
        color: white;
      }
    }
    
    &__clear {
      background: transparent;
      color: #aaa;
      border: 1px solid #666;
      border-radius: 2px;
      padding: 2px 8px;
      font-size: 12px;
      cursor: pointer;
      
      &:hover {
        background: #444;
      }
    }
    
    &__events {
      max-height: 300px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    
    &__empty {
      padding: 12px;
      color: #999;
      font-style: italic;
      font-size: 13px;
    }
    
    &__event {
      padding: 8px 12px;
      border-bottom: 1px solid #444;
      
      &:last-child {
        border-bottom: none;
      }
    }
    
    &__event-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    
    &__event-type {
      color: #4ade80;
      font-weight: bold;
      font-size: 13px;
    }
    
    &__event-time {
      color: #999;
      font-size: 12px;
    }
    
    &__event-data {
      margin: 0;
      font-size: 12px;
      color: #ccc;
      white-space: pre-wrap;
      overflow-x: auto;
    }
  }
</style>
