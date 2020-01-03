import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { TaskStatus } from './taskStatus.enum';
import { User } from 'src/auth/user.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiResponseProperty()
  id: number;

  @Column()
  @ApiResponseProperty()
  title: string;

  @Column()
  @ApiResponseProperty()
  description: string;

  @Column()
  @ApiResponseProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ManyToOne(
    type => User,
    user => user.tasks,
    { eager: false },
  )
  user: User;

  @Column()
  @ApiResponseProperty()
  userId: number;
}
