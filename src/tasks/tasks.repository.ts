import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { Task } from './entities/task.entity';
import { TaskStatus } from './enums/task-status.enum';
@Injectable()
export class TasksRepository extends Repository<Task> {
  private logger = new Logger(TasksRepository.name, { timestamp: true });
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
    const { status, search } = filterDTO;

    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDTO)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const taskToBeSaved = this.create({
      ...createTaskDTO,
      status: TaskStatus.OPEN,
      user,
    });

    const created = await this.save(taskToBeSaved);

    if (!created) throw new Error('Could not create an new task');
    return created;
  }

  async deleteTask(id: string, user: User): Promise<void> | never {
    const result = await this.delete({ id, user });
    if (result.affected < 1)
      throw new NotFoundException(`Task with ID ${id} not found.`);
  }
}
