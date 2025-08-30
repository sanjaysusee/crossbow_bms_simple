export interface LoginCredentials {
  username: string;
  password: string;
}

export interface StoredCookies {
  JSESSIONID?: string;
  DWRSESSIONID?: string;
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

export interface LoginResponse {
  message: string;
  cookies: StoredCookies;
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
  servertime: string;
  status: string;
  statusCode: number;
  column: any[];
  issort: boolean;
  message: string;
  rows: VfdStatsData[];
  total: number;
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
