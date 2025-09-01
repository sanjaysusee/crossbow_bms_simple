import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Tooltip, Fade, Zoom, Grow, Slide } from '@mui/material';
import { 
  Favorite, 
  Star, 
  TrendingUp, 
  AutoAwesome,
  Bolt
} from '@mui/icons-material';

interface FooterProps {
  variant?: 'light' | 'dark';
}

export const Footer: React.FC<FooterProps> = ({ variant = 'light' }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [sparkleAnimation, setSparkleAnimation] = useState(false);

  // Sparkle effect on hover
  useEffect(() => {
    if (hovered) {
      setSparkleAnimation(true);
      const timer = setTimeout(() => setSparkleAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [hovered]);

  const handleFooterClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 300);
  };

  const handleIconHover = () => {
    setHovered(true);
  };

  const handleIconLeave = () => {
    setHovered(false);
  };

  return (
    <Box
      sx={{
        py: 3,
        px: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fixed dark background that won't change on scroll
        backdropFilter: 'blur(15px)',
        borderTop: '2px solid rgba(255, 215, 0, 0.6)', // Gold border
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
        },
        '&:active': {
          transform: 'translateY(0px)',
        }
      }}
      onClick={handleFooterClick}
      onMouseEnter={handleIconHover}
      onMouseLeave={handleIconLeave}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* Floating sparkles */}
        {[...Array(6)].map((_, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'rgba(255, 215, 0, 0.6)', // Gold sparkles
              animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
              animationDelay: `${index * 0.5}s`,
              left: `${10 + index * 15}%`,
              top: '50%',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                '50%': { transform: 'translateY(-10px) rotate(180deg)' },
              }
            }}
          />
        ))}
      </Box>

      {/* Main content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between', // Changed to space-between for proper layout
          gap: 2,
          flexWrap: 'wrap',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Left side - Powered by Crossbow */}
        <Fade in timeout={800}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              transform: clicked ? 'scale(0.95)' : 'scale(1)',
              transition: 'transform 0.2s ease',
              flex: 1,
              justifyContent: 'flex-start',
            }}
          >
            <Bolt 
              sx={{ 
                fontSize: 20, 
                color: '#FFD700', // Gold color
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.7 },
                }
              }} 
            />
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600,
                fontSize: '0.95rem',
                letterSpacing: '0.5px',
              }}
            >
              Powered by
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#FFD700', // Gold color
                fontWeight: 700,
                fontSize: '1.1rem',
                letterSpacing: '1px',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              CROSSBOWSEC
            </Typography>
          </Box>
        </Fade>

        {/* Center - Interactive icons */}
        <Grow in timeout={1000}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Tooltip 
              title="Crafted with ❤️ and ☕" 
              arrow
              placement="top"
            >
              <IconButton
                size="medium"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#FF6B6B',
                    transform: 'scale(1.2) rotate(15deg)',
                  }
                }}
              >
                <Favorite />
              </IconButton>
            </Tooltip>

            <Tooltip title="Premium Quality Code" arrow placement="top">
              <IconButton
                size="medium"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#FFD700',
                    transform: 'scale(1.2) rotate(-15deg)',
                  }
                }}
              >
                <Star />
              </IconButton>
            </Tooltip>

            <Tooltip title="Innovation at its Best" arrow placement="top">
              <IconButton
                size="medium"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#4ECDC4',
                    transform: 'scale(1.2) rotate(15deg)',
                  }
                }}
              >
                <TrendingUp />
              </IconButton>
            </Tooltip>

            <Tooltip title="Magical Touch" arrow placement="top">
              <IconButton
                size="medium"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#FFD700',
                    transform: 'scale(1.2) rotate(15deg)',
                  }
                }}
              >
                <AutoAwesome 
                  sx={{ 
                    animation: sparkleAnimation ? 'sparkle 1s ease-in-out' : 'none',
                    '@keyframes sparkle': {
                      '0%': { transform: 'scale(1) rotate(0deg)' },
                      '50%': { transform: 'scale(1.3) rotate(180deg)' },
                      '100%': { transform: 'scale(1) rotate(360deg)' },
                    }
                  }} 
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Grow>

        {/* Right side - Designed and Developed by Susee */}
        <Slide direction="up" in timeout={1200}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flex: 1,
              justifyContent: 'flex-end',
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600,
                fontSize: '0.95rem',
                letterSpacing: '0.5px',
              }}
            >
              Designed and Developed by
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                background: 'rgba(255, 215, 0, 0.2)',
                borderRadius: '20px',
                px: 2,
                py: 0.5,
                border: '1px solid rgba(255, 215, 0, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 215, 0, 0.3)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
                }
              }}
            >
              <AutoAwesome 
                sx={{ 
                  fontSize: 16, 
                  color: '#FFD700',
                  animation: sparkleAnimation ? 'sparkle 1s ease-in-out 0.2s' : 'none',
                }} 
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#FFD700',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  letterSpacing: '1px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                Susee
              </Typography>
            </Box>
          </Box>
        </Slide>
      </Box>

      {/* Bottom accent line */}
      <Zoom in timeout={1500}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.8), transparent)',
            borderRadius: 1,
            animation: 'glow 2s ease-in-out infinite alternate',
            '@keyframes glow': {
              '0%': { opacity: 0.5, width: '40%' },
              '100%': { opacity: 1, width: '80%' },
            }
          }}
        />
      </Zoom>
    </Box>
  );
};
