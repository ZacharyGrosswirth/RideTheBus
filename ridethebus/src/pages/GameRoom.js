import React, { useEffect, useState } from 'react';
import { useSocket }         from '../hooks/socketContext';
import { useParams, useLocation } from 'react-router-dom';

export default function GameRoom() {
  const { roomId } = useParams();
  const { state }  = useLocation();
  const socket     = useSocket();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', { name: state.name, room: roomId, password: state.password }, res => {
      if (res.status !== 'ok') alert(res.message);
    });

    socket.on('userList', list => {
      setUsers(list);
    });
  }, [roomId, socket, state.name, state.password]);

  return (
    <div>
      <h2>Room {roomId}</h2>
      <h3>Players:</h3>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
      {/* …your game UI… */}
    </div>
  );
}