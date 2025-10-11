import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL || "https://mrfranchisebackend.mrfranchise.in", {
  withCredentials: true,   // important if you use sessions
  transports: ["websocket"], // force websocket (more stable)
});

export default socket;
