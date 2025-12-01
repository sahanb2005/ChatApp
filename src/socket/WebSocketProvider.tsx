import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface WebSocketContextValue {
  socket: WebSocket | null;
  isConnected: boolean;
  userId: number;
  sendMessage: (data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode; userId: number }> = ({
  children,
  userId,
}) => {
  const [isConnected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    const wsBaseUrl = process.env.EXPO_PUBLIC_WS_URL?.startsWith("ws")
      ? process.env.EXPO_PUBLIC_WS_URL
      : `wss://${process.env.EXPO_PUBLIC_WS_URL}`;

    console.log("Connecting to WebSocket:", `${wsBaseUrl}/ChatApp/chat?userId=${userId}`);

    const socket = new WebSocket(`${wsBaseUrl}/ChatApp/chat?userId=${userId}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnected(true);
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    };

    socket.onclose = (e) => {
      console.log("⚠️ WebSocket disconnected", e.reason);
      setConnected(false);
      attemptReconnect();
    };

    socket.onerror = (error) => {
      console.log("❌ WebSocket error:", JSON.stringify(error, null, 2));
      socket.close(); // trigger reconnect
    };
  };

  const attemptReconnect = () => {
    if (!reconnectTimer.current) {
      reconnectTimer.current = setTimeout(() => {
        console.log("🔄 Reconnecting WebSocket...");
        connect();
      }, 4000); // wait 4 seconds before retry
    }
  };

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      socketRef.current?.close();
    };
  }, [userId]);

  const sendMessage = (data: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ ...data, userId }));
    } else {
      console.log("⚠️ Cannot send, socket not open");
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        userId,
        sendMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWebSocket must be used inside WebSocketProvider");
  return ctx;
};
