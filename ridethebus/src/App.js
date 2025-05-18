import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Lobby from './pages/Lobby';
import WaitingRoom from './pages/Waiting';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Lobby />} />
        <Route path="/waiting" element={<WaitingRoom />} />
      </Routes>
    </BrowserRouter>
  );
}