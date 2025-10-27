import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useWebSocket } from '../useWebSocket';

describe('useWebSocket', () => {
  it('should connect to WebSocket server', async () => {
    const onMessage = vi.fn();
    
    const { result } = renderHook(() => useWebSocket(onMessage, true));

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });
  });

  it('should handle incoming messages', async () => {
    const onMessage = vi.fn();
    const testData = { type: 'reading', payload: { deviceId: 'test', value: 42 } };

    const { result } = renderHook(() => useWebSocket(onMessage, true));

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    // Simulate message
    const ws = global.WebSocket.mock.instances[0];
    ws.onmessage({ data: JSON.stringify(testData) });

    expect(onMessage).toHaveBeenCalledWith(testData);
  });

  it('should not connect when disabled', () => {
    const onMessage = vi.fn();
    
    const { result } = renderHook(() => useWebSocket(onMessage, false));

    expect(result.current.isConnected).toBe(false);
  });
});
