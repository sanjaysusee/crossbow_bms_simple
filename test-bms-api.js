const axios = require('axios');

// Test BMS GetHandler API
async function testBmsApi() {
  try {
    console.log('🚀 Testing BMS GetHandler API...');
    
    const payload = new URLSearchParams({
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
    });

    console.log('📤 Payload:', payload.toString());
    
    const response = await axios.post('https://bmsdev.chakranetwork.com:8080/bms/getHandler', payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'text/plain, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    console.log('✅ Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.status === 'Success' && response.data.devicedata) {
      const deviceData = JSON.parse(response.data.devicedata).data;
      if (deviceData && deviceData.length > 0) {
        const data = deviceData[0];
        console.log('🌡️  Current Temperature:', data.vfdReadingRetAirtemp + '°C');
        console.log('🎯 Set Temperature:', data.vfdReadingSetTemp + '°C');
        console.log('❄️  AC Status:', data.vfdReadingStatus === '1' ? 'ON' : 'OFF');
        console.log('⚡ Power:', data.vfdReadingPower + 'W');
        console.log('💧 Humidity:', data.vfdReadingHumidity + '%');
        console.log('🕐 Last Updated:', data.vfdReadingLogtime);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

// Run the test
testBmsApi();
