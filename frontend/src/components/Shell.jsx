// src/components/Shell.jsx
import { Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../utils/authService';
import { Button } from '@mui/material';

const Shell = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#161b22',
        borderBottom: '1px solid #00ffff',
      }}>
        <h1 style={{ color: '#00ffff', fontSize: '24px' }}>Расписание</h1>
        <Button
          onClick={handleLogout}
          variant="outlined"
          color="primary"
          size="small"
          style={{ borderColor: '#00ffff', color: '#00ffff' }}
        >
          Выйти
        </Button>
      </header>

      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Shell;
