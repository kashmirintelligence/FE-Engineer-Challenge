import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App.svelte';
import * as socketModule from '../lib/socket';

// Mock socket
vi.mock('../lib/socket', () => {
  const connected = { 
    subscribe: vi.fn(callback => {
      callback(false);
      return () => {};
    }),
    set: vi.fn()
  };
  
  return {
    connected,
    default: {
      connect: vi.fn(),
      disconnect: vi.fn(),
      emit: vi.fn()
    }
  };
});

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the header and placeholders', () => {
    render(App);
    expect(screen.getByText('Refinery Monitoring Dashboard')).toBeTruthy();
    expect(screen.getByText('Temperature System')).toBeTruthy();
    expect(screen.getByText('Pressure Vessel')).toBeTruthy();
    expect(screen.getByText('Flow Rate Monitor')).toBeTruthy();
  });

  it('starts with Start button and Disconnected status', () => {
    render(App);
    expect(screen.getByText('Start')).toBeTruthy();
    expect(screen.getByText('Disconnected')).toBeTruthy();
  });

  it('connects when Start button is clicked', async () => {
    render(App);
    const startButton = screen.getByText('Start');
    await fireEvent.click(startButton);
    expect(socketModule.default.connect).toHaveBeenCalled();
  });

  it('resets simulation when Reset button is clicked', async () => {
    render(App);
    const resetButton = screen.getByText('Reset');
    await fireEvent.click(resetButton);
    expect(socketModule.default.emit).toHaveBeenCalledWith('simulation:reset');
  });

  it('displays timer that starts at 0', () => {
    render(App);
    const timerElement = screen.getByText('0.000s');
    expect(timerElement).toBeTruthy();
  });
});
