import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { authCredentialsDto } from './dto/authCredentials.dto';
import { accessTokenDto } from './dto/accessToken.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: authCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: authCredentialsDto,
  ): Promise<accessTokenDto> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    if (!username) {
      throw new Error('Invalid Credentials');
    }

    const payload = { username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
