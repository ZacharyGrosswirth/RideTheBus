import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./hooks/socketContext";

import Lobby from "./pages/Lobby";
import WaitingRoom from "./pages/Waiting";
import GameRoom from "./pages/GameRoom";

export default function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Lobby />} />
          <Route path="/waiting" element={<WaitingRoom />} />
          <Route path="/game/:roomId" element={<GameRoom />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}
