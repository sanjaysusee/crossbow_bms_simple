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
  Collapse,
  Box,
  IconButton,
  Switch,
  FormControlLabel,
  Chip,
  Paper,
  Fade,
  Slide,
  Grow,
  Divider,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  PowerSettingsNew,
  Add,
  Remove,
  CheckCircle,
  Error as ErrorIcon,
  ExpandMore,
  AcUnit,
  Refresh,
  Wifi,
  WifiOff,
  Thermostat,
  Speed,
  Power,
  Schedule,
  Dashboard,
  Settings,
  TrendingUp,
  Security,
  Assessment,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { SetTempPayload, SetTempResponse, AcControlPayload, BmsCurrentStatus, ScheduleStatusPayload, ScheduleTimePayload } from "../types/bms";
import { bmsApi } from "../services/bmsApi";

interface TemperatureControlProps {
  onLogout: () => void;
  onNavigate?: (view: 'main' | 'reports') => void;
}

export const TemperatureControl: React.FC<TemperatureControlProps> = ({
  onLogout,
  onNavigate,
}) => {
  const [temperature, setTemperature] = useState<number>(25.5);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [fullResponse, setFullResponse] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [acOn, setAcOn] = useState<boolean>(false);
  const [acLoading, setAcLoading] = useState<boolean>(false);
  
  // Real-time data states
  const [currentStatus, setCurrentStatus] = useState<BmsCurrentStatus | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  // Schedule control states
  const [scheduleStatus, setScheduleStatus] = useState<boolean>(false);
  const [scheduleLoading, setScheduleLoading] = useState<boolean>(false);
  const [scheduleOnTime, setScheduleOnTime] = useState<string>("12:00");
  const [scheduleOffTime, setScheduleOffTime] = useState<string>("15:00");
  const [showScheduleTimeInputs, setShowScheduleTimeInputs] = useState<boolean>(false);

  // Animation states
  const [fadeIn, setFadeIn] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [growIn, setGrowIn] = useState(false);
  
  // Sidebar state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');

  const isTemperatureValid = temperature >= 23 && temperature <= 28;
  
  const drawerWidth = 280;
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Dashboard />, active: true },
    { id: 'bms-main', label: 'BMS', icon: <Thermostat />, active: false },
    { id: 'reports', label: 'Reports', icon: <Assessment />, active: false },
  ];
  
  const handleMenuItemClick = (menuId: string) => {
    setSelectedMenuItem(menuId);
    if (menuId === 'reports') {
      onNavigate?.('reports');
    } else if (menuId === 'dashboard') {
      // Stay on current page (dashboard view)
      setSelectedMenuItem('dashboard');
    } else if (menuId === 'bms-main') {
      // Navigate to main page
      onNavigate?.('main');
    }
    setMobileOpen(false);
  };
  
  const renderSidebarContent = () => (
    <Box>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Crossbow BMS
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={() => onNavigate?.('main')}
            sx={{ 
              color: 'white',
              minWidth: 'auto',
              p: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Dashboard sx={{ fontSize: 20 }} />
          </Button>
        </Box>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={selectedMenuItem === item.id}
              onClick={() => handleMenuItemClick(item.id)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                sx={{ color: 'white' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

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

  // Fetch current BMS status
  const fetchCurrentStatus = useCallback(async () => {
    try {
      setRefreshing(true);
      console.log('Fetching current BMS status...');
      
      // Use the real BMS API to get current status
      const data = await bmsApi.getCurrentStatus();
      console.log('Received BMS data:', data);
      
      setCurrentStatus(data);
      // Update the target temperature to match what BMS is currently configured to maintain
      setTemperature(data.setTemperature); // Sync user input with BMS configured temperature
      setAcOn(data.acStatus); // Update AC status from BMS
      setScheduleStatus(data.scheduleStatus); // Update schedule status from BMS
      setScheduleOnTime(data.scheduleOnTime || "12:00"); // Update schedule on time from BMS
      setScheduleOffTime(data.scheduleOffTime || "15:00"); // Update schedule off time from BMS
      setLastUpdated(data.lastUpdated);
      setIsOnline(true);
      
      console.log('Updated app state with BMS data:', {
        temperature: data.temperature,
        acStatus: data.acStatus,
        scheduleStatus: data.scheduleStatus,
        scheduleOnTime: data.scheduleOnTime,
        scheduleOffTime: data.scheduleOffTime,
        lastUpdated: data.lastUpdated
      });
      
    } catch (err) {
      console.error("Failed to fetch current status:", err);
      setIsOnline(false);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Auto-refresh every 5 minutes (300 seconds)
  useEffect(() => {
    // Initial fetch
    fetchCurrentStatus();
    
    // Set up interval for auto-refresh every 5 minutes
    const interval = setInterval(fetchCurrentStatus, 300000); // 5 minutes = 300,000 ms
    
    return () => clearInterval(interval);
  }, [fetchCurrentStatus]);

  // Manual refresh - happens immediately when button is clicked
  const handleManualRefresh = () => {
    console.log('Manual refresh requested');
    fetchCurrentStatus();
  };

  const handleSetTemperature = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    setFullResponse(null);

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
      const response = await fetch("http://localhost:4000/api/set-temp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to set temperature");

      const data: SetTempResponse = await response.json();
      setFullResponse(data);

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
    setFullResponse(null);

    // Use the correct payload structure for AC control
    const payload: AcControlPayload = {
      device_vfdReadingStatus: checked ? 1 : 0, // 1 for ON, 0 for OFF
      device_vfdReadingFreq: checked ? 40.00 : undefined, // 40.00 Hz when turning ON
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
      const response = await fetch("http://localhost:4000/api/set-temp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to control AC");

      const data: SetTempResponse = await response.json();
      setFullResponse(data);

      if (data.data && data.data.status === "Failure") {
        setError(`BMS Error: ${data.data.message}`);
        // Revert the switch state on failure
        setAcOn(!checked);
      } else {
        setMessage(`AC turned ${checked ? "ON" : "OFF"} successfully! Status: ${data.status}`);
        setAcOn(checked);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to control AC");
      // Revert the switch state on error
      setAcOn(!checked);
    } finally {
      setAcLoading(false);
    }
  };

  const handleScheduleControl = async (checked: boolean) => {
    setScheduleLoading(true);
    setMessage("");
    setError("");
    setFullResponse(null);

    try {
      if (checked) {
        // When turning ON schedule, we need to set both status and time
        const timePayload: ScheduleTimePayload = {
          device_vfdReadingScheduleStatus: 1, // 1 for ON
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

        const response = await bmsApi.setScheduleTime(timePayload);
        setFullResponse(response);

        if (response.data && response.data.status === "Failure") {
          setError(`BMS Error: ${response.data.message}`);
          setScheduleStatus(false);
        } else {
          setMessage(`Schedule ENABLED successfully! ON: ${scheduleOnTime}, OFF: ${scheduleOffTime}. Status: ${response.message}`);
          setScheduleStatus(true);
        }
      } else {
        // When turning OFF schedule, we just need to set status to 0
        const statusPayload: ScheduleStatusPayload = {
          device_vfdReadingScheduleStatus: 0, // 0 for OFF
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

        const response = await bmsApi.setScheduleStatus(statusPayload);
        setFullResponse(response);

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
      // Revert the switch state on error
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
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'fixed',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
          animation: 'float 8s ease-in-out infinite',
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
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(118, 75, 162, 0.08), rgba(102, 126, 234, 0.08))',
          animation: 'float 6s ease-in-out infinite reverse',
          zIndex: 0,
        }}
      />

      {/* Top Bar */}
      <Fade in={fadeIn} timeout={800}>
        <AppBar 
          position="static" 
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
          }}
        >
          <Toolbar sx={{ 
            flexWrap: 'wrap',
            gap: { xs: 1, sm: 2 },
            py: { xs: 1, sm: 2 }
          }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box display="flex" alignItems="center" gap={1} sx={{ flexGrow: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  mr: 1,
                }}
              >
                <Security sx={{ fontSize: { xs: 20, sm: 24 }, color: 'white' }} />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                BMS Control
              </Typography>
            </Box>
            
            {/* Status Indicators */}
            <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }} mr={{ xs: 1, sm: 2 }}>
              <Chip
                icon={isOnline ? <Wifi /> : <WifiOff />}
                label={isOnline ? "Online" : "Offline"}
                color={isOnline ? "success" : "error"}
                size="small"
                variant="outlined"
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  display: { xs: 'none', sm: 'flex' },
                }}
              />
              {lastUpdated && (
                <Chip
                  label={`Updated: ${lastUpdated}`}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    display: { xs: 'none', md: 'flex' },
                  }}
                />
              )}
            </Box>
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleManualRefresh}
              disabled={refreshing}
              size="small"
              sx={{ 
                mr: { xs: 1, sm: 2 },
                borderRadius: 2,
                borderColor: 'primary.main',
                color: 'primary.main',
                px: { xs: 1, sm: 2 },
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.1)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {refreshing ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Box sx={{ display: { xs: 'block' } }}>
                  Refresh
                </Box>
              )}
            </Button>
            

            
            <Button
              variant="contained"
              startIcon={<PowerSettingsNew />}
              onClick={onLogout}
              size="small"
              sx={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                borderRadius: 2,
                px: { xs: 1, sm: 2 },
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                Logout
              </Box>
            </Button>
          </Toolbar>
        </AppBar>
      </Fade>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            },
          }}
        >
          {renderSidebarContent()}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            },
          }}
          open
        >
          {renderSidebarContent()}
        </Drawer>
      </Box>

      <Container 
        maxWidth="xl" 
        sx={{ 
          mt: { xs: 2, sm: 4 }, 
          mb: { xs: 3, sm: 5 },
          px: { xs: 2, sm: 3, md: 4 },
          zIndex: 2,
          position: 'relative',
          ml: { md: `${drawerWidth}px` },
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Slide in={slideIn} direction="up" timeout={600}>
          <Box>
            {/* Main Temperature Display Card */}
            <Grow in={growIn} timeout={800}>
              <Card
                elevation={16}
                sx={{
                  borderRadius: { xs: 2, sm: 3 },
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  overflow: 'hidden',
                  position: 'relative',
                  mb: { xs: 1, sm: 2 },
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
                <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                  <Box textAlign="center" mb={{ xs: 2, sm: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
                      Temperature Control
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      Building Management System Dashboard
                    </Typography>
                  </Box>

                  {/* AC Control Switch */}
                  <Box textAlign="center" my={{ xs: 2, sm: 3, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={acOn}
                          onChange={(e) => handleAcControl(e.target.checked)}
                          disabled={acLoading}
                          size="medium"
                          color="primary"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#667eea',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#667eea',
                            },
                          }}
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <AcUnit 
                            sx={{ 
                              fontSize: { xs: 24, sm: 28, md: 32 },
                              color: acOn ? '#667eea' : 'text.disabled',
                              transition: 'all 0.3s ease',
                            }} 
                          />
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              color: acOn ? '#667eea' : 'text.secondary',
                              fontWeight: 600,
                              transition: 'all 0.3s ease',
                              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                            }}
                          >
                            AC {acOn ? "ON" : "OFF"}
                          </Typography>
                          {acLoading && <CircularProgress size={24} />}
                        </Box>
                      }
                    />
                  </Box>

                  {/* Schedule Control Switch */}
                  <Box textAlign="center" my={{ xs: 2, sm: 3, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={scheduleStatus}
                          onChange={(e) => handleScheduleControl(e.target.checked)}
                          disabled={scheduleLoading}
                          size="medium"
                          color="secondary"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#764ba2',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#764ba2',
                            },
                          }}
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Schedule 
                            sx={{ 
                              fontSize: { xs: 24, sm: 28, md: 32 },
                              color: scheduleStatus ? '#764ba2' : 'text.disabled',
                              transition: 'all 0.3s ease',
                            }} 
                          />
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              color: scheduleStatus ? '#764ba2' : 'text.secondary',
                              fontWeight: 600,
                              transition: 'all 0.3s ease',
                              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                            }}
                          >
                            Schedule {scheduleStatus ? "ACTIVE" : "INACTIVE"}
                          </Typography>
                          {scheduleLoading && <CircularProgress size={24} />}
                        </Box>
                      }
                    />
                    
                    {/* Schedule Time Inputs */}
                    <Box mt={{ xs: 2, sm: 3 }} display="flex" flexDirection="column" alignItems="center" gap={2}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setShowScheduleTimeInputs(!showScheduleTimeInputs)}
                        sx={{
                          color: '#764ba2',
                          borderColor: '#764ba2',
                          '&:hover': {
                            borderColor: '#764ba2',
                            backgroundColor: 'rgba(118, 75, 162, 0.1)',
                          },
                        }}
                      >
                        {showScheduleTimeInputs ? "Hide Time Settings" : "Set Schedule Times"}
                      </Button>
                      
                      {showScheduleTimeInputs && (
                        <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={2} sx={{ 
                          border: '1px solid rgba(118, 75, 162, 0.3)', 
                          borderRadius: 2, 
                          backgroundColor: 'rgba(118, 75, 162, 0.05)',
                          minWidth: 300,
                        }}>
                          <Typography variant="subtitle1" color="primary" fontWeight={600}>
                            Schedule Time Settings
                          </Typography>
                          
                          <Box display="flex" gap={2} alignItems="center">
                            <TextField
                              label="Start Time"
                              type="time"
                              value={scheduleOnTime}
                              onChange={(e) => setScheduleOnTime(e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              size="small"
                              sx={{ minWidth: 120 }}
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
                              sx={{ minWidth: 120 }}
                            />
                          </Box>
                          
                          <Typography variant="caption" color="text.secondary" textAlign="center">
                            Current: {scheduleOnTime} - {scheduleOffTime}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Current BMS Temperature Display */}
                  <Box textAlign="center" my={{ xs: 2, sm: 3, md: 4 }}>
                    <Typography variant="h6" color="text.secondary" mb={{ xs: 1, sm: 2 }} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                      Current BMS Temperature
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: { xs: 1, sm: 2 },
                        fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem', lg: '5rem' },
                      }}
                    >
                      {currentStatus ? currentStatus.temperature.toFixed(1) : '--'}°C
                    </Typography>
                    {currentStatus && (
                      <Typography variant="h6" color="text.secondary" mb={{ xs: 1, sm: 2 }} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        Target: {temperature.toFixed(1)}°C (synced with BMS setting)
                      </Typography>
                    )}
                    
                    {/* Real-time Status Indicator */}
                    <Box mt={{ xs: 2, sm: 3 }}>
                      <Chip
                        icon={refreshing ? <CircularProgress size={16} /> : (isOnline ? <Wifi /> : <WifiOff />)}
                        label={refreshing ? "Fetching..." : (isOnline ? "Live Data" : "Offline")}
                        color={refreshing ? "warning" : (isOnline ? "success" : "error")}
                        variant="outlined"
                        sx={{ 
                          fontSize: { xs: '0.75rem', sm: '1rem' },
                          padding: { xs: '4px 8px', sm: '8px 16px' },
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grow>

            {/* Temperature Controls - Moved Above Real-time Data */}
            <Grow in={growIn} timeout={1000}>
              <Card
                elevation={16}
                sx={{
                  borderRadius: { xs: 2, sm: 3 },
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  overflow: 'hidden',
                  position: 'relative',
                  mb: { xs: 1, sm: 2 },
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
                <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                  <Box textAlign="center" mb={{ xs: 1.5, sm: 2, md: 3 }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' } }}>
                      Set Target Temperature (23-28°C)
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      Adjust the temperature you want the BMS to maintain
                    </Typography>
                  </Box>
                  
                  <Stack spacing={4}>
                    {/* Slider */}
                    <Box>
                      <Typography variant="subtitle1" gutterBottom align="center" color="primary">
                        Temperature Range
                      </Typography>
                      <Slider
                        min={23}
                        max={28}
                        step={0.1}
                        value={temperature}
                        onChange={(_, value) => setTemperature(value as number)}
                        valueLabelDisplay="auto"
                        marks
                        sx={{
                          '& .MuiSlider-thumb': {
                            width: 24,
                            height: 24,
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            '&:hover': {
                              boxShadow: '0 0 0 8px rgba(102, 126, 234, 0.16)',
                            },
                          },
                          '& .MuiSlider-track': {
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          },
                          '& .MuiSlider-rail': {
                            background: 'rgba(102, 126, 234, 0.2)',
                          },
                        }}
                      />
                    </Box>

                    {/* Increment/Decrement */}
                    <Stack direction="row" spacing={3} justifyContent="center">
                      <Button
                        variant="outlined"
                        startIcon={<Remove />}
                        onClick={() => adjustTemperature(-0.1)}
                        disabled={temperature <= 23}
                        sx={{
                          borderRadius: 2,
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          px: 3,
                          py: 1.5,
                          '&:hover': {
                            background: 'rgba(102, 126, 234, 0.1)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        -0.1°C
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => adjustTemperature(0.1)}
                        disabled={temperature >= 28}
                        sx={{
                          borderRadius: 2,
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          px: 3,
                          py: 1.5,
                          '&:hover': {
                            background: 'rgba(102, 126, 234, 0.1)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        +0.1°C
                      </Button>
                    </Stack>

                    {/* Manual Input */}
                    <TextField
                      label="Target Temperature (°C)"
                      type="number"
                      inputProps={{ step: 0.1, min: 23, max: 28 }}
                      value={temperature}
                      onChange={(e) =>
                        setTemperature(parseFloat(e.target.value) || 25.5)
                      }
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
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

                    {/* Submit Button */}
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleSetTemperature}
                      disabled={loading || !isTemperatureValid}
                      startIcon={
                        loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <Dashboard />
                        )
                      }
                      sx={{
                        py: 2,
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
                      {loading ? 'Setting Temperature...' : `Set Temperature to ${temperature.toFixed(1)}°C`}
                    </Button>
                  </Stack>

                  {/* Messages */}
                  <Box mt={4}>
                    {message && (
                      <Alert
                        icon={<CheckCircle fontSize="inherit" />}
                        severity="success"
                        sx={{ 
                          mb: 2,
                          borderRadius: 2,
                          '& .MuiAlert-message': {
                            fontWeight: 500,
                          },
                        }}
                      >
                        {message}
                      </Alert>
                    )}
                    {error && (
                      <Alert
                        icon={<ErrorIcon fontSize="inherit" />}
                        severity="error"
                        sx={{ 
                          mb: 2,
                          borderRadius: 2,
                          '& .MuiAlert-message': {
                            fontWeight: 500,
                          },
                        }}
                      >
                        {error}
                      </Alert>
                    )}
                  </Box>

                  {/* Debug Info */}
                  {fullResponse && (
                    <Box mt={4}>
                      <Button
                        variant="text"
                        size="small"
                        endIcon={
                          <ExpandMore
                            sx={{
                              transform: showDetails ? "rotate(180deg)" : "rotate(0)",
                              transition: "0.2s",
                            }}
                          />
                        }
                        onClick={() => setShowDetails(!showDetails)}
                        sx={{ color: 'primary.main' }}
                      >
                        {showDetails ? "Hide Details" : "View System Response"}
                      </Button>
                      <Collapse in={showDetails}>
                        <Box
                          mt={2}
                          p={3}
                          sx={{
                            bgcolor: "grey.100",
                            borderRadius: 2,
                            fontSize: "0.8rem",
                            overflow: "auto",
                            maxHeight: 250,
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          <pre>{JSON.stringify(fullResponse, null, 2)}</pre>
                        </Box>
                      </Collapse>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grow>

            {/* Real-time BMS Data Grid */}
            {currentStatus && (
              <Grow in={growIn} timeout={1000}>
                <Box mb={{ xs: 1, sm: 2 }}>
                  <Typography variant="h5" gutterBottom align="center" sx={{ 
                    mb: { xs: 1.5, sm: 2 }, 
                    fontWeight: 600,
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                  }}>
                    Real-time BMS Data
                  </Typography>
                  <Stack spacing={{ xs: 1.5, sm: 2 }}>
                    {/* Temperature & AC Status */}
                    <Paper 
                      elevation={8}
                      sx={{ 
                        p: { xs: 2, sm: 3 },
                        borderRadius: { xs: 2, sm: 3 },
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        zIndex: 5,
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                        },
                      }}
                    >
                      <Stack spacing={{ xs: 1, sm: 2 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: { xs: 32, sm: 40 },
                              height: { xs: 32, sm: 40 },
                              borderRadius: '50%',
                              background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            }}
                          >
                            <Thermostat sx={{ fontSize: { xs: 20, sm: 24 }, color: 'white' }} />
                          </Box>
                          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                            Temperature Control
                          </Typography>
                        </Box>
                        <Divider />
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Current Temperature:</Typography>
                          <Typography fontWeight="bold" color="primary">
                            {currentStatus.temperature.toFixed(1)}°C
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Set Temperature:</Typography>
                          <Typography fontWeight="bold" color="primary">
                            {currentStatus.setTemperature.toFixed(1)}°C
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>AC Status:</Typography>
                          <Chip 
                            label={currentStatus.acStatus ? "ON" : "OFF"} 
                            color={currentStatus.acStatus ? "success" : "default"}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Frequency:</Typography>
                          <Typography fontWeight="bold" color="primary">
                            {currentStatus.frequency.toFixed(1)} Hz
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>

                    {/* Power & Performance */}
                    <Paper 
                      elevation={8}
                      sx={{ 
                        p: 3,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                        },
                      }}
                    >
                      <Stack spacing={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            }}
                          >
                            <Power sx={{ fontSize: 24, color: 'white' }} />
                          </Box>
                          <Typography variant="h6" fontWeight="bold">
                            Power & Performance
                          </Typography>
                        </Box>
                        <Divider />
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Power:</Typography>
                          <Typography fontWeight="bold" color="primary">
                            {currentStatus.power.toFixed(1)} W
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>BTU:</Typography>
                          <Typography fontWeight="bold" color="primary">
                            {currentStatus.btu.toFixed(0)}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Voltage:</Typography>
                          <Typography fontWeight="bold" color="primary">
                            {currentStatus.voltage.toFixed(1)} V
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Current:</Typography>
                          <Typography fontWeight="bold" color="primary">
                            {currentStatus.current.toFixed(1)} A
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Running Hours:</Typography>
                          <Typography fontWeight="bold" color="primary">
                            {currentStatus.runningHours.toFixed(1)} hrs
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>

                    {/* Environmental Data */}
                    <Paper 
                      elevation={8}
                      sx={{ 
                        p: 3,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                        },
                      }}
                    >
                      <Stack spacing={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            }}
                          >
                            <Speed sx={{ fontSize: 24, color: 'white' }} />
                          </Box>
                          <Typography variant="h6" fontWeight="bold">
                            Environmental Data
                          </Typography>
                        </Box>
                        <Divider />
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Humidity:</Typography>
                          <Typography fontWeight="bold" color="primary">
                            {currentStatus.humidity.toFixed(1)}%
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>CO2 Level:</Typography>
                          <Typography fontWeight="bold" color="primary">
                            {currentStatus.co2Level.toFixed(0)} ppm
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Air Quality Index:</Typography>
                          <Typography fontWeight="bold" color="primary">
                            {currentStatus.airQualityIndex.toFixed(0)}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Supply Air:</Typography>
                          <Typography fontWeight="bold" color="primary">
                            {currentStatus.supplyAir.toFixed(1)}°C
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Water In:</Typography>
                          <Typography fontWeight="bold" color="primary">
                            {currentStatus.waterIn.toFixed(1)}°C
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Water Out:</Typography>
                          <Typography fontWeight="bold" color="primary">
                            {currentStatus.waterOut.toFixed(1)}°C
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>

                    {/* System Status */}
                    <Paper 
                      elevation={8}
                      sx={{ 
                        p: 3,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                        },
                      }}
                    >
                      <Stack spacing={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            }}
                          >
                            <Schedule sx={{ fontSize: 24, color: 'white' }} />
                          </Box>
                          <Typography variant="h6" fontWeight="bold">
                            System Status
                          </Typography>
                        </Box>
                        <Divider />
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Mode:</Typography>
                          <Chip 
                            label={currentStatus.mode} 
                            color={currentStatus.mode === "Auto" ? "success" : "default"}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Schedule Status:</Typography>
                          <Chip 
                            label={currentStatus.scheduleStatus ? "Active" : "Inactive"} 
                            color={currentStatus.scheduleStatus ? "success" : "default"}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        {currentStatus.scheduleStatus && (
                          <>
                            <Box display="flex" justifyContent="space-between">
                              <Typography>Schedule On:</Typography>
                              <Typography fontWeight="bold" color="primary">
                                {currentStatus.scheduleOnTime}
                              </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                              <Typography>Schedule Off:</Typography>
                              <Typography fontWeight="bold" color="primary">
                                {currentStatus.scheduleOffTime}
                              </Typography>
                            </Box>
                          </>
                        )}
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Last Updated:</Typography>
                          <Typography fontWeight="bold" variant="caption" color="primary">
                            {currentStatus.lastUpdated}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Current Schedule State:</Typography>
                          <Chip 
                            label={scheduleStatus ? "ENABLED" : "DISABLED"} 
                            color={scheduleStatus ? "secondary" : "default"}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </Stack>
                    </Paper>
                  </Stack>
                </Box>
              </Grow>
            )}

          </Box>
        </Slide>
      </Container>
    </Box>
  );
};