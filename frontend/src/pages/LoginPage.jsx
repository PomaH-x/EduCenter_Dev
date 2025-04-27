// src/pages/LoginPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithTelegram } from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.TelegramLoginWidget = {
      dataOnauth: async (user) => {
        try {
          await loginWithTelegram({
            telegramId: user.id,
            username: user.username,
            signature: user.hash,
          });
          navigate('/');
        } catch (error) {
          console.error('Ошибка при авторизации:', error);
          alert('Не удалось войти через Telegram');
        }
      },
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'ТВОЙ_BOT_USERNAME'); // ЗАМЕНИ на username твоего бота
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
    script.async = true;
    document.getElementById('telegram-button-container').appendChild(script);

    return () => {
      document.getElementById('telegram-button-container').innerHTML = '';
    };
  }, [navigate]);

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <div id="telegram-button-container"></div>
    </div>
  );
};

export default LoginPage;
