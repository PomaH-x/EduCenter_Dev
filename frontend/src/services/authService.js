// src/services/authService.js
import { fetchWithAuth } from './apiService';

const TOKEN_KEY = 'token';

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function loginWithTelegram({ telegramId, username, signature }) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/telegram`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ telegramId, username, signature }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Ошибка при авторизации через Telegram');
  }

  const data = await response.json();
  saveToken(data.token);
}
