const axios = require('axios');

// Test Backend API endpoints
async function testBackendApi() {
  try {
    console.log('🚀 Testing Backend API endpoints...');
    
    // Test 1: Login
    console.log('\n📝 Testing Login...');
    const loginResponse = await axios.post('http://localhost:4000/api/login', {
      username: 'crossbow',
      password: 'your_password'
    });
    console.log('✅ Login Response:', loginResponse.data);
    
    // Test 2: Get Current Status
    console.log('\n📊 Testing Get Current Status...');
    const statusResponse = await axios.post('http://localhost:4000/api/get-current-status');
    console.log('✅ Status Response Status:', statusResponse.status);
    console.log('📊 Status Response Data:', JSON.stringify(statusResponse.data, null, 2));
    
    if (statusResponse.data.status === 'Success' && statusResponse.data.devicedata) {
      const deviceData = JSON.parse(statusResponse.data.devicedata).data;
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
    
    // Test 3: Set Temperature
    console.log('\n🌡️  Testing Set Temperature...');
    const setTempResponse = await axios.post('http://localhost:4000/api/set-temp', {
      device_vfdReadingSetTemp: 26.0,
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
      deviceAttributes: "device_vfdReadingMode,device_vfdReadingStatus,device_vfdReadingFreq,device_vfdReadingScheduleStatus,device_vfdReadingScheduleOnTime,device_vfdReadingScheduleOffTime,device_vfdReadingSetTemp,device_vfdReadingH2OValve,device_vfdReadingWaterIn,device_vfdReadingWaterOut,device_vfdReadingFlowMin,device_vfdReadingRetAirtemp,device_vfdReadingPower,device_vfdReadingBtu,device_vfdReadingFilterLevel,device_vfdReadingVoltage,device_vfdReadingCurrent,device_vfdReadingRunningHrs,device_vfdReadingFireSignal,device_vfdReadingLogtime,device_vfdReadingVfdOnOffSource,device_vfdReadingHumidity,device_vfdAirQualityIndex,device_vfdParticleMatter1,device_vfdParticleMatter2p5,device_vfdParticleMatter10,device_vfdTotVolatileOrganicComp,device_vfdAirQualityIndexComp,device_vfdReadingSetCo2,device_vfdReadingCo2Level,device_vfdReadingFreshAirValve,device_vfdReadingSupplyAir,device_vfdReadingWaterPressure,device_vfdReadingMinFreq,device_vfdReadingMaxFreq,device_vfdReadingTPControl",
      subSystemName: "VFD-128"
    });
    console.log('✅ Set Temperature Response:', setTempResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

// Run the test
testBackendApi();
