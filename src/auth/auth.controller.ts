import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { authCredentialsDto } from './dto/authCredentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: authCredentialsDto,
  ): Promise<void> {
    try {
      await this.authService.signUp(authCredentialsDto);
    } catch (error) {
      if (error?.code === '23505')
        throw new ConflictException(`Username taken!`);
      throw new InternalServerErrorException();
    }
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: authCredentialsDto,
  ): Promise<{ accessToken: string }> {
    try {
      const accessToken = await this.authService.signIn(authCredentialsDto);
      return accessToken;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
