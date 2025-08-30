import axios from 'axios';
import {
  LoginCredentials,
  LoginResponse,
  SetTempPayload,
  SetTempResponse,
  AcControlPayload,
  BmsCurrentStatus,
  BmsApiResponse,
  BmsDeviceData,
  ProxyResponse,
  VfdStatsResponse,
  VfdStatsRequest,
  ScheduleStatusPayload,
  ScheduleStatusResponse,
  ScheduleTimePayload,
  ScheduleTimeResponse
} from '../types/bms';

// Environment-based API configuration
const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, use the environment variable or default to your deployed backend
    return process.env.REACT_APP_API_BASE_URL || 'https://your-backend-url.railway.app/api';
  }
  // In development, use localhost
  return 'http://localhost:4000/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', process.env.NODE_ENV);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for production
});

export const bmsApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', credentials);
    return response.data;
  },

  setTemperature: async (payload: SetTempPayload): Promise<SetTempResponse> => {
    const response = await api.post<SetTempResponse>('/set-temp', payload);
    return response.data;
  },

  controlAc: async (payload: AcControlPayload): Promise<SetTempResponse> => {
    console.log('Sending AC control request to backend API with payload:', payload);
    const response = await api.post<SetTempResponse>('/control-ac', payload);
    return response.data;
  },

  // Get current BMS status from the backend API (proxied to avoid CORS)
  getCurrentStatus: async (): Promise<BmsCurrentStatus> => {
    try {
      console.log('Fetching current BMS status from backend API...');
      
      // Call our backend API instead of BMS directly to avoid CORS
      const response = await api.post<ProxyResponse>('/get-current-status');
      
      console.log('Backend API Response:', response.data);
      
      // Safe parsing function to handle escape characters
      const safeParse = (value: any) => {
        if (typeof value === "string") {
          try {
            // Clean up common escape issues before parsing
            const cleaned = value.replace(/\n/g, "").replace(/\\+/g, "\\");
            return JSON.parse(cleaned);
          } catch (err) {
            console.error("Safe parse failed:", err, "on value:", value);
            return value; // Return raw if still broken
          }
        }
        return value; // Already object
      };

      // First unwrap (outer data)
      const parsedOuter = safeParse(response.data.data);
      console.log('Parsed outer BMS response:', parsedOuter);

      // Second unwrap (inner devicedata)
      const parsedInner = safeParse(parsedOuter.devicedata);
      console.log('Parsed inner device data:', parsedInner);

      if (parsedOuter.status === 'Success' && parsedInner && parsedInner.data && parsedInner.data.length > 0) {
        const data = parsedInner.data[0];
        console.log('Successfully parsed device data:', data);

        // Map to your app's format
        return {
          temperature: parseFloat(data.vfdReadingRetAirtemp) || 0,        // Current actual temperature from BMS
          acStatus: data.vfdReadingStatus === '1',
          frequency: parseFloat(data.vfdReadingFreq) || 0,
          power: parseFloat(data.vfdReadingPower) || 0,
          mode: data.vfdReadingMode === '1' ? 'Auto' : 'Manual',
          lastUpdated: data.vfdReadingLogtime || new Date().toLocaleString(),
          setTemperature: parseFloat(data.vfdReadingSetTemp) || 0,       // Temperature setting configured in BMS
          humidity: parseFloat(data.vfdReadingHumidity) || 0,
          btu: parseFloat(data.vfdReadingBtu) || 0,
          voltage: parseFloat(data.vfdReadingVoltage) || 0,
          current: parseFloat(data.vfdReadingCurrent) || 0,
          runningHours: parseFloat(data.vfdReadingRunningHrs) || 0,
          waterIn: parseFloat(data.vfdReadingWaterIn) || 0,
          waterOut: parseFloat(data.vfdReadingWaterOut) || 0,
          supplyAir: parseFloat(data.vfdReadingSupplyAir) || 0,
          co2Level: parseFloat(data.vfdReadingCo2Level) || 0,
          airQualityIndex: parseFloat(data.vfdAirQualityIndex) || 0,
          scheduleStatus: data.vfdReadingScheduleStatus === '1',
          scheduleOnTime: data.vfdReadingScheduleOnTime || '',
          scheduleOffTime: data.vfdReadingScheduleOffTime || '',
        };
      } else {
        console.error('Response missing required fields or not successful:', {
          status: parsedOuter.status,
          hasDevicedata: !!parsedOuter.devicedata,
          hasInnerData: !!parsedInner?.data
        });
        throw new Error('Invalid BMS response');
      }
    } catch (error) {
      console.error('Error fetching BMS status:', error);
      throw error;
    }
  },

  // Get real-time data (same as current status for now)
  getRealTimeData: async (): Promise<BmsCurrentStatus> => {
    return bmsApi.getCurrentStatus();
  },

  // Get VFD statistics data
  getVfdStats: async (request: VfdStatsRequest): Promise<VfdStatsResponse> => {
    try {
      console.log('Fetching VFD statistics data...');
      
      const response = await api.post<VfdStatsResponse>('/vfd-stats', request);
      
      console.log('VFD Stats Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching VFD stats:', error);
      throw error;
    }
  },

  // Set schedule status for VFD system
  setScheduleStatus: async (payload: ScheduleStatusPayload): Promise<ScheduleStatusResponse> => {
    try {
      console.log('Setting schedule status...');
      
      const response = await api.post<ScheduleStatusResponse>('/set-schedule-status', payload);
      
      console.log('Schedule Status Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error setting schedule status:', error);
      throw error;
    }
  },

  // Set schedule time for VFD system
  setScheduleTime: async (payload: ScheduleTimePayload): Promise<ScheduleTimeResponse> => {
    try {
      console.log('Setting schedule time...');
      
      const response = await api.post<ScheduleTimeResponse>('/set-schedule-time', payload);
      
      console.log('Schedule Time Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error setting schedule time:', error);
      throw error;
    }
  },
};
