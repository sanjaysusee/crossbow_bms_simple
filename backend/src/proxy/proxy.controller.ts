import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { SetTempPayload, SetTempResponse } from '../../common/types';

@Controller('api')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post('set-temp')
  @HttpCode(HttpStatus.OK)
  async setTemperature(@Body() payload: SetTempPayload): Promise<SetTempResponse> {
    try {
      return await this.proxyService.setTemperature(payload);
    } catch (error) {
      throw new BadRequestException(`Failed to set temperature: ${error.message}`);
    }
  }

  @Post('get-current-status')
  @HttpCode(HttpStatus.OK)
  async getCurrentStatus(): Promise<any> {
    try {
      return await this.proxyService.getCurrentStatus();
    } catch (error) {
      throw new BadRequestException(`Failed to get current status: ${error.message}`);
    }
  }
}
