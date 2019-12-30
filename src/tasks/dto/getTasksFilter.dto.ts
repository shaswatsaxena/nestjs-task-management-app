import { TaskStatus } from '../task.model';
import { IsOptional, IsIn, IsEnum, IsNotEmpty } from 'class-validator';

export class getTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
