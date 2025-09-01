import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Fade,
  Slide,
  Grow,
  Container,
  Stack,
  Divider,
  Chip,
  Zoom,
} from '@mui/material';
import {
  Login as LoginIcon,
  Security,
  Wifi,
  WifiOff,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { bmsApi } from '../services/bmsApi';
import { Footer } from './Footer';
import { config } from '../config/config';

interface LoginProps {
  onLogin: (cookies: { JSESSIONID?: string; DWRSESSIONID?: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isOnline, setIsOnline] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [growIn, setGrowIn] = useState(false);
  const [bounceIn, setBounceIn] = useState(false);
  const [zoomIn, setZoomIn] = useState(false);
  const [floatingElements, setFloatingElements] = useState(false);

  // Enhanced staggered animations on component mount
  useEffect(() => {
    const timer1 = setTimeout(() => setFadeIn(true), 100);
    const timer2 = setTimeout(() => setSlideIn(true), 300);
    const timer3 = setTimeout(() => setGrowIn(true), 500);
    const timer4 = setTimeout(() => setBounceIn(true), 700);
    const timer5 = setTimeout(() => setZoomIn(true), 900);
    const timer6 = setTimeout(() => setFloatingElements(true), 1100);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
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

  const handleAccessBMS = async () => {
    setLoading(true);
    setError('');

    try {
      // Use configuration credentials
      const response = await bmsApi.login({
        username: config.bmsUsername,
        password: config.bmsPassword
      });
      console.log('Login successful:', response);
      onLogin(response.cookies);
    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err.message : 'Access failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      {/* Enhanced animated background elements */}
      <Box
        sx={{
          position: 'fixed',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 215, 0, 0.1))',
          animation: floatingElements ? 'float 8s ease-in-out infinite' : 'none',
          zIndex: 0,
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-30px) rotate(180deg)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: -50,
          left: -50,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.08), rgba(102, 126, 234, 0.08))',
          animation: floatingElements ? 'float 6s ease-in-out infinite reverse' : 'none',
          zIndex: 0,
        }}
      />
      
      {/* Floating particles */}
      {[...Array(8)].map((_, index) => (
        <Box
          key={index}
          sx={{
            position: 'fixed',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'rgba(255, 215, 0, 0.6)',
            animation: floatingElements ? `particleFloat ${4 + index * 0.5}s ease-in-out infinite` : 'none',
            animationDelay: `${index * 0.3}s`,
            left: `${10 + index * 10}%`,
            top: `${20 + index * 8}%`,
            zIndex: 0,
            '@keyframes particleFloat': {
              '0%, 100%': { 
                transform: 'translateY(0px) scale(1)',
                opacity: 0.6
              },
              '50%': { 
                transform: 'translateY(-20px) scale(1.2)',
                opacity: 1
              },
            }
          }}
        />
      ))}

      <Container maxWidth="sm" sx={{ zIndex: 2, position: 'relative', pb: 16 }}>
        <Fade in={fadeIn} timeout={800}>
          <Box>
            {/* Enhanced Header */}
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
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    animation: bounceIn ? 'bounceIn 1s ease-in-out, pulse 2s ease-in-out infinite 1s' : 'pulse 2s ease-in-out infinite',
                    '@keyframes bounceIn': {
                      '0%': { 
                        transform: 'scale(0.3)',
                        opacity: 0
                      },
                      '50%': { 
                        transform: 'scale(1.05)',
                        opacity: 1
                      },
                      '70%': { 
                        transform: 'scale(0.9)',
                        opacity: 1
                      },
                      '100%': { 
                        transform: 'scale(1)',
                        opacity: 1
                      }
                    },
                    '@keyframes pulse': {
                      '0%, 100%': { 
                        transform: 'scale(1)',
                        boxShadow: '0 0 0 0 rgba(255, 215, 0, 0.7)'
                      },
                      '50%': { 
                        transform: 'scale(1.05)',
                        boxShadow: '0 0 0 10px rgba(255, 215, 0, 0)'
                      },
                    }
                  }}
                >
                  <Security sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: 'white' }} />
                </Box>
                
                <Zoom in={zoomIn} timeout={1200}>
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      mb: { xs: 0.5, sm: 1 },
                      fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                      background: 'linear-gradient(45deg, #FFFFFF, #FFD700)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    BMS Control
                  </Typography>
                </Zoom>
                
                <Grow in={growIn} timeout={800}>
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
                </Grow>
              </Box>
            </Slide>

            {/* Enhanced Login Card */}
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
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #667eea, #764ba2, #FFD700)',
                    animation: 'gradientShift 3s ease-in-out infinite',
                    '@keyframes gradientShift': {
                      '0%, 100%': { background: 'linear-gradient(90deg, #667eea, #764ba2, #FFD700)' },
                      '50%': { background: 'linear-gradient(90deg, #FFD700, #667eea, #764ba2)' },
                    }
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  <Box textAlign="center" mb={{ xs: 2, sm: 3 }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
                      Welcome Back Archers! 🏹
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      Sign in to access your BMS dashboard
                    </Typography>
                  </Box>

                  {/* Enhanced Status Indicators */}
                  <Stack direction="row" spacing={2} justifyContent="center" mb={3}>
                    <Chip
                      icon={isOnline ? <Wifi /> : <WifiOff />}
                      label={isOnline ? 'Online' : 'Offline'}
                      color={isOnline ? 'success' : 'error'}
                      size="small"
                      variant="outlined"
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        }
                      }}
                    />
                    <Chip
                      icon={<CheckCircle />}
                      label="Secure Connection"
                      color="primary"
                      size="small"
                      variant="outlined"
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        }
                      }}
                    />
                  </Stack>

                  <Divider sx={{ mb: 3 }} />

                  {/* Enhanced Access Button */}
                  <Box>
                    <Stack spacing={3}>
                      {/* Enhanced Error Display */}
                      {error && (
                        <Alert
                          severity="error"
                          icon={<ErrorIcon />}
                          sx={{
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '& .MuiAlert-message': {
                              fontWeight: 500,
                            },
                            animation: 'shake 0.5s ease-in-out',
                            '@keyframes shake': {
                              '0%, 100%': { transform: 'translateX(0)' },
                              '25%': { transform: 'translateX(-5px)' },
                              '75%': { transform: 'translateX(5px)' },
                            }
                          }}
                        >
                          {error}
                        </Alert>
                      )}

                      {/* Enhanced Access Button */}
                      <Button
                        onClick={handleAccessBMS}
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
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
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                          },
                          '&:disabled': {
                            transform: 'none',
                            boxShadow: 'none',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                            transition: 'left 0.5s',
                          },
                          '&:hover::before': {
                            left: '100%',
                          }
                        }}
                      >
                        {loading ? 'Connecting...' : 'Access BMS Control'}
                      </Button>
                    </Stack>
                  </Box>

                </CardContent>
              </Card>
            </Grow>
          </Box>
        </Fade>
        
        {/* Elaborate Footer Component */}
        <Footer />
      </Container>
    </Box>
  );
};