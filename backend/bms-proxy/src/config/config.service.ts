import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get bmsBaseUrl(): string {
    return 'https://bmsdev.chakranetwork.com:8080'; // Production BMS URL
  }

  get bmsUsername(): string {
    return 'crossbow';
  }

  get bmsPassword(): string {
    return 'crossbow@123';
  }

  get port(): number {
    return parseInt(process.env.PORT || '4000', 10);
  }

  get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }

  get jwtSecret(): string {
    return process.env.JWT_SECRET || 'default-jwt-secret-change-in-production';
  }

  get cookieSecret(): string {
    return process.env.COOKIE_SECRET || 'default-cookie-secret-change-in-production';
  }

  get logLevel(): string {
    return process.env.LOG_LEVEL || 'info';
  }

  isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  isProduction(): boolean {
    return this.nodeEnv === 'production';
  }
}
