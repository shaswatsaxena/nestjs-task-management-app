import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { authCredentialsDto } from './dto/authCredentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async signUp(authCredentialsDto: authCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }
}
