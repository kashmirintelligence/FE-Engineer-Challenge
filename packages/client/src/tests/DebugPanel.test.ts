import { render, screen, fireEvent, tick } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DebugPanel from '../lib/DebugPanel.svelte';
import type { SocketData } from '../lib/types';
import socket from '../lib/socket'; // Added import for socket

interface EventLog {
  type: string;
  data: SocketData;
  timestamp: string;
}

vi.mock('../lib/socket', () => ({
  default: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
  }
}));

describe('DebugPanel Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders collapsed by default', () => {
    render(DebugPanel);
    expect(screen.getByText('Show Debug Panel')).toBeTruthy();
    expect(screen.queryByText('Socket Events')).toBeFalsy();
  });

  it('expands when toggle button is clicked', async () => {
    render(DebugPanel);
    const toggleButton = screen.getByText('Show Debug Panel');
    await fireEvent.click(toggleButton);
    expect(screen.getByText('Hide Debug Panel')).toBeTruthy();
    expect(screen.getByText('Socket Events')).toBeTruthy();
    expect(screen.getByText('No events recorded yet')).toBeTruthy();
  });

  it('subscribes to socket events when mounted', () => {
    render(DebugPanel);
    expect(socket.on).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
    expect(socket.on.mock.calls.length).toBeGreaterThanOrEqual(8); // Check for at least 8 calls
  });

  it('clears events when clear button is clicked', async () => {
    const eventsData = [{ type: 'test', data: { value: 123 }, timestamp: '12:34:56.789' }];
    const { component } = render(DebugPanel, { props: { events: eventsData } });
    const toggleButton = await screen.findByText('Show Debug Panel');
    await fireEvent.click(toggleButton);
    expect(screen.getByText('test')).toBeTruthy();
    expect(screen.getByText('12:34:56.789')).toBeTruthy();
    const clearButton = await screen.findByText('Clear');
    await fireEvent.click(clearButton);
    expect(screen.getByText('No events recorded yet')).toBeTruthy();
  });
});
