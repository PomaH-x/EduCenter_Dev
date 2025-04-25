import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import AdminPage from './pages/AdminPage';
import Shell from './components/Shell';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Shell />}>
        <Route index element={<CalendarPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;
