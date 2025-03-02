import { io, Socket } from 'socket.io-client';
import { writable } from 'svelte/store';

// Connection status store
export const connected = writable(false);

// Create socket instance with autoConnect: false
const socket: Socket = io('http://localhost:3001', { autoConnect: false });

// Connection events
socket.on('connect', () => {
  connected.set(true);
});

socket.on('disconnect', () => {
  connected.set(false);
});

export default socket;
