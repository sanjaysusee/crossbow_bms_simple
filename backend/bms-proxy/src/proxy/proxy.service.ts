import { Injectable, BadRequestException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { AuthService } from '../auth/auth.service';
import { SetTempPayload, VfdStatsRequest } from '../common/types';
import * as qs from 'querystring';
import { AcControlPayload } from '../common/types';

@Injectable()
export class ProxyService {
  constructor(private readonly authService: AuthService) {}

  async setTemperature(payload: SetTempPayload): Promise<any> {
    try {
      // Get stored cookies
      const cookies = this.authService.getCookies();
      
      // Check if we have JSESSIONID (main session cookie)
      if (!cookies.JSESSIONID) {
        throw new BadRequestException('No active session. Please login first.');
      }

      // Construct cookie string (include all available cookies)
      let cookieHeader = `JSESSIONID=${cookies.JSESSIONID}`;
      if (cookies.DWRSESSIONID) {
        cookieHeader += `; DWRSESSIONID=${cookies.DWRSESSIONID}`;
      }

      console.log('Sending request to BMS API:');
      console.log('URL:', 'https://bmsdev.chakranetwork.com:8080/bms/setHandler');
      console.log('Payload:', JSON.stringify(payload, null, 2));
      console.log('Cookies:', cookieHeader);

      // Convert payload to form-encoded format (this is what BMS API expects)
      const formPayload = Object.entries(payload).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>);
      
      const formData = qs.stringify(formPayload);
      
      console.log('Form-encoded data:', formData);

      // Send request with form-encoded data (matching BMS API expectations)
      const response: AxiosResponse = await axios.post(
        'https://bmsdev.chakranetwork.com:8080/bms/setHandler',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookieHeader,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
          }
        }
      );

      console.log('BMS API Response Status:', response.status);
      console.log('BMS API Response Content-Type:', response.headers['content-type']);
      console.log('BMS API Response Data Length:', response.data?.length || 0);
      console.log('BMS API Response Headers:', response.headers);
      console.log('BMS API Response Data:', response.data);

      // Try to parse the response to detect BMS-side errors
      let parsedData: any = null;
      let bmsStatus = 'Unknown';
      let bmsMessage = 'No message';
      let bmsStatusCode = 'Unknown';

      try {
        // The BMS API might return JSON embedded in HTML or plain JSON
        if (typeof response.data === 'string') {
          // Try to extract JSON from HTML response
          const jsonMatch = response.data.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[0]);
            bmsStatus = parsedData.status || 'Unknown';
            bmsMessage = parsedData.message || 'No message';
            bmsStatusCode = parsedData.statusCode || 'Unknown';
          }
        } else if (typeof response.data === 'object') {
          parsedData = response.data;
          bmsStatus = parsedData.status || 'Unknown';
          bmsMessage = parsedData.message || 'No message';
          bmsStatusCode = parsedData.statusCode || 'Unknown';
        }
      } catch (parseError) {
        console.log('Could not parse BMS response:', parseError.message);
      }

      // Check if BMS actually succeeded
      const isBmsSuccess = bmsStatus === 'Success' || bmsStatus === 'SUCCESS';
      
      console.log('Parsed BMS Response:', {
        bmsStatus,
        bmsMessage,
        bmsStatusCode,
        isBmsSuccess
      });

      // Return the response with detailed information
      return {
        status: response.status,
        data: parsedData || response.data,
        contentType: response.headers['content-type'],
        success: isBmsSuccess,
        message: isBmsSuccess ? 
          'Temperature set successfully!' : 
          `BMS Error: ${bmsMessage}`,
        bmsStatus,
        bmsMessage,
        bmsStatusCode
      };

    } catch (error) {
      console.error('Set temperature failed:', error.response?.data || error.message);
      
      // If unauthorized, clear cookies
      if (error.response?.status === 401) {
        this.authService.clearCookies();
        throw new BadRequestException('Session expired. Please login again.');
      }
      
      throw new BadRequestException('Failed to set temperature');
    }
  }

  async controlAc(payload: AcControlPayload): Promise<any> {
    try {
      // Get stored cookies
      const cookies = this.authService.getCookies();
      
      // Check if we have JSESSIONID (main session cookie)
      if (!cookies.JSESSIONID) {
        throw new BadRequestException('No active session. Please login first.');
      }

      // Construct cookie string (include all available cookies)
      let cookieHeader = `JSESSIONID=${cookies.JSESSIONID}`;
      if (cookies.DWRSESSIONID) {
        cookieHeader += `; DWRSESSIONID=${cookies.DWRSESSIONID}`;
      }

      console.log('Sending AC control request to BMS API:');
      console.log('URL:', 'https://bmsdev.chakranetwork.com:8080/bms/setHandler');
      console.log('Payload:', JSON.stringify(payload, null, 2));
      console.log('Cookies:', cookieHeader);

      // Convert payload to form-encoded format (this is what BMS API expects)
      const formPayload = Object.entries(payload).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>);
      
      const formData = qs.stringify(formPayload);
      
      console.log('Form-encoded data:', formData);

      // Send request with form-encoded data (matching BMS API expectations)
      const response: AxiosResponse = await axios.post(
        'https://bmsdev.chakranetwork.com:8080/bms/setHandler',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookieHeader,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
          }
        }
      );

      console.log('BMS AC Control API Response Status:', response.status);
      console.log('BMS AC Control API Response Content-Type:', response.headers['content-type']);
      console.log('BMS AC Control API Response Data Length:', response.data?.length || 0);
      console.log('BMS AC Control API Response Headers:', response.headers);
      console.log('BMS AC Control API Response Data:', response.data);

      // Try to parse the response to detect BMS-side errors
      let parsedData: any = null;
      let bmsStatus = 'Unknown';
      let bmsMessage = 'No message';
      let bmsStatusCode = 'Unknown';

      try {
        // The BMS API might return JSON embedded in HTML or plain JSON
        if (typeof response.data === 'string') {
          // Try to extract JSON from HTML response
          const jsonMatch = response.data.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[0]);
            bmsStatus = parsedData.status || 'Unknown';
            bmsMessage = parsedData.message || 'No message';
            bmsStatusCode = parsedData.statusCode || 'Unknown';
          }
        } else if (typeof response.data === 'object') {
          parsedData = response.data;
          bmsStatus = parsedData.status || 'Unknown';
          bmsMessage = parsedData.message || 'No message';
          bmsStatusCode = parsedData.statusCode || 'Unknown';
        }
      } catch (parseError) {
        console.log('Could not parse BMS AC control response:', parseError.message);
      }

      // Check if BMS actually succeeded
      const isBmsSuccess = bmsStatus === 'Success' || bmsStatus === 'SUCCESS';
      
      console.log('Parsed BMS AC Control Response:', {
        bmsStatus,
        bmsMessage,
        bmsStatusCode,
        isBmsSuccess
      });

      // Return the response with detailed information
      return {
        status: response.status,
        data: parsedData || response.data,
        contentType: response.headers['content-type'],
        success: isBmsSuccess,
        message: isBmsSuccess ? 
          'AC control successful!' : 
          `BMS Error: ${bmsMessage}`,
        bmsStatus,
        bmsMessage,
        bmsStatusCode
      };

    } catch (error) {
      console.error('AC control failed:', error.response?.data || error.message);
      
      // If unauthorized, clear cookies
      if (error.response?.status === 401) {
        this.authService.clearCookies();
        throw new BadRequestException('Session expired. Please login again.');
      }
      
      throw new BadRequestException('Failed to control AC');
    }
  }

  async getCurrentStatus(): Promise<any> {
    try {
      // Get stored cookies
      const cookies = this.authService.getCookies();
      
      // Check if we have JSESSIONID (main session cookie)
      if (!cookies.JSESSIONID) {
        throw new BadRequestException('No active session. Please login first.');
      }

      // Prepare the payload exactly as shown in BMS network tab
      const payload = {
        operationDoneBy: "crossbow",
        requestType: "ElectricalMeters",
        subRequestType: "GetDataFromDevice",
        username: "crossbow",
        neId: "581",
        neName: "CrossBowLab",
        neVersion: "VFD_005",
        agentId: "581",
        operationType: "CONFIGURATION",
        operationId: "41061",
        operationName: "GET",
        uniqueId: "SWAHVACAHU00000286",
        subSystem: "VFD",
        subSystemId: "128",
        topic: "swadha/SWAHVACAHU00000286/VFD/get",
        getQOS: "0",
        retainGetTopic: "false",
        deviceAttributes: "device_vfdReadingMode,device_vfdReadingStatus,device_vfdReadingFreq,device_vfdReadingScheduleStatus,device_vfdReadingScheduleOnTime,device_vfdReadingScheduleOffTime,device_vfdReadingSetTemp,device_vfdReadingH2OValve,device_vfdReadingWaterIn,device_vfdReadingWaterOut,device_vfdReadingFlowMin,device_vfdReadingRetAirtemp,device_vfdReadingPower,device_vfdReadingBtu,device_vfdReadingFilterLevel,device_vfdReadingVoltage,device_vfdReadingCurrent,device_vfdReadingRunningHrs,device_vfdReadingFireSignal,device_vfdReadingLogtime,device_vfdReadingVfdOnOffSource,device_vfdReadingHumidity,device_vfdAirQualityIndex,device_vfdParticleMatter1,device_vfdParticleMatter2p5,device_vfdParticleMatter10,device_vfdTotVolatileOrganicComp,device_vfdAirQualityIndexComp,device_vfdReadingSetCo2,device_vfdReadingCo2Level,device_vfdReadingFreshAirValve,device_vfdReadingSupplyAir,device_vfdReadingWaterPressure,device_vfdReadingMinFreq,device_vfdReadingMaxFreq,device_vfdReadingTPControl",
        subSystemName: "VFD-128"
      };

      // Convert payload to form-encoded format (this is what BMS API expects)
      const formData = qs.stringify(payload);

      console.log('Sending getCurrentStatus request to BMS with form-data payload:', formData);
      console.log('Using cookies:', cookies);

      const response = await axios.post(
        'https://bmsdev.chakranetwork.com:8080/bms/getHandler',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': `JSESSIONID=${cookies.JSESSIONID}; DWRSESSIONID=${cookies.DWRSESSIONID}`,
          },
        }
      );

      console.log('BMS API Response Status:', response.status);
      console.log('BMS API Response Content-Type:', response.headers['content-type']);
      console.log('BMS API Response Data Length:', response.data?.length || 0);
      console.log('BMS API Response Headers:', response.headers);
      console.log('BMS API Response Data:', response.data);

      // Try to parse the response to detect BMS-side errors
      let parsedData: any = null;
      let bmsStatus = 'Unknown';
      let bmsMessage = 'No message';
      let bmsStatusCode = 'Unknown';

      try {
        // The BMS API returns JSON directly, so we can parse it directly
        if (typeof response.data === 'string') {
          parsedData = JSON.parse(response.data);
        } else if (typeof response.data === 'object') {
          parsedData = response.data;
        }
        
        bmsStatus = parsedData.status || 'Unknown';
        bmsMessage = parsedData.message || 'No message';
        bmsStatusCode = parsedData.statusCode || 'Unknown';
      } catch (parseError) {
        console.log('Could not parse BMS response:', parseError.message);
        // If parsing fails, return the raw response
        parsedData = response.data;
      }

      // Check if BMS actually succeeded
      const isBmsSuccess = bmsStatus === 'Success' || bmsStatus === 'SUCCESS';
      
      console.log('Parsed BMS Response:', {
        bmsStatus,
        bmsMessage,
        bmsStatusCode,
        isBmsSuccess
      });

      // Return the response with detailed information
      return {
        status: response.status,
        data: parsedData || response.data,
        contentType: response.headers['content-type'],
        success: isBmsSuccess,
        message: isBmsSuccess ? 
          'Current status retrieved successfully!' : 
          `BMS Error: ${bmsMessage}`,
        bmsStatus,
        bmsMessage,
        bmsStatusCode
      };

    } catch (error) {
      console.error('Get current status failed:', error.response?.data || error.message);
      
      // If unauthorized, clear cookies
      if (error.response?.status === 401) {
        this.authService.clearCookies();
        throw new BadRequestException('Session expired. Please login again.');
      }
      
      throw new BadRequestException('Failed to get current status');
    }
  }

  async getVfdStats(payload: VfdStatsRequest): Promise<any> {
    try {
      // Get stored cookies
      const cookies = this.authService.getCookies();
      
      // Check if we have JSESSIONID (main session cookie)
      if (!cookies.JSESSIONID) {
        throw new BadRequestException('No active session. Please login first.');
      }

      // Construct cookie string (include all available cookies)
      let cookieHeader = `JSESSIONID=${cookies.JSESSIONID}`;
      if (cookies.DWRSESSIONID) {
        cookieHeader += `; DWRSESSIONID=${cookies.DWRSESSIONID}`;
      }

      console.log('Sending VFD stats request to BMS API:');
      console.log('URL:', 'https://bmsdev.chakranetwork.com:8080/bms/TableMgr');
      console.log('Payload:', JSON.stringify(payload, null, 2));
      console.log('Cookies:', cookieHeader);

      // Convert payload to form-encoded format (this is what BMS API expects)
      const formPayload = Object.entries(payload).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>);
      
      const formData = qs.stringify(formPayload);
      
      console.log('Form-encoded data:', formData);

      // Send request with form-encoded data (matching BMS API expectations)
      const response: AxiosResponse = await axios.post(
        'https://bmsdev.chakranetwork.com:8080/bms/TableMgr',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookieHeader,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
          }
        }
      );

      console.log('BMS API Response Status:', response.status);
      console.log('BMS API Response Content-Type:', response.headers['content-type']);
      console.log('BMS API Response Data Length:', response.data?.length || 0);
      console.log('BMS API Response Headers:', response.headers);
      console.log('BMS API Response Data:', response.data);

      // Try to parse the response to detect BMS-side errors
      let parsedData: any = null;
      let bmsStatus = 'Unknown';
      let bmsMessage = 'No message';
      let bmsStatusCode = 'Unknown';

      try {
        // The BMS API might return JSON embedded in HTML or plain JSON
        if (typeof response.data === 'string') {
          // Try to extract JSON from HTML response
          const jsonMatch = response.data.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[0]);
            bmsStatus = parsedData.status || 'Unknown';
            bmsMessage = parsedData.message || 'No message';
            bmsStatusCode = parsedData.statusCode || 'Unknown';
          }
        } else if (typeof response.data === 'object') {
          parsedData = response.data;
          bmsStatus = parsedData.status || 'Unknown';
          bmsMessage = parsedData.message || 'No message';
          bmsStatusCode = parsedData.statusCode || 'Unknown';
        }
      } catch (parseError) {
        console.log('Could not parse BMS response:', parseError.message);
      }

      // Check if BMS actually succeeded
      const isBmsSuccess = bmsStatus === 'Success' || bmsStatus === 'SUCCESS';
      
      console.log('Parsed BMS Response:', {
        bmsStatus,
        bmsMessage,
        bmsStatusCode,
        isBmsSuccess
      });

      // Return the response with detailed information
      return {
        status: response.status,
        data: parsedData || response.data,
        contentType: response.headers['content-type'],
        success: isBmsSuccess,
        message: isBmsSuccess ? 
          'VFD stats retrieved successfully!' : 
          `BMS Error: ${bmsMessage}`,
        bmsStatus,
        bmsMessage,
        bmsStatusCode
      };

    } catch (error) {
      console.error('Get VFD stats failed:', error.response?.data || error.message);
      
      // If unauthorized, clear cookies
      if (error.response?.status === 401) {
        this.authService.clearCookies();
        throw new BadRequestException('Session expired. Please login again.');
      }
      
      throw new BadRequestException('Failed to get VFD stats');
    }
  }

  async setScheduleStatus(scheduleStatusPayload: any) {
    try {
      // Get stored cookies
      const cookies = this.authService.getCookies();
      
      // Check if we have JSESSIONID (main session cookie)
      if (!cookies.JSESSIONID) {
        throw new BadRequestException('No active session. Please login first.');
      }

      // Construct cookie string (include all available cookies)
      let cookieHeader = `JSESSIONID=${cookies.JSESSIONID}`;
      if (cookies.DWRSESSIONID) {
        cookieHeader += `; DWRSESSIONID=${cookies.DWRSESSIONID}`;
      }

      console.log('Sending schedule status request to BMS API:');
      console.log('URL:', 'https://bmsdev.chakranetwork.com:8080/bms/setHandler');
      console.log('Payload:', JSON.stringify(scheduleStatusPayload, null, 2));
      console.log('Cookies:', cookieHeader);

      // Convert payload to form-encoded format (this is what BMS API expects)
      const formPayload = Object.entries(scheduleStatusPayload).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>);
      
      const formData = qs.stringify(formPayload);
      
      console.log('Form-encoded data:', formData);

      // Send request with form-encoded data (matching BMS API expectations)
      const response: AxiosResponse = await axios.post(
        'https://bmsdev.chakranetwork.com:8080/bms/setHandler',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookieHeader,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
          }
        }
      );

      console.log('BMS Schedule Status API Response Status:', response.status);
      console.log('BMS Schedule Status API Response Content-Type:', response.headers['content-type']);
      console.log('BMS Schedule Status API Response Data Length:', response.data?.length || 0);
      console.log('BMS Schedule Status API Response Headers:', response.headers);
      console.log('BMS Schedule Status API Response Data:', response.data);

      // Try to parse the response to detect BMS-side errors
      let parsedData: any = null;
      let bmsStatus = 'Unknown';
      let bmsMessage = 'No message';
      let bmsStatusCode = 'Unknown';

      try {
        // The BMS API might return JSON embedded in HTML or plain JSON
        if (typeof response.data === 'string') {
          // Try to extract JSON from HTML response
          const jsonMatch = response.data.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[0]);
            bmsStatus = parsedData.status || 'Unknown';
            bmsMessage = parsedData.message || 'No message';
            bmsStatusCode = parsedData.statusCode || 'Unknown';
          }
        } else if (typeof response.data === 'object') {
          parsedData = response.data;
          bmsStatus = parsedData.status || 'Unknown';
          bmsMessage = parsedData.message || 'No message';
          bmsStatusCode = parsedData.statusCode || 'Unknown';
        }
      } catch (parseError) {
        console.log('Could not parse BMS Schedule Status response:', parseError.message);
      }

      // Check if BMS actually succeeded
      const isBmsSuccess = bmsStatus === 'Success' || bmsStatus === 'SUCCESS';
      
      console.log('Parsed BMS Schedule Status Response:', {
        bmsStatus,
        bmsMessage,
        bmsStatusCode,
        isBmsSuccess
      });

      // Return the response with detailed information
      return {
        status: response.status,
        data: parsedData || response.data,
        contentType: response.headers['content-type'],
        success: isBmsSuccess,
        message: isBmsSuccess ? 
          'Schedule status updated successfully!' : 
          `BMS Error: ${bmsMessage}`,
        bmsStatus,
        bmsMessage,
        bmsStatusCode
      };

    } catch (error) {
      console.error('Set schedule status failed:', error.response?.data || error.message);
      
      // If unauthorized, clear cookies
      if (error.response?.status === 401) {
        this.authService.clearCookies();
        throw new BadRequestException('Session expired. Please login again.');
      }
      
      throw new BadRequestException('Failed to set schedule status');
    }
  }

  async setScheduleTime(scheduleTimePayload: any) {
    try {
      // Get stored cookies
      const cookies = this.authService.getCookies();
      
      // Check if we have JSESSIONID (main session cookie)
      if (!cookies.JSESSIONID) {
        throw new BadRequestException('No active session. Please login first.');
      }

      // Construct cookie string (include all available cookies)
      let cookieHeader = `JSESSIONID=${cookies.JSESSIONID}`;
      if (cookies.DWRSESSIONID) {
        cookieHeader += `; DWRSESSIONID=${cookies.DWRSESSIONID}`;
      }

      console.log('Sending schedule time request to BMS API:');
      console.log('URL:', 'https://bmsdev.chakranetwork.com:8080/bms/setHandler');
      console.log('Payload:', JSON.stringify(scheduleTimePayload, null, 2));
      console.log('Cookies:', cookieHeader);

      // Convert payload to form-encoded format (this is what BMS API expects)
      const formPayload = Object.entries(scheduleTimePayload).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>);
      
      const formData = qs.stringify(formPayload);
      
      console.log('Form-encoded data:', formData);

      // Send request with form-encoded data (matching BMS API expectations)
      const response: AxiosResponse = await axios.post(
        'https://bmsdev.chakranetwork.com:8080/bms/setHandler',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookieHeader,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
          }
        }
      );

      console.log('BMS Schedule Time API Response Status:', response.status);
      console.log('BMS Schedule Time API Response Content-Type:', response.headers['content-type']);
      console.log('BMS Schedule Time API Response Data Length:', response.data?.length || 0);
      console.log('BMS Schedule Time API Response Headers:', response.headers);
      console.log('BMS Schedule Time API Response Data:', response.data);

      // Try to parse the response to detect BMS-side errors
      let parsedData: any = null;
      let bmsStatus = 'Unknown';
      let bmsMessage = 'No message';
      let bmsStatusCode = 'Unknown';

      try {
        // The BMS API might return JSON embedded in HTML or plain JSON
        if (typeof response.data === 'string') {
          // Try to extract JSON from HTML response
          const jsonMatch = response.data.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[0]);
            bmsStatus = parsedData.status || 'Unknown';
            bmsMessage = parsedData.message || 'No message';
            bmsStatusCode = parsedData.statusCode || 'Unknown';
          }
        } else if (typeof response.data === 'object') {
          parsedData = response.data;
          bmsStatus = parsedData.status || 'Unknown';
          bmsMessage = parsedData.message || 'No message';
          bmsStatusCode = parsedData.statusCode || 'Unknown';
        }
      } catch (parseError) {
        console.log('Could not parse BMS Schedule Time response:', parseError.message);
      }

      // Check if BMS actually succeeded
      const isBmsSuccess = bmsStatus === 'Success' || bmsStatus === 'SUCCESS';
      
      console.log('Parsed BMS Schedule Time Response:', {
        bmsStatus,
        bmsMessage,
        bmsStatusCode,
        isBmsSuccess
      });

      // Return the response with detailed information
      return {
        status: response.status,
        data: parsedData || response.data,
        contentType: response.headers['content-type'],
        success: isBmsSuccess,
        message: isBmsSuccess ? 
          'Schedule time updated successfully!' : 
          `BMS Error: ${bmsMessage}`,
        bmsStatus,
        bmsMessage,
        bmsStatusCode
      };

    } catch (error) {
      console.error('Set schedule time failed:', error.response?.data || error.message);
      
      // If unauthorized, clear cookies
      if (error.response?.status === 401) {
        this.authService.clearCookies();
        throw new BadRequestException('Session expired. Please login again.');
      }
      
      throw new BadRequestException('Failed to set schedule time');
    }
  }
}