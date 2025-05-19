import { Routes, Route } from "react-router-dom";

import Lobby from "./pages/Lobby";
import WaitingRoom from "./pages/Waiting";
import GameRoom from "./pages/GameRoom";

export default function App() {
  return (
    <Routes>
      <Route index element={<Lobby />} />
      <Route path="/waiting/:roomId" element={<WaitingRoom />} />
      <Route path="/game/:roomId" element={<GameRoom />} />
    </Routes>
  );
}
