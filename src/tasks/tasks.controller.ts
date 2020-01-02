import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { TaskStatus } from './taskStatus.enum';
import { CreateTaskDto } from './dto/createTask.dto';
import { getTasksFilterDto } from './dto/getTasksFilter.dto';
import { TaskStatusValidationPipe } from './pipes/taskStatusValidation.pipe';
import { Task } from './task.entity';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user.entity';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiResponse({ type: [Task] })
  async getTasks(
    @Query(ValidationPipe) filterDto: getTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User ${
        user.username
      } retrieving all tasks with filter : ${JSON.stringify(filterDto)}`,
    );
    return this.tasksService.getAllTasks(filterDto, user);
  }

  @Get(':id')
  @ApiResponse({ type: Task })
  async getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    const task = await this.tasksService.getTaskById(id, user);
    if (!task) {
      throw new NotFoundException(`Task with Id:${id} could not be found`);
    }
    return task;
  }

  @Post()
  @ApiResponse({ type: Task })
  @UsePipes(ValidationPipe)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} creating a new task. Data : ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch(':id/status')
  @ApiResponse({ status: 200, type: Task })
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    const updatedTask = await this.tasksService.updateTaskStatus(
      id,
      status,
      user,
    );
    if (!updatedTask) {
      throw new NotFoundException(`Task with Id: ${id} does not exists!`);
    }
    return updatedTask;
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'Task with Id: {id} does not exists!' })
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    const isDeleted = await this.tasksService.deleteTask(id, user);
    if (!isDeleted) {
      throw new NotFoundException(`Task with Id: ${id} does not exists!`);
    }
  }
}
