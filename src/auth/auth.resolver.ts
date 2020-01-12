import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { ValidationPipe } from '@nestjs/common';
import { AccessToken } from 'src/graphql';
import { AuthCredentialsDto } from './AuthCredentials.dto';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation()
  async signUp(
    @Args('credentials', ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<Boolean> {
    try {
      await this.authService.signUp(authCredentialsDto);
      return true;
    } catch (error) {
      if (error?.code === '23505') throw new Error(`Username taken!`);
      throw new Error();
    }
  }

  @Mutation()
  async signIn(
    @Args('credentials', ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<AccessToken> {
    try {
      const accessToken = await this.authService.signIn(authCredentialsDto);
      return accessToken;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
