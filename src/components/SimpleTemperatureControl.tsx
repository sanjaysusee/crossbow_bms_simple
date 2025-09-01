import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Slider,
  TextField,
  Button,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import {
  AcUnit,
  Schedule,
  Thermostat,
  Refresh,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { bmsApi } from '../services/bmsApi';

interface SimpleTemperatureControlProps {
  onSessionExpired: () => void;
}

export const SimpleTemperatureControl: React.FC<SimpleTemperatureControlProps> = ({
  onSessionExpired,
}) => {
  const [acStatus, setAcStatus] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState(false);
  const [scheduleOnTime, setScheduleOnTime] = useState('09:00');
  const [scheduleOffTime, setScheduleOffTime] = useState('18:00');
  const [temperature, setTemperature] = useState(25);
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [currentHumidity, setCurrentHumidity] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Wrapper function to handle API calls with session recovery
  const makeApiCall = useCallback(async (apiCall: () => Promise<any>): Promise<any> => {
    try {
      return await apiCall();
    } catch (error: any) {
      console.error('API call failed:', error);
      
      // Check for session timeout indicators
      const isSessionTimeout = 
        error.response?.status === 401 ||
        error.response?.status === 403 ||
        error.response?.status === 408 ||
        (typeof error.response?.data === 'string' && error.response.data.includes('Session Timeout')) ||
        (typeof error.message === 'string' && error.message.includes('Session Timeout'));
      
      if (isSessionTimeout) {
        console.log('Session timeout detected, triggering session recovery...');
        setError('Session expired. Attempting to reconnect...');
        onSessionExpired();
        throw new Error('Session expired - recovery initiated');
      }
      
      throw error;
    }
  }, [onSessionExpired]);

  // Fetch current status on component mount and manual refresh
  const fetchCurrentStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const status = await makeApiCall(() => bmsApi.getCurrentStatus());
      
      if (status.currentTemp !== undefined) {
        setCurrentTemp(status.currentTemp);
      }
      if (status.currentHumidity !== undefined) {
        setCurrentHumidity(status.currentHumidity);
      }
      if (status.acStatus !== undefined) {
        setAcStatus(status.acStatus);
      }
      if (status.scheduleStatus !== undefined) {
        setScheduleStatus(status.scheduleStatus);
      }
      if (status.scheduleOnTime) {
        setScheduleOnTime(status.scheduleOnTime);
      }
      if (status.scheduleOffTime) {
        setScheduleOffTime(status.scheduleOffTime);
      }
      if (status.setTemp !== undefined) {
        setTemperature(status.setTemp);
      }
      
    } catch (error) {
      console.error('Failed to fetch current status:', error);
      if (!error.message?.includes('Session expired - recovery initiated')) {
        setError('Failed to fetch current status');
      }
    } finally {
      setLoading(false);
    }
  }, [makeApiCall]);

  // Handle AC control
  const handleAcControl = async (newStatus: boolean) => {
    try {
      setLoading(true);
      setError(null);
      
      await makeApiCall(() => bmsApi.controlAc({ acStatus: newStatus ? 1 : 0 }));
      
      setAcStatus(newStatus);
      setSuccess(`AC turned ${newStatus ? 'ON' : 'OFF'} successfully`);
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Failed to control AC:', error);
      if (!error.message?.includes('Session expired - recovery initiated')) {
        setError('Failed to control AC');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle temperature setting
  const handleTemperatureChange = async (newTemp: number) => {
    try {
      setLoading(true);
      setError(null);
      
      await makeApiCall(() => bmsApi.setTemperature({ setTemp: newTemp }));
      
      setTemperature(newTemp);
      setSuccess(`Temperature set to ${newTemp}°C successfully`);
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Failed to set temperature:', error);
      if (!error.message?.includes('Session expired - recovery initiated')) {
        setError('Failed to set temperature');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle schedule status
  const handleScheduleStatus = async (newStatus: boolean) => {
    try {
      setLoading(true);
      setError(null);
      
      await makeApiCall(() => bmsApi.setScheduleStatus({ scheduleStatus: newStatus ? 1 : 0 }));
      
      setScheduleStatus(newStatus);
      setSuccess(`Schedule ${newStatus ? 'enabled' : 'disabled'} successfully`);
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Failed to set schedule status:', error);
      if (!error.message?.includes('Session expired - recovery initiated')) {
        setError('Failed to set schedule status');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle schedule time changes
  const handleScheduleTimeChange = async (type: 'on' | 'off', time: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const payload = type === 'on' 
        ? { scheduleOnTime: time }
        : { scheduleOffTime: time };
      
      await makeApiCall(() => bmsApi.setScheduleTime(payload));
      
      if (type === 'on') {
        setScheduleOnTime(time);
      } else {
        setScheduleOffTime(time);
      }
      
      setSuccess(`Schedule ${type} time updated to ${time}`);
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error(`Failed to set schedule ${type} time:`, error);
      if (!error.message?.includes('Session expired - recovery initiated')) {
        setError(`Failed to set schedule ${type} time`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch status on mount
  useEffect(() => {
    fetchCurrentStatus();
  }, [fetchCurrentStatus]);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              BMS Temperature Control
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your building's climate control system
            </Typography>
          </Box>

          {/* Error and Success Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}

          {/* Main Control Grid */}
          <Grid container spacing={4}>
            {/* Left Column - Controls */}
            <Grid item xs={12} md={6}>
              <Stack spacing={4}>
                {/* AC Control */}
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AcUnit color="primary" />
                    AC Power Control
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={acStatus}
                        onChange={(e) => handleAcControl(e.target.checked)}
                        disabled={loading}
                      />
                    }
                    label={acStatus ? 'AC is ON' : 'AC is OFF'}
                    sx={{ mt: 1 }}
                  />
                </Box>

                {/* Temperature Control */}
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Thermostat color="primary" />
                    Temperature Setting
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography gutterBottom>Set Temperature: {temperature}°C</Typography>
                    <Slider
                      value={temperature}
                      onChange={(_, value) => setTemperature(value as number)}
                      onChangeCommitted={(_, value) => handleTemperatureChange(value as number)}
                      min={23}
                      max={28}
                      step={0.5}
                      marks
                      valueLabelDisplay="auto"
                      disabled={loading}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      type="number"
                      label="Temperature (°C)"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      onBlur={() => handleTemperatureChange(temperature)}
                      inputProps={{ min: 23, max: 28, step: 0.5 }}
                      disabled={loading}
                      size="small"
                      sx={{ width: 120 }}
                    />
                  </Box>
                </Box>

                {/* Schedule Control */}
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule color="primary" />
                    Schedule Control
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={scheduleStatus}
                        onChange={(e) => handleScheduleStatus(e.target.checked)}
                        disabled={loading}
                      />
                    }
                    label={scheduleStatus ? 'Schedule Enabled' : 'Schedule Disabled'}
                    sx={{ mt: 1 }}
                  />
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      type="time"
                      label="Start Time"
                      value={scheduleOnTime}
                      onChange={(e) => setScheduleOnTime(e.target.value)}
                      onBlur={() => handleScheduleTimeChange('on', scheduleOnTime)}
                      disabled={loading || !scheduleStatus}
                      size="small"
                    />
                    <TextField
                      type="time"
                      label="End Time"
                      value={scheduleOffTime}
                      onChange={(e) => setScheduleOffTime(e.target.value)}
                      onBlur={() => handleScheduleTimeChange('off', scheduleOffTime)}
                      disabled={loading || !scheduleStatus}
                      size="small"
                    />
                  </Box>
                </Box>
              </Stack>
            </Grid>

            {/* Right Column - Status Display */}
            <Grid item xs={12} md={6}>
              <Stack spacing={4}>
                {/* Current Status */}
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle color="primary" />
                    Current Status
                  </Typography>
                  
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Current Temperature</Typography>
                        <Typography variant="h4" color="primary.main" sx={{ fontWeight: 600 }}>
                          {currentTemp !== null ? `${currentTemp}°C` : '--'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Humidity</Typography>
                        <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 600 }}>
                          {currentHumidity !== null ? `${currentHumidity}%` : '--'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

                {/* System Status */}
                <Box>
                  <Typography variant="h6" gutterBottom>System Status</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      icon={acStatus ? <CheckCircle /> : <ErrorIcon />}
                      label={acStatus ? 'AC Running' : 'AC Stopped'}
                      color={acStatus ? 'success' : 'default'}
                      variant="outlined"
                    />
                    <Chip
                      icon={scheduleStatus ? <CheckCircle /> : <ErrorIcon />}
                      label={scheduleStatus ? 'Schedule Active' : 'Schedule Inactive'}
                      color={scheduleStatus ? 'success' : 'default'}
                      variant="outlined"
                    />
                    <Chip
                      icon={<Thermostat />}
                      label={`Set: ${temperature}°C`}
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                </Box>

                {/* Refresh Button */}
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchCurrentStatus}
                    disabled={loading}
                    sx={{ minWidth: 150 }}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Refresh Status'}
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          {/* Footer */}
          <Divider sx={{ mt: 4, mb: 2 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Last updated: {new Date().toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
