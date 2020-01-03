import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { getTasksFilterDto } from './dto/getTasksFilter.dto';
import { TaskStatus } from './taskStatus.enum';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  delete: jest.fn(),
});

const mockUser = {
  id: 12,
  username: 'Test user',
};

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters: getTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search query',
      };
      const result = await tasksService.getAllTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls tasksRepository.findOne() and successfully retrieves and returns the task', async () => {
      const mockTask = {
        title: 'Test task',
        description: 'Lorem Ipsum',
      };
      taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);
      expect(taskRepository.findOne).toBeCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });

    it('returns null is a task is not found', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(null);
      expect(taskRepository.findOne).toBeCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });
  });

  describe('createTask', () => {
    it('calls tasksRepository.createTask() and successfully creates and returns the task', async () => {
      const mockTask = {
        id: 1,
        title: 'Test task',
        description: 'Lorem Ipsum',
        userId: mockUser.id,
      };
      taskRepository.createTask.mockResolvedValue(mockTask);
      const result = await tasksService.createTask(
        { title: mockTask.title, description: mockTask.description },
        mockUser,
      );
      expect(result).toEqual(mockTask);
      expect(taskRepository.createTask).toBeCalledWith(
        {
          title: mockTask.title,
          description: mockTask.description,
        },
        mockUser,
      );
    });
  });

  describe('deleteTask', () => {
    it('calls tasksRepository.delete() and successfully deletes the task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await tasksService.deleteTask(1, mockUser);
      expect(result).toEqual(1);
      expect(taskRepository.delete).toBeCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('returns 0 if task could not be found.', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      const result = await tasksService.deleteTask(1, mockUser);
      expect(result).toEqual(0);
    });
  });

  describe('updateTask', () => {
    const mockTask = {
      status: TaskStatus.IN_PROGRESS,
      title: 'Test task',
      description: 'Lorem Ipsum',
      save: jest.fn().mockResolvedValue(true),
    };

    it('updates a task status', async () => {
      taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.updateTaskStatus(
        1,
        TaskStatus.DONE,
        mockUser,
      );
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
      expect(mockTask.save).toHaveBeenCalled();
      expect(result).toEqual({ ...mockTask, status: TaskStatus.DONE });
    });

    it('updates a task status', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      const result = await tasksService.updateTaskStatus(
        1,
        TaskStatus.DONE,
        mockUser,
      );
      expect(mockTask.save).not.toHaveBeenCalledTimes(2);
      expect(result).toEqual(null);
    });
  });
});
