import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as querystring from 'querystring';
import { SetTempPayload, SetTempResponse } from '../common/types';

@Injectable()
export class ProxyService {
  private cookies: { JSESSIONID?: string; DWRSESSIONID?: string } = {};

  setCookies(cookies: { JSESSIONID?: string; DWRSESSIONID?: string }) {
    this.cookies = cookies;
  }

  async setTemperature(payload: SetTempPayload): Promise<SetTempResponse> {
    try {
      // Convert JSON payload to x-www-form-urlencoded
      const formData = querystring.stringify(payload);
      
      console.log('Sending request to BMS with payload:', formData);
      console.log('Using cookies:', this.cookies);

      const response = await axios.post(
        'https://bmsdev.chakranetwork.com:8080/bms/setHandler',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': `JSESSIONID=${this.cookies.JSESSIONID}; DWRSESSIONID=${this.cookies.DWRSESSIONID}`,
          },
        }
      );

      console.log('BMS Response:', response.data);

      // Parse the HTML response to extract JSON
      const htmlResponse = response.data;
      const jsonMatch = htmlResponse.match(/<script[^>]*>var\s+response\s*=\s*({.*?});<\/script>/s);
      
      if (jsonMatch) {
        try {
          const jsonResponse = JSON.parse(jsonMatch[1]);
          return {
            status: 'Success',
            message: 'Temperature set successfully',
            data: jsonResponse
          };
        } catch (parseError) {
          console.error('Failed to parse JSON from HTML:', parseError);
          return {
            status: 'Success',
            message: 'Temperature set successfully (HTML response)',
            data: { htmlResponse }
          };
        }
      }

      return {
        status: 'Success',
        message: 'Temperature set successfully',
        data: { response: response.data }
      };
    } catch (error) {
      console.error('Error setting temperature:', error);
      throw new Error(`Failed to set temperature: ${error.message}`);
    }
  }

  async getCurrentStatus(): Promise<any> {
    try {
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

      console.log('Sending getCurrentStatus request to BMS with payload:', payload);
      console.log('Using cookies:', this.cookies);

      const response = await axios.post(
        'https://bmsdev.chakranetwork.com:8080/bms/getHandler',
        payload,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': `JSESSIONID=${this.cookies.JSESSIONID}; DWRSESSIONID=${this.cookies.DWRSESSIONID}`,
          },
        }
      );

      console.log('BMS getCurrentStatus Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting current status:', error);
      throw new Error(`Failed to get current status: ${error.message}`);
    }
  }
}
