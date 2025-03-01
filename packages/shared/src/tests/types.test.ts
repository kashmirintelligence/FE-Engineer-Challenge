import { describe, it, expect } from 'vitest';
import { SocketEvents } from '../types';

describe('Types', () => {
  it('has expected socket events', () => {
    expect(SocketEvents.CONNECT).toBe('connect');
    expect(SocketEvents.TEMPERATURE_UPDATE).toBe('temperature:update');
  });
});
