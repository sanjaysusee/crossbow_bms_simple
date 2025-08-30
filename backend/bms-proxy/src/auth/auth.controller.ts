import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginCredentials, LoginResponse } from '../common/types';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginCredentials): Promise<LoginResponse> {
    try {
      const cookies = await this.authService.login(loginDto);
      return { message: 'Login successful', cookies };
    } catch (error) {
      throw error;
    }
  }
}
