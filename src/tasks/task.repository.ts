import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/createTask.dto';
import { TaskStatus } from './taskStatus.enum';
import { getTasksFilterDto } from './dto/getTasksFilter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks({ search, status }: getTasksFilterDto): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }
    return query.getMany();
  }

  async createTask({ title, description }: CreateTaskDto): Promise<Task> {
    const task: Task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();
    return task;
  }
}
