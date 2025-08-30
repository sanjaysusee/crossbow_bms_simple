export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  cookies: {
    JSESSIONID?: string;
    DWRSESSIONID?: string;
  };
}

export interface SetTempPayload {
  device_vfdReadingSetTemp: number;
  requestType: string;
  subRequestType: string;
  username: string;
  operationDoneBy: string;
  neName: string;
  neVersion: string;
  neId: number;
  agentId: number;
  subSystemId: number;
  subSystem: string;
  operationName: string;
  operationType: string;
  operationId: number;
  uniqueId: string;
  managedObjectClass: string;
  managedObjectInstance: string;
  topic: string;
  setQOS: number;
  retainSetTopic: boolean;
  deviceAttributes: string;
  subSystemName: string;
}

export interface AcControlPayload {
  device_vfdReadingStatus: number;
  device_vfdReadingFreq?: number; // Optional, only needed when turning ON
  requestType: string;
  subRequestType: string;
  username: string;
  operationDoneBy: string;
  neName: string;
  neVersion: string;
  neId: number;
  agentId: number;
  subSystemId: number;
  subSystem: string;
  operationName: string;
  operationType: string;
  operationId: number;
  uniqueId: string;
  managedObjectClass: string;
  managedObjectInstance: string;
  topic: string;
  setQOS: number;
  retainSetTopic: boolean;
  deviceAttributes: string;
  subSystemName: string;
}

export interface SetTempResponse {
  status: number;
  data: any;
  contentType: string;
  success: boolean;
  message: string;
}

export interface BmsDeviceData {
  vfdReadingRetAirtemp: string;
  vfdReadingStatus: string;
  vfdReadingFreq: string;
  vfdReadingSetTemp: string;
  vfdReadingPower: string;
  vfdReadingLogtime: string;
  vfdReadingMode: string;
  vfdReadingHumidity: string;
  vfdReadingBtu: string;
  vfdReadingVoltage: string;
  vfdReadingCurrent: string;
  vfdReadingRunningHrs: string;
  vfdReadingWaterIn: string;
  vfdReadingWaterOut: string;
  vfdReadingSupplyAir: string;
  vfdReadingCo2Level: string;
  vfdAirQualityIndex: string;
  vfdReadingScheduleStatus: string;
  vfdReadingScheduleOnTime: string;
  vfdReadingScheduleOffTime: string;
}

export interface BmsApiResponse {
  servertime: string;
  status: string;
  statusCode: number;
  message: string;
  issort: boolean;
  devicedata: string;
}

export interface BmsCurrentStatus {
  temperature: number;
  acStatus: boolean;
  frequency: number;
  power: number;
  mode: string;
  lastUpdated: string;
  setTemperature: number;
  humidity: number;
  btu: number;
  voltage: number;
  current: number;
  runningHours: number;
  waterIn: number;
  waterOut: number;
  supplyAir: number;
  co2Level: number;
  airQualityIndex: number;
  scheduleStatus: boolean;
  scheduleOnTime: string;
  scheduleOffTime: string;
}

export interface VfdStatsData {
  vfdrecordid: number;
  vfdpolledtimestamp: string;
  vfdbtu: number;
  currvfdbtu: number;
  vfdaqi: number;
  vfdco2level: number;
  vfdcorbonmonoxide: number;
  vfdcurrent: number;
  vfdfilterstatus: number;
  vfdfiresignal: number;
  vfdflowmetertype: number;
  vfdflowspan: string;
  vfdfrequency: number;
  vfdfreshairvalve: number;
  vfdhumidity: number;
  vfdinletthreshold: number;
  vfdlogtime: string;
  vfdmaxflowrateset: number;
  vfdmaxfrequency: number;
  vfdminfrequency: number;
  vfdmode: number;
  vfdonoffsource: number;
  vfdparticlematter1: number;
  vfdparticlematter2: number;
  vfdparticlematter3: number;
  vfdpidconstant: number;
  vfdpower: number;
  vfdreturnair: number;
  vfdrunninghrs: number;
  vfdscheduleofftime: string;
  vfdscheduleontime: string;
  vfdschedulestatus: number;
  vfdsetco2: number;
  vfdsettemp: number;
  vfdstatus: number;
  vfdsupplyair: number;
  vfdtotalvav: number;
  vfdtpcontrol: number;
  vfdtvoc: number;
  vfdtype: number;
  vfdvoltage: number;
  vfdwateractuatordir: number;
  vfdwaterdeltatset: number;
  vfdwaterflow: number;
  vfdwaterin: number;
  vfdwaterout: number;
  vfdwaterpressure: number;
  vfdwatervalveposition: number;
}

export interface VfdStatsResponse {
  status: number;
  data: {
    servertime: string;
    status: string;
    statusCode: number;
    column: any[];
    issort: boolean;
    message: string;
    rows: VfdStatsData[];
    total: number;
  };
  contentType: string;
  success: boolean;
  message: string;
  bmsStatus: string;
  bmsMessage: string;
  bmsStatusCode: string;
}

export interface VfdStatsRequest {
  operationDoneBy: string;
  requestType: string;
  subRequestType: string;
  QueryNum: number;
  key: string;
  Parm1: number;
  Parm2: number;
  Parm3: string;
  Parm4: string;
}

export interface ScheduleStatusPayload {
  device_vfdReadingFreq?: number; // Optional since it's not always needed
  device_vfdReadingScheduleStatus: number;
  requestType: string;
  subRequestType: string;
  username: string;
  operationDoneBy: string;
  neName: string;
  neVersion: string;
  neId: number;
  agentId: number;
  subSystemId: number;
  subSystem: string;
  operationName: string;
  operationType: string;
  operationId: number;
  uniqueId: string;
  managedObjectClass: string;
  managedObjectInstance: string;
  topic: string;
  setQOS: number;
  retainSetTopic: boolean;
  deviceAttributes: string;
  subSystemName: string;
}

export interface ScheduleStatusResponse {
  status: number;
  data: any;
  contentType: string;
  success: boolean;
  message: string;
  bmsStatus: string;
  bmsMessage: string;
  bmsStatusCode: string;
}

export interface ScheduleTimePayload {
  device_vfdReadingScheduleStatus: number;
  device_vfdReadingScheduleOnTime: string;
  device_vfdReadingScheduleOffTime: string;
  requestType: string;
  subRequestType: string;
  username: string;
  operationDoneBy: string;
  neName: string;
  neVersion: string;
  neId: number;
  agentId: number;
  subSystemId: number;
  subSystem: string;
  operationName: string;
  operationType: string;
  operationId: number;
  uniqueId: string;
  managedObjectClass: string;
  managedObjectInstance: string;
  topic: string;
  setQOS: number;
  retainSetTopic: boolean;
  deviceAttributes: string;
  subSystemName: string;
}

export interface ScheduleTimeResponse {
  status: number;
  data: any;
  contentType: string;
  success: boolean;
  message: string;
  bmsStatus: string;
  bmsMessage: string;
  bmsStatusCode: string;
}

export interface RealTimeData {
  currentStatus: BmsCurrentStatus;
  timestamp: string;
  isOnline: boolean;
}

export interface ProxyResponse {
  status: number;
  data: string; // The actual BMS API response, as a string
  contentType: string;
  success: boolean;
  message: string;
}
