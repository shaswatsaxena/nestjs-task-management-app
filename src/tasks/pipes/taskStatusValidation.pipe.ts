import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../taskStatus.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  transform(value: string) {
    value = value.toUpperCase();
    if (!TaskStatus[value])
      throw new BadRequestException(`${value} is an invalid status.`);

    return value;
  }
}
