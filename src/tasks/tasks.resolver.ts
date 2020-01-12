import { ParseIntPipe, Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user.entity';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { TaskStatus } from './taskStatus.enum';
import { GqlAuthGuard } from 'src/auth/GqlAuth.guard';

@Resolver('Tasks')
@UseGuards(GqlAuthGuard)
export class TasksResolver {
  private logger = new Logger('TasksResolver');
  constructor(private readonly tasksService: TasksService) {}

  @Query()
  async getTaskById(
    @Args('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    const task = await this.tasksService.getTaskById(id, user);
    if (!task) {
      throw new Error(`Task with Id:${id} could not be found`);
    }
    return task;
  }

  @Query()
  async getTasks(
    @Args('search') search: string,
    @Args('status') status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User ${user.username} retrieving all tasks with filter : ${search} & ${status})}`,
    );
    return this.tasksService.getAllTasks({ search, status }, user);
  }

  @Mutation()
  async createTask(
    @Args('title') title: string,
    @Args('description') description: string,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} creating a new task. Data : ${title} | ${description}`,
    );
    return this.tasksService.createTask({ title, description }, user);
  }

  @Mutation()
  async updateTaskStatus(
    @Args('id', ParseIntPipe) id: number,
    @Args('status') status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    const updatedTask = await this.tasksService.updateTaskStatus(
      id,
      status,
      user,
    );
    if (!updatedTask) {
      throw new Error(`Task with Id: ${id} does not exists!`);
    }
    return updatedTask;
  }

  @Mutation()
  async deleteTask(
    @Args('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Boolean> {
    const isDeleted = await this.tasksService.deleteTask(id, user);
    if (!isDeleted) {
      throw new Error(`Task with Id: ${id} does not exists!`);
    }
    return true;
  }
}
