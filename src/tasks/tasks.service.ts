import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TaskRepository) {}

  async create(createTaskDTO: CreateTaskDTO): Promise<Task> | never {
    return await this.tasksRepository.createTask(createTaskDTO);
  }

  async getTasks(filterDto: GetTasksFilterDTO): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  async getById(id: string): Promise<Task> | never {
    const found = await this.tasksRepository.findOneBy({ id });
    if (!found) throw new NotFoundException(`Task with ID ${id} not found`);

    return found;
  }

  async remove(id: string): Promise<void> | never {
    await this.tasksRepository.deleteTask(id);
  }

  async update(
    id: string,
    { status }: UpdateTaskStatusDTO,
  ): Promise<Task> | never {
    const toBeUpdated = await this.getById(id);
    toBeUpdated.status = status;
    await this.tasksRepository.save(toBeUpdated);
    return toBeUpdated;
  }
}
