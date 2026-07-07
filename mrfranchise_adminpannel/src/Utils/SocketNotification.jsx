import { io } from 'socket.io-client';
export const socket = io('https://mrfranchisebackend.mrfranchise.in', { transports: ['websocket'] });
