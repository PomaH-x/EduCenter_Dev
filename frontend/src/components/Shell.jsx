import { Link, Outlet } from 'react-router-dom';

const Shell = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#0ff',
      fontFamily: 'sans-serif'
    }}>
      {/* Верхняя панель */}
      <header style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid #0ff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#010B13'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>EduCenter</h1>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{ color: '#0ff', textDecoration: 'none' }}>Календарь</Link>
          <Link to="/admin" style={{ color: '#0ff', textDecoration: 'none' }}>Управление</Link>
          <Link to="/login" style={{ color: '#0ff', textDecoration: 'none' }}>Вход</Link>
        </nav>
      </header>

      {/* Контент */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Shell;
