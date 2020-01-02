import { TaskStatus } from '../taskStatus.enum';
import { IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class getTasksFilterDto {
  @ApiProperty({ enum: TaskStatus, required: false })
  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
