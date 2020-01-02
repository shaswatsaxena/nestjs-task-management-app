import { IsString } from 'class-validator';
import { ApiResponseProperty } from '@nestjs/swagger';

export class accessTokenDto {
  @ApiResponseProperty()
  @IsString()
  accessToken: string;
}
