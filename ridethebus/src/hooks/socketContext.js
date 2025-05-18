// SocketContext.js
import React, { createContext, useContext } from "react";
import { io } from "socket.io-client";

//const SOCKET_URL = "https://bus-server-zei8.onrender.com";
const SOCKET_URL = "http://localhost:4000";
export const socket = io(SOCKET_URL, {
  transports: ["websocket"]
});

const SocketContext = createContext(socket);

export function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const sock = useContext(SocketContext);
  if (!sock) {
    throw new Error("useSocket must be used inside a <SocketProvider>");
  }
  return sock;
}
