import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task } from './entities/task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  async create(
    createTaskDTO: CreateTaskDTO,
    user: User,
  ): Promise<Task> | never {
    return await this.tasksRepository.createTask(createTaskDTO, user);
  }

  async getTasks(filterDto: GetTasksFilterDTO, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getById(id: string, user: User): Promise<Task> | never {
    const found = await this.tasksRepository.findOne({ where: { id, user } });
    if (!found) throw new NotFoundException(`Task with ID ${id} not found`);

    return found;
  }

  async remove(id: string, user: User): Promise<void> | never {
    await this.tasksRepository.deleteTask(id, user);
  }

  async update(
    id: string,
    user: User,
    { status }: UpdateTaskStatusDTO,
  ): Promise<Task> | never {
    const toBeUpdated = await this.getById(id, user);
    toBeUpdated.status = status;
    await this.tasksRepository.save(toBeUpdated);
    return toBeUpdated;
  }
}
