import { TaskStatus } from '../taskStatus.enum';
import { IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export class getTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
