// src/services/socketService.js
import { io } from 'socket.io-client';
import { getToken } from './authService';

let socket = null;

export function connectSocket() {
  if (!socket) {
    const token = getToken();
    socket = io(import.meta.env.VITE_API_URL, {
      auth: {
        token,
      },
    });

    socket.on('connect', () => {
      console.log('Соединение с WebSocket установлено');
    });

    socket.on('disconnect', () => {
      console.log('Соединение с WebSocket разорвано');
    });

    socket.on('connect_error', (error) => {
      console.error('Ошибка соединения WebSocket:', error);
    });
  }
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function onScheduleUpdated(callback) {
  if (socket) {
    socket.on('schedule.updated', callback);
  }
}

export function offScheduleUpdated(callback) {
  if (socket) {
    socket.off('schedule.updated', callback);
  }
}
