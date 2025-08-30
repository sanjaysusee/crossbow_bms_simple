import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { TemperatureControl } from './components/TemperatureControl';
import { Reports } from './components/Reports';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cookies, setCookies] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'main' | 'reports'>('main');

  // Check for existing session on app load
  useEffect(() => {
    const savedSession = localStorage.getItem('bms-session');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        setCookies(sessionData.cookies);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('bms-session');
      }
    }
  }, []);

  // Handle navigation
  useEffect(() => {
    const handleNavigation = () => {
      if (window.location.pathname === '/reports') {
        setCurrentView('reports');
      } else {
        setCurrentView('main');
      }
    };

    handleNavigation();
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  const handleLoginSuccess = (loginCookies: any) => {
    setCookies(loginCookies);
    setIsLoggedIn(true);
    
    // Save session to localStorage
    localStorage.setItem('bms-session', JSON.stringify({
      cookies: loginCookies,
      timestamp: Date.now(),
    }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCookies(null);
    setCurrentView('main');
    
    // Clear session from localStorage
    localStorage.removeItem('bms-session');
    
    // Reset URL
    window.history.pushState({}, '', '/');
  };

  const handleViewChange = (view: 'main' | 'reports') => {
    console.log('handleViewChange called with view:', view);
    console.log('Current view before change:', currentView);
    setCurrentView(view);
    if (view === 'reports') {
      window.history.pushState({}, '', '/reports');
    } else {
      window.history.pushState({}, '', '/');
    }
    console.log('Current view after change:', view);
  };

  // Debug logging
  console.log('Rendering App with currentView:', currentView, 'isLoggedIn:', isLoggedIn);
  
  // Temporary test - force reports view for debugging
  const forceReportsView = false; // Set to true to test Reports component
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh' }}>
        {!isLoggedIn ? (
          <Login onLogin={handleLoginSuccess} />
        ) : forceReportsView || currentView === 'reports' ? (
          <Reports onLogout={handleLogout} onNavigate={handleViewChange} />
        ) : (
          <TemperatureControl onLogout={handleLogout} onNavigate={handleViewChange} />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;