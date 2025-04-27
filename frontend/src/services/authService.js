// src/services/authService.js

export async function loginWithTelegram({ telegramId, username, signature }) {
    const response = await fetch('/api/auth/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ telegramId, username, signature }),
    });
  
    if (!response.ok) {
      throw new Error('Ошибка авторизации');
    }
  
    const { token } = await response.json();
    localStorage.setItem('token', token);
  }
  