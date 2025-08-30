import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException, Get } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import type { SetTempPayload, AcControlPayload, VfdStatsRequest, ScheduleStatusPayload, ScheduleTimePayload } from '../common/types';

@Controller('api')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'BMS Proxy Service',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
  }

  @Post('set-temp')
  @HttpCode(HttpStatus.OK)
  async setTemperature(@Body() setTempDto: SetTempPayload) {
    try {
      const response = await this.proxyService.setTemperature(setTempDto);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('get-current-status')
  @HttpCode(HttpStatus.OK)
  async getCurrentStatus() {
    try {
      const response = await this.proxyService.getCurrentStatus();
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('control-ac')
  @HttpCode(HttpStatus.OK)
  async controlAc(@Body() acControlDto: AcControlPayload) {
    try {
      const response = await this.proxyService.controlAc(acControlDto);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('vfd-stats')
  @HttpCode(HttpStatus.OK)
  async getVfdStats(@Body() vfdStatsDto: VfdStatsRequest) {
    try {
      const response = await this.proxyService.getVfdStats(vfdStatsDto);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('set-schedule-status')
  @HttpCode(HttpStatus.OK)
  async setScheduleStatus(@Body() scheduleStatusDto: ScheduleStatusPayload) {
    try {
      const response = await this.proxyService.setScheduleStatus(scheduleStatusDto);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('set-schedule-time')
  @HttpCode(HttpStatus.OK)
  async setScheduleTime(@Body() scheduleTimeDto: ScheduleTimePayload) {
    try {
      const response = await this.proxyService.setScheduleTime(scheduleTimeDto);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
