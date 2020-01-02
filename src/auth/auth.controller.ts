import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { authCredentialsDto } from './dto/authCredentials.dto';
import { AuthService } from './auth.service';
import { type } from 'os';
import { accessTokenDto } from './dto/accessToken.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiCreatedResponse()
  @ApiConflictResponse({ description: `Username taken!` })
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
  @HttpCode(200)
  @ApiOkResponse({
    status: 200,
    type: accessTokenDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: authCredentialsDto,
  ): Promise<accessTokenDto> {
    try {
      const accessToken = await this.authService.signIn(authCredentialsDto);
      return accessToken;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
