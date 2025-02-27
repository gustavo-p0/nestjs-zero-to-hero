import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

@UseGuards(AuthGuard())
@Controller('tasks')
export class TasksController {
  private logger = new Logger(TasksController.name, { timestamp: true });
  constructor(private tasksService: TasksService) {}

  @Post()
  create(
    @Body() createTaskDTO: CreateTaskDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} create a new task. Data ${JSON.stringify(createTaskDTO)}`,
    );
    return this.tasksService.create(createTaskDTO, user);
  }

  @Get()
  get(
    @Query() filterDTO: GetTasksFilterDTO,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrivieng all tasks. Filters: ${JSON.stringify(filterDTO)}`,
    );
    return this.tasksService.getTasks(filterDTO, user);
  }

  @Get('/:id')
  getById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getById(id, user);
  }

  @Delete('/:id')
  delete(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.remove(id, user);
  }

  @Patch('/:id/status')
  update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() status: UpdateTaskStatusDTO,
  ): Promise<Task> {
    return this.tasksService.update(id, user, status);
  }
}
