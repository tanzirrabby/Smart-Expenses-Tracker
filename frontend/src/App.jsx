import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const handleLoginSuccess = (data) => {
    const tk = data.token;
    const userData = data.user;

    setToken(tk);
    setUser(userData);

    localStorage.setItem('token', tk);
    localStorage.setItem('user', JSON.stringify(userData));

    console.log("✅ Login Success - Redirecting to Dashboard");
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
    console.log("✅ Logged out");
  };

  return (
    <ThemeProvider>
      {/* Show login page if not authenticated */}
      {!token || !user ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        /* Show dashboard if authenticated */
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </ThemeProvider>
  );
}

export default App;