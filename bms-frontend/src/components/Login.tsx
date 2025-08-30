import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
  Fade,
  Slide,
  Grow,
  Container,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  Person,
  Login as LoginIcon,
  Security,
  Wifi,
  WifiOff,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { LoginCredentials } from '../types/bms';
import { bmsApi } from '../services/bmsApi';

interface LoginProps {
  onLogin: (cookies: { JSESSIONID?: string; DWRSESSIONID?: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [growIn, setGrowIn] = useState(false);

  // Staggered animations on component mount
  useEffect(() => {
    const timer1 = setTimeout(() => setFadeIn(true), 100);
    const timer2 = setTimeout(() => setSlideIn(true), 300);
    const timer3 = setTimeout(() => setGrowIn(true), 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Check online status
  useEffect(() => {
    const checkOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);
    checkOnlineStatus();

    return () => {
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await bmsApi.login(credentials);
      console.log('Login successful:', response);
      onLogin(response.cookies);
    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = credentials.username.trim() && credentials.password.trim();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 1, sm: 2 },
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'fixed',
          top: -50,
          left: -50,
          width: { xs: 150, sm: 200 },
          height: { xs: 150, sm: 200 },
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'float 6s ease-in-out infinite',
          zIndex: 0,
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: -30,
          right: -30,
          width: { xs: 100, sm: 150 },
          height: { xs: 100, sm: 150 },
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          animation: 'float 8s ease-in-out infinite reverse',
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm" sx={{ zIndex: 2, position: 'relative' }}>
        <Fade in={fadeIn} timeout={800}>
          <Box>
            {/* Header */}
            <Slide in={slideIn} direction="down" timeout={600}>
              <Box textAlign="center" mb={{ xs: 2, sm: 3, md: 4 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: 60, sm: 70, md: 80 },
                    height: { xs: 60, sm: 70, md: 80 },
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    mb: { xs: 1, sm: 2 },
                  }}
                >
                  <Security sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: 'white' }} />
                </Box>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                  }}
                >
                  BMS Control
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 300,
                    letterSpacing: 1,
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                  }}
                >
                  Crossbow Building Management System
                </Typography>
              </Box>
            </Slide>

            {/* Login Card */}
            <Grow in={growIn} timeout={800}>
              <Card
                elevation={24}
                sx={{
                  borderRadius: { xs: 2, sm: 4 },
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  overflow: 'hidden',
                  position: 'relative',
                  zIndex: 10,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  <Box textAlign="center" mb={{ xs: 2, sm: 3 }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
                      Welcome Back Archers!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      Sign in to access your BMS dashboard
                    </Typography>
                  </Box>

                  {/* Status Indicators */}
                  <Stack direction="row" spacing={2} justifyContent="center" mb={3}>
                    <Chip
                      icon={isOnline ? <Wifi /> : <WifiOff />}
                      label={isOnline ? 'Online' : 'Offline'}
                      color={isOnline ? 'success' : 'error'}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<CheckCircle />}
                      label="Secure Connection"
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </Stack>

                  <Divider sx={{ mb: 3 }} />

                  {/* Login Form */}
                  <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      {/* Username Field */}
                      <TextField
                        fullWidth
                        label="Username"
                        variant="outlined"
                        value={credentials.username}
                        onChange={handleInputChange('username')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            },
                          },
                        }}
                      />

                      {/* Password Field */}
                      <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        value={credentials.password}
                        onChange={handleInputChange('password')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={togglePasswordVisibility}
                                edge="end"
                                size="small"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            },
                          },
                        }}
                      />

                      {/* Error Display */}
                      {error && (
                        <Alert
                          severity="error"
                          icon={<ErrorIcon />}
                          sx={{
                            borderRadius: 2,
                            '& .MuiAlert-message': {
                              fontWeight: 500,
                            },
                          }}
                        >
                          {error}
                        </Alert>
                      )}

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading || !isFormValid}
                        startIcon={
                          loading ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <LoginIcon />
                          )
                        }
                        sx={{
                          py: 1.5,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          borderRadius: 2,
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                          },
                          '&:disabled': {
                            transform: 'none',
                            boxShadow: 'none',
                          },
                        }}
                      >
                        {loading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </Stack>
                  </Box>

                  {/* Footer */}
                  <Box textAlign="center" mt={3}>
                    <Typography variant="caption" color="text.secondary">
                      Secure access to Building Management System
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};