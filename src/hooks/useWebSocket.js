import { useEffect, useRef, useState, useCallback } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
const RECONNECT_INTERVAL = parseInt(import.meta.env.VITE_WS_RECONNECT_INTERVAL) || 5000;

/**
 * Custom hook for WebSocket connection with auto-reconnect
 */
export function useWebSocket(onMessage, enabled = true) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    if (!enabled) return;

    try {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;

        // Attempt to reconnect with exponential backoff
        if (enabled) {
          const backoff = Math.min(
            RECONNECT_INTERVAL * Math.pow(2, reconnectAttemptsRef.current),
            30000
          );
          reconnectAttemptsRef.current += 1;

          console.log(`Reconnecting in ${backoff}ms (attempt ${reconnectAttemptsRef.current})...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, backoff);
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      setError(err.message);
    }
  }, [enabled, onMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  const send = useCallback((data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    error,
    send,
    reconnect: connect,
  };
}
