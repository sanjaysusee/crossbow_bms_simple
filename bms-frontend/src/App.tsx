import React, { useState, useEffect, useCallback } from 'react';
import { Login } from './components/Login';
import { SimpleTemperatureControl } from './components/SimpleTemperatureControl';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { bmsApi } from './services/bmsApi';
import { config, validateConfig } from './config/config';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  // Validate configuration on app start
  useEffect(() => {
    validateConfig();
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cookies, setCookies] = useState<any>(null);
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);
  const [manualLogout, setManualLogout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login function - for user-initiated login and session recovery
  const handleLogin = useCallback(async () => {
    if (isAutoLoggingIn || manualLogout) return; // Prevent if manually logged out
    
    setIsAutoLoggingIn(true);
    setError(null);
    try {
      console.log('User initiated login, attempting authentication...');
      const response = await bmsApi.login({
        username: config.bmsUsername,
        password: config.bmsPassword
      });
      
      console.log('Login successful:', response);
      setCookies(response.cookies);
      setIsLoggedIn(true);
      
      // Save session to localStorage
      localStorage.setItem('bms-session', JSON.stringify({
        cookies: response.cookies,
        timestamp: Date.now(),
        userInitiated: true,
      }));
      
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsAutoLoggingIn(false);
    }
  }, [isAutoLoggingIn, manualLogout]);

  // Check for existing session on app load only - NO automatic login
  useEffect(() => {
    const savedSession = localStorage.getItem('bms-session');
    const manualLogoutFlag = localStorage.getItem('manual-logout');
    
    if (manualLogoutFlag === 'true') {
      setManualLogout(true);
      return; // Don't auto-login if manually logged out
    }

    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        setCookies(sessionData.cookies);
        setIsLoggedIn(true);
        console.log('Restored session from localStorage');
      } catch (error) {
        console.error('Failed to restore session:', error);
        // Don't auto-login on app start - user must click "Access BMS"
        localStorage.removeItem('bms-session');
      }
    }
    // Don't auto-login on app start - user must explicitly click "Access BMS"
  }, []);

  const handleLoginSuccess = (loginCookies: any) => {
    setCookies(loginCookies);
    setIsLoggedIn(true);
    setManualLogout(false); // Reset manual logout flag
    
    // Clear manual logout flag and save session
    localStorage.removeItem('manual-logout');
    localStorage.setItem('bms-session', JSON.stringify({
      cookies: loginCookies,
      timestamp: Date.now(),
      autoLogin: false, // Manual login
    }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCookies(null);
    setManualLogout(true); // Set manual logout flag
    
    // Clear session and set manual logout flag
    localStorage.removeItem('bms-session');
    localStorage.setItem('manual-logout', 'true');
    console.log('Manual logout - auto-login disabled');
  };

  // Expose auto-login function to child components for session recovery
  const triggerSessionRecovery = useCallback(() => {
    if (!manualLogout) {
      console.log('Session recovery triggered by API failure');
      handleLogin();
    }
  }, [manualLogout, handleLogin]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        {!isLoggedIn && !isAutoLoggingIn ? (
          <Login onLogin={handleLoginSuccess} />
        ) : (
          <SimpleTemperatureControl 
            onLogout={handleLogout} 
            onSessionExpired={triggerSessionRecovery}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;