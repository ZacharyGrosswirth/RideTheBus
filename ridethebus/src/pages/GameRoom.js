import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../utils/socketContext";
import { getOrCreateUser, clearUser } from "../utils/session";

export default function Game() {
  const socket = useSocket();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [users, setUsers] = useState([]);

  const user = getOrCreateUser();
  const { id: token, name, roomCode, passcode } = user;

  useEffect(() => {
    if (!token || roomCode !== roomId || !name || !passcode) {
      navigate("/");
      return;
    }

    //Immediately re-join on mount
    socket.emit(
      "joinRoom",
      { userId: token, name, roomCode: roomId, password: passcode },
      (res) => {
        if (res.status !== "ok") {
          alert("Failed to join game: " + res.message);
          navigate("/");
        }
      }
    );

    // Handlers
    const handleUserList = (list) => setUsers(list);
    const handleKicked = () => {
      alert("You have been removed from the room.");
      localStorage.clear();
      navigate("/");
    };
    const handleConnect = () => {
      socket.emit(
        "joinRoom",
        { token, name, roomCode: roomId, password: passcode },
        () => {}
      );
    };

    // Subscriptions
    socket.on("userList", handleUserList);
    socket.on("kicked", handleKicked);
    socket.on("connect", handleConnect);

    return () => {
      socket.off("userList", handleUserList);
      socket.off("kicked", handleKicked);
      socket.off("connect", handleConnect);
    };
  }, [socket, navigate, token, roomId, name, passcode]);

  // Host actions
  const hostToken = users.find((u) => u.isHost)?.token;

  const removePlayer = (removeToken) => {
    socket.emit("removePlayer", { token, roomId, removeToken }, (res) => {
      if (res.status !== "ok") alert(res.message);
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Room: {roomId}</h2>

      <h3>game started</h3>

      <ul>
        {users.map((u) => (
          <li key={u.token} style={{ margin: "0.5rem 0" }}>
            {u.name} {u.connected ? "" : "(offline)"}{" "}
            {u.token === hostToken && "(Host)"}
            {token === hostToken && u.token !== hostToken && (
              <button
                style={{ marginLeft: "1rem" }}
                onClick={() => removePlayer(u.token)}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
