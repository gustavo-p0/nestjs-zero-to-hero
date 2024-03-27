import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from '../../tasks/enums/task-status.enum';
import { TasksRepository } from '../../tasks/tasks.repository';
import { TasksService } from '../../tasks/tasks.service';

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: TasksRepository;

  const mockTasksRepository = () => ({
    getTasks: jest.fn().mockResolvedValue('someValue'),
    findOne: jest.fn(),
  });

  const mockUser = {
    username: 'Ariel',
    id: 'someId',
    password: 'somePassword',
    tasks: [],
  };

  beforeEach(async () => {
    //Initialize a NestJS module with tasksService and tasksRepository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and return the result', async () => {
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();
      //call taskService.getTasks, which should then call the repository's getTasks
      const result = await tasksService.getTasks(null, mockUser);
      expect(tasksRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    const mockTask = {
      title: 'Test',
      description: 'dec',
      id: 'id',
      status: TaskStatus.OPEN,
      user: mockUser,
    };
    it('calls TaksRepository.findOne and returns the result', async () => {
      jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(mockTask);
      const result = await tasksService.getById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls TaksRepository.findOne and handles the error', () => {
      jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(null);
      expect(tasksService.getById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
