import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class authCredentialsDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Passwords should contain at least 1 upper case letter, 1 lower case letter
    and 1 number or special character`,
  })
  @ApiProperty()
  password: string;
}
