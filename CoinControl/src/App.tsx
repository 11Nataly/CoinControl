import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'dashboard'>('login');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(user);
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (email: string) => {
    setCurrentUser(email);
    localStorage.setItem('currentUser', email);
    setCurrentView('dashboard');
  };

  const handleRegister = (email: string) => {
    setCurrentUser(email);
    localStorage.setItem('currentUser', email);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentView('login');
  };

  if (currentView === 'register') {
    return (
      <RegisterPage 
        onRegister={handleRegister}
        onSwitchToLogin={() => setCurrentView('login')}
      />
    );
  }

  if (currentView === 'dashboard' && currentUser) {
    return <Dashboard userEmail={currentUser} onLogout={handleLogout} />;
  }

  return (
    <LoginPage 
      onLogin={handleLogin}
      onSwitchToRegister={() => setCurrentView('register')}
    />
  );
}
