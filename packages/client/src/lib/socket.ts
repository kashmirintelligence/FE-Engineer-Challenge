import { io, Socket } from 'socket.io-client';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { SocketData } from './types';

// Connection status store
export const connected: Writable<boolean> = writable(false);

// Create socket instance with autoConnect: false
const socket: Socket = io('http://localhost:3001', { autoConnect: false });

// Connection events
socket.on('connect', () => {
  connected.set(true);
});

socket.on('disconnect', () => {
  connected.set(false);
});

// Add typed methods to the socket
export function emit(event: string, data?: SocketData): void {
  socket.emit(event, data);
}

export default socket;
