// src/pages/WaitingRoom.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../utils/socketContext";
import { getOrCreateUser, clearUser } from "../utils/session";

export default function WaitingRoom() {
  const socket = useSocket();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const user = getOrCreateUser();
  const [users, setUsers] = useState([]);
  const { id: userId, name, roomCode, passcode } = user;
  const payload = { userId, name, roomCode, password: passcode };

  useEffect(() => {
    // sanity check session vs URL
    if (!userId || roomCode !== roomId || !name || !passcode) {
      clearUser();
      return navigate("/");
    }

    socket.emit("joinRoom", payload, (res) => {
      if (res.status !== "ok") {
        console.warn("Rejoin failed:", res.message);
        clearUser();
        navigate("/");
      }
    });
  }, []);

  useEffect(() => {
    const handleUserList = (list) => setUsers(list);
    const handleGameStarted = () => {
      localStorage.setItem("roomId", roomId);
      navigate(`/game/${roomId}`);
    };
    const handleKicked = () => {
      alert("You’ve been kicked");
      clearUser();
      navigate("/");
    };

    socket.on("userList", handleUserList);
    socket.on("gameStarted", handleGameStarted);
    socket.on("kicked", handleKicked);

    return () => {
      socket.off("userList", handleUserList);
      socket.off("gameStarted", handleGameStarted);
      socket.off("kicked", handleKicked);
    };
  }, [socket, roomId, navigate]);

  // figure out who’s host
  const hostToken = users.find((u) => u.isHost)?.token;

  // host actions
  const startGame = () =>
    socket.emit("startGame", { token: hostToken, room: roomId }, (res) => {
      if (res.status !== "ok") alert("Error starting game: " + res.message);
    });

  const removePlayer = (removeToken) =>
    socket.emit(
      "removePlayer",
      { token: hostToken, room: roomId, removeToken },
      (res) => {
        if (res.status !== "ok") alert("Error removing player: " + res.message);
      }
    );

  return (
    <div style={{ padding: 20 }}>
      <h2>Room: {roomId}</h2>
      {user.id === hostToken && <button onClick={startGame}>Start Game</button>}
      <ul>
        {users.map((u) => (
          <li key={u.token}>
            {u.name} {u.connected ? "" : "(offline)"}{" "}
            {u.token === hostToken && "(Host)"}
            {user.id === hostToken && u.token !== hostToken && (
              <button onClick={() => removePlayer(u.token)}>Remove</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
