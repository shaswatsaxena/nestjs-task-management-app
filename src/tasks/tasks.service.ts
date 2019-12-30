import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuidv4 from 'uuid/v4';
import { CreateTaskDto } from './dto/createTask.dto';
import { getTasksFilterDto } from './dto/getTasksFilter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter({ status, search }: getTasksFilterDto): Task[] {
    let tasks = this.tasks;
    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        task =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find(task => task.id === id);
  }

  createTask({ title, description }: CreateTaskDto): Task {
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      return null;
    }
    this.tasks[taskIndex].status = status;
    return this.tasks[taskIndex];
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }
}
