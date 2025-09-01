import React, { useState, useEffect, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Stack,
  Slider,
  TextField,
  CircularProgress,
  Alert,
  Box,
  Switch,
  FormControlLabel,
  Chip,
} from "@mui/material";
import {
  PowerSettingsNew,
  Add,
  Remove,
  CheckCircle,
  Error as ErrorIcon,
  AcUnit,
  Refresh,
  Wifi,
  WifiOff,
  Schedule,
} from "@mui/icons-material";
import { SetTempPayload, SetTempResponse, AcControlPayload, BmsCurrentStatus, ScheduleStatusPayload, ScheduleTimePayload } from "../types/bms";
import { bmsApi } from "../services/bmsApi";

interface SimpleTemperatureControlProps {
  onLogout: () => void;
  onSessionExpired: () => void;
}

export const SimpleTemperatureControl: React.FC<SimpleTemperatureControlProps> = ({
  onLogout,
  onSessionExpired,
}) => {
  const [temperature, setTemperature] = useState<number>(25.5);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [acOn, setAcOn] = useState<boolean>(false);
  const [acLoading, setAcLoading] = useState<boolean>(false);
  
  // Real-time data states
  const [currentStatus, setCurrentStatus] = useState<BmsCurrentStatus | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);

  // Schedule control states
  const [scheduleStatus, setScheduleStatus] = useState<boolean>(false);
  const [scheduleLoading, setScheduleLoading] = useState<boolean>(false);
  const [scheduleOnTime, setScheduleOnTime] = useState<string>("12:00");
  const [scheduleOffTime, setScheduleOffTime] = useState<string>("15:00");
  const [showScheduleTimeInputs, setShowScheduleTimeInputs] = useState<boolean>(false);

  const isTemperatureValid = temperature >= 23 && temperature <= 28;

  // Simple API call wrapper - backend handles session management automatically
  const makeApiCall = useCallback(async (apiCall: () => Promise<any>): Promise<any> => {
    try {
      return await apiCall();
    } catch (error: any) {
      console.error('API call failed:', error);
      
      // Check if backend says session management failed entirely
      if (error.response?.status === 400 && 
          error.response?.data?.message && 
          error.response.data.message.includes('automatic re-login failed')) {
        console.log('Backend session recovery failed, triggering frontend re-login...');
        
        // Only trigger frontend session recovery if backend completely failed
        onSessionExpired();
        return; // Don't retry, let user re-authenticate
      }
      
      throw error;
    }
  }, [onSessionExpired]);

  // Fetch current BMS status
  const fetchCurrentStatus = useCallback(async () => {
    try {
      setRefreshing(true);
      console.log('Fetching current BMS status...');
      
      const data = await makeApiCall(() => bmsApi.getCurrentStatus());
      console.log('Received BMS data:', data);
      
      setCurrentStatus(data);
      setTemperature(data.setTemperature);
      setAcOn(data.acStatus);
      setScheduleStatus(data.scheduleStatus);
      setScheduleOnTime(data.scheduleOnTime || "12:00");
      setScheduleOffTime(data.scheduleOffTime || "15:00");
      setIsOnline(true);
      setError(""); // Clear any previous errors
      
    } catch (err) {
      console.error("Failed to fetch current status:", err);
      setIsOnline(false);
      setError("Connection lost. Attempting to reconnect...");
    } finally {
      setRefreshing(false);
    }
  }, [makeApiCall]);

  // Initial fetch only - no continuous polling
  useEffect(() => {
    fetchCurrentStatus();
  }, [fetchCurrentStatus]);

  const handleManualRefresh = () => {
    console.log('Manual refresh requested');
    fetchCurrentStatus();
  };

  const handleSetTemperature = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    const payload: SetTempPayload = {
      device_vfdReadingSetTemp: temperature,
      requestType: "ElectricalMeters",
      subRequestType: "ConfigureDataAtDevice",
      username: "crossbow",
      operationDoneBy: "crossbow",
      neName: "CrossBowLab",
      neVersion: "VFD_005",
      neId: 581,
      agentId: 581,
      subSystemId: 128,
      subSystem: "VFD",
      operationName: "CONFIGURATION",
      operationType: "SET",
      operationId: 41061,
      uniqueId: "SWAHVACAHU00000286",
      managedObjectClass: "VFD",
      managedObjectInstance: "VFD-128",
      topic: "swadha/SWAHVACAHU00000286/VFD/set",
      setQOS: 0,
      retainSetTopic: false,
      deviceAttributes:
        "device_vfdReadingMode,device_vfdReadingStatus,device_vfdReadingFreq,device_vfdReadingScheduleStatus,device_vfdReadingScheduleOnTime,device_vfdReadingScheduleOffTime,device_vfdReadingSetTemp,device_vfdReadingH2OValve,device_vfdReadingWaterIn,device_vfdReadingWaterOut,device_vfdReadingFlowMin,device_vfdReadingRetAirtemp,device_vfdReadingPower,device_vfdReadingBtu,device_vfdReadingFilterLevel,device_vfdReadingVoltage,device_vfdReadingCurrent,device_vfdReadingRunningHrs,device_vfdReadingFireSignal,device_vfdReadingLogtime,device_vfdReadingVfdOnOffSource,device_vfdReadingHumidity,device_vfdAirQualityIndex,device_vfdParticleMatter1,device_vfdParticleMatter2p5,device_vfdParticleMatter10,device_vfdTotVolatileOrganicComp,device_vfdAirQualityIndexComp,device_vfdReadingSetCo2,device_vfdReadingCo2Level,device_vfdReadingFreshAirValve,device_vfdReadingSupplyAir,device_vfdReadingWaterPressure,device_vfdReadingMinFreq,device_vfdReadingMaxFreq,device_vfdReadingTPControl",
      subSystemName: "VFD-128",
    };

    try {
      const data = await makeApiCall(async () => {
        return await bmsApi.setTemperature(payload);
      });

      if (data.data && data.data.status === "Failure") {
        setError(`BMS Error: ${data.data.message}`);
      } else {
        setMessage(`Temperature set successfully! Status: ${data.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set temperature");
    } finally {
      setLoading(false);
    }
  };

  const handleAcControl = async (checked: boolean) => {
    setAcLoading(true);
    setMessage("");
    setError("");

    const payload: AcControlPayload = {
      device_vfdReadingStatus: checked ? 1 : 0,
      device_vfdReadingFreq: checked ? 40.00 : undefined,
      requestType: "ElectricalMeters",
      subRequestType: "ConfigureDataAtDevice",
      username: "crossbow",
      operationDoneBy: "crossbow",
      neName: "CrossBowLab",
      neVersion: "VFD_005",
      neId: 581,
      agentId: 581,
      subSystemId: 128,
      subSystem: "VFD",
      operationName: "CONFIGURATION",
      operationType: "SET",
      operationId: 41061,
      uniqueId: "SWAHVACAHU00000286",
      managedObjectClass: "VFD",
      managedObjectInstance: "VFD-128",
      topic: "swadha/SWAHVACAHU00000286/VFD/set",
      setQOS: 0,
      retainSetTopic: false,
      deviceAttributes:
        "device_vfdReadingMode,device_vfdReadingStatus,device_vfdReadingFreq,device_vfdReadingScheduleStatus,device_vfdReadingScheduleOnTime,device_vfdReadingScheduleOffTime,device_vfdReadingSetTemp,device_vfdReadingH2OValve,device_vfdReadingWaterIn,device_vfdReadingWaterOut,device_vfdReadingFlowMin,device_vfdReadingRetAirtemp,device_vfdReadingPower,device_vfdReadingBtu,device_vfdReadingFilterLevel,device_vfdReadingVoltage,device_vfdReadingCurrent,device_vfdReadingRunningHrs,device_vfdReadingFireSignal,device_vfdReadingLogtime,device_vfdReadingVfdOnOffSource,device_vfdReadingHumidity,device_vfdAirQualityIndex,device_vfdParticleMatter1,device_vfdParticleMatter2p5,device_vfdParticleMatter10,device_vfdTotVolatileOrganicComp,device_vfdAirQualityIndexComp,device_vfdReadingSetCo2,device_vfdReadingCo2Level,device_vfdReadingFreshAirValve,device_vfdReadingSupplyAir,device_vfdReadingWaterPressure,device_vfdReadingMinFreq,device_vfdReadingMaxFreq,device_vfdReadingTPControl",
      subSystemName: "VFD-128",
    };

    try {
      const data = await makeApiCall(async () => {
        return await bmsApi.controlAc(payload);
      });

      if (data.data && data.data.status === "Failure") {
        setError(`BMS Error: ${data.data.message}`);
        setAcOn(!checked);
      } else {
        setMessage(`AC turned ${checked ? "ON" : "OFF"} successfully! Status: ${data.status}`);
        setAcOn(checked);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to control AC");
      setAcOn(!checked);
    } finally {
      setAcLoading(false);
    }
  };

  const handleScheduleControl = async (checked: boolean) => {
    setScheduleLoading(true);
    setMessage("");
    setError("");

    try {
      if (checked) {
        const timePayload: ScheduleTimePayload = {
          device_vfdReadingScheduleStatus: 1,
          device_vfdReadingScheduleOnTime: scheduleOnTime,
          device_vfdReadingScheduleOffTime: scheduleOffTime,
          requestType: "ElectricalMeters",
          subRequestType: "ConfigureDataAtDevice",
          username: "crossbow",
          operationDoneBy: "crossbow",
          neName: "CrossBowLab",
          neVersion: "VFD_005",
          neId: 581,
          agentId: 581,
          subSystemId: 128,
          subSystem: "VFD",
          operationName: "CONFIGURATION",
          operationType: "SET",
          operationId: 41061,
          uniqueId: "SWAHVACAHU00000286",
          managedObjectClass: "VFD",
          managedObjectInstance: "VFD-128",
          topic: "swadha/SWAHVACAHU00000286/VFD/set",
          setQOS: 0,
          retainSetTopic: false,
          deviceAttributes:
            "device_vfdReadingMode,device_vfdReadingStatus,device_vfdReadingFreq,device_vfdReadingScheduleStatus,device_vfdReadingScheduleOnTime,device_vfdReadingScheduleOffTime,device_vfdReadingSetTemp,device_vfdReadingH2OValve,device_vfdReadingWaterIn,device_vfdReadingWaterOut,device_vfdReadingFlowMin,device_vfdReadingRetAirtemp,device_vfdReadingPower,device_vfdReadingBtu,device_vfdReadingFilterLevel,device_vfdReadingVoltage,device_vfdReadingCurrent,device_vfdReadingRunningHrs,device_vfdReadingFireSignal,device_vfdReadingLogtime,device_vfdReadingVfdOnOffSource,device_vfdReadingHumidity,device_vfdAirQualityIndex,device_vfdParticleMatter1,device_vfdParticleMatter2p5,device_vfdParticleMatter10,device_vfdTotVolatileOrganicComp,device_vfdAirQualityIndexComp,device_vfdReadingSetCo2,device_vfdReadingCo2Level,device_vfdReadingFreshAirValve,device_vfdReadingSupplyAir,device_vfdReadingWaterPressure,device_vfdReadingMinFreq,device_vfdReadingMaxFreq,device_vfdReadingTPControl",
          subSystemName: "VFD-128",
        };

        const response = await makeApiCall(() => bmsApi.setScheduleTime(timePayload));

        if (response.data && response.data.status === "Failure") {
          setError(`BMS Error: ${response.data.message}`);
          setScheduleStatus(false);
        } else {
          setMessage(`Schedule ENABLED successfully! ON: ${scheduleOnTime}, OFF: ${scheduleOffTime}. Status: ${response.message}`);
          setScheduleStatus(true);
        }
      } else {
        const statusPayload: ScheduleStatusPayload = {
          device_vfdReadingScheduleStatus: 0,
          requestType: "ElectricalMeters",
          subRequestType: "ConfigureDataAtDevice",
          username: "crossbow",
          operationDoneBy: "crossbow",
          neName: "CrossBowLab",
          neVersion: "VFD_005",
          neId: 581,
          agentId: 581,
          subSystemId: 128,
          subSystem: "VFD",
          operationName: "CONFIGURATION",
          operationType: "SET",
          operationId: 41061,
          uniqueId: "SWAHVACAHU00000286",
          managedObjectClass: "VFD",
          managedObjectInstance: "VFD-128",
          topic: "swadha/SWAHVACAHU00000286/VFD/set",
          setQOS: 0,
          retainSetTopic: false,
          deviceAttributes:
            "device_vfdReadingMode,device_vfdReadingStatus,device_vfdReadingFreq,device_vfdReadingScheduleStatus,device_vfdReadingScheduleOnTime,device_vfdReadingScheduleOffTime,device_vfdReadingSetTemp,device_vfdReadingH2OValve,device_vfdReadingWaterIn,device_vfdReadingWaterOut,device_vfdReadingFlowMin,device_vfdReadingRetAirtemp,device_vfdReadingPower,device_vfdReadingBtu,device_vfdReadingFilterLevel,device_vfdReadingVoltage,device_vfdReadingCurrent,device_vfdReadingRunningHrs,device_vfdReadingFireSignal,device_vfdReadingLogtime,device_vfdReadingVfdOnOffSource,device_vfdReadingHumidity,device_vfdAirQualityIndex,device_vfdParticleMatter1,device_vfdParticleMatter2p5,device_vfdParticleMatter10,device_vfdTotVolatileOrganicComp,device_vfdAirQualityIndexComp,device_vfdReadingSetCo2,device_vfdReadingCo2Level,device_vfdReadingFreshAirValve,device_vfdReadingSupplyAir,device_vfdReadingWaterPressure,device_vfdReadingMinFreq,device_vfdReadingMaxFreq,device_vfdReadingTPControl",
          subSystemName: "VFD-128",
        };

        const response = await makeApiCall(() => bmsApi.setScheduleStatus(statusPayload));

        if (response.data && response.data.status === "Failure") {
          setError(`BMS Error: ${response.data.message}`);
          setScheduleStatus(true);
        } else {
          setMessage(`Schedule DISABLED successfully! Status: ${response.message}`);
          setScheduleStatus(false);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to control schedule");
      setScheduleStatus(!checked);
    } finally {
      setScheduleLoading(false);
    }
  };

  const adjustTemperature = (increment: number) => {
    const newTemp = Math.round((temperature + increment) * 10) / 10;
    if (newTemp >= 23 && newTemp <= 28) {
      setTemperature(newTemp);
    }
  };

  return (
    <Box sx={{ height: '100vh', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      {/* Compact Header */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar sx={{ py: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            BMS Temperature Control
          </Typography>
          
          <Box display="flex" alignItems="center" gap={1} mr={2}>
            <Chip
              icon={isOnline ? <Wifi /> : <WifiOff />}
              label={isOnline ? "Online" : "Offline"}
              color={isOnline ? "success" : "error"}
              size="small"
              variant="outlined"
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
            />
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleManualRefresh}
              disabled={refreshing}
              size="small"
              sx={{ color: 'white', borderColor: 'white', px: 1 }}
            >
              {refreshing ? <CircularProgress size={16} /> : "Refresh"}
            </Button>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<PowerSettingsNew />}
            onClick={onLogout}
            size="small"
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content - Single Card Layout */}
      <Container maxWidth="md" sx={{ flex: 1, py: 2, px: 2 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ py: 3 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
              BMS Temperature Control
            </Typography>
            
            <Stack spacing={3}>
              {/* Current Temperature Display - Compact */}
              <Box textAlign="center">
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Current Temperature
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#1976d2',
                    mb: 1,
                  }}
                >
                  {currentStatus ? currentStatus.temperature.toFixed(1) : '--'}°C
                </Typography>
                {currentStatus && (
                  <Typography variant="body1" color="text.secondary">
                    Target: {temperature.toFixed(1)}°C
                  </Typography>
                )}
              </Box>

              {/* Controls Row */}
              <Box display="flex" justifyContent="space-around" alignItems="center" flexWrap="wrap" gap={2}>
                {/* AC Control */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={acOn}
                      onChange={(e) => handleAcControl(e.target.checked)}
                      disabled={acLoading}
                      color="primary"
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <AcUnit sx={{ fontSize: 24, color: acOn ? '#1976d2' : 'text.disabled' }} />
                      <Typography variant="body1" sx={{ color: acOn ? '#1976d2' : 'text.secondary' }}>
                        AC {acOn ? "ON" : "OFF"}
                      </Typography>
                      {acLoading && <CircularProgress size={16} />}
                    </Box>
                  }
                />

                {/* Schedule Control */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={scheduleStatus}
                      onChange={(e) => handleScheduleControl(e.target.checked)}
                      disabled={scheduleLoading}
                      color="secondary"
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Schedule sx={{ fontSize: 24, color: scheduleStatus ? '#dc004e' : 'text.disabled' }} />
                      <Typography variant="body1" sx={{ color: scheduleStatus ? '#dc004e' : 'text.secondary' }}>
                        Schedule {scheduleStatus ? "ON" : "OFF"}
                      </Typography>
                      {scheduleLoading && <CircularProgress size={16} />}
                    </Box>
                  }
                />
              </Box>

              {/* Schedule Time Settings */}
              <Box textAlign="center">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowScheduleTimeInputs(!showScheduleTimeInputs)}
                  sx={{ color: '#dc004e', borderColor: '#dc004e', mb: 1 }}
                >
                  {showScheduleTimeInputs ? "Hide Schedule Times" : "Schedule Times"}
                </Button>
                
                {showScheduleTimeInputs && (
                  <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={1}>
                    <TextField
                      label="Start Time"
                      type="time"
                      value={scheduleOnTime}
                      onChange={(e) => setScheduleOnTime(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      sx={{ width: 140 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      to
                    </Typography>
                    <TextField
                      label="End Time"
                      type="time"
                      value={scheduleOffTime}
                      onChange={(e) => setScheduleOffTime(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      sx={{ width: 140 }}
                    />
                  </Box>
                )}
              </Box>

              {/* Temperature Setting */}
              <Box>
                <Typography variant="h6" gutterBottom align="center">
                  Set Target Temperature
                </Typography>
                
                <Stack spacing={2}>
                  {/* Slider */}
                  <Box>
                    <Slider
                      min={23}
                      max={28}
                      step={0.1}
                      value={temperature}
                      onChange={(_, value) => setTemperature(value as number)}
                      valueLabelDisplay="auto"
                      marks={[
                        { value: 23, label: '23°C' },
                        { value: 25.5, label: '25.5°C' },
                        { value: 28, label: '28°C' },
                      ]}
                    />
                  </Box>

                  {/* Controls Row */}
                  <Box display="flex" justifyContent="center" alignItems="center" gap={2} flexWrap="wrap">
                    <Button
                      variant="outlined"
                      startIcon={<Remove />}
                      onClick={() => adjustTemperature(-0.1)}
                      disabled={temperature <= 23}
                      size="small"
                    >
                      -0.1°C
                    </Button>
                    
                    <TextField
                      label="Target (°C)"
                      type="number"
                      inputProps={{ step: 0.1, min: 23, max: 28 }}
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value) || 25.5)}
                      size="small"
                      sx={{ width: 120 }}
                    />
                    
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => adjustTemperature(0.1)}
                      disabled={temperature >= 28}
                      size="small"
                    >
                      +0.1°C
                    </Button>
                  </Box>

                  {/* Set Temperature Button */}
                  <Button
                    variant="contained"
                    onClick={handleSetTemperature}
                    disabled={loading || !isTemperatureValid}
                    startIcon={loading ? <CircularProgress size={20} /> : <AcUnit />}
                    sx={{ py: 1.5 }}
                    fullWidth
                  >
                    {loading ? 'Setting Temperature...' : `Set Temperature to ${temperature.toFixed(1)}°C`}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Messages - Fixed at bottom */}
        <Box sx={{ mt: 2 }}>
          {message && (
            <Alert icon={<CheckCircle />} severity="success" sx={{ mb: 1 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert icon={<ErrorIcon />} severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Container>
    </Box>
  );
};