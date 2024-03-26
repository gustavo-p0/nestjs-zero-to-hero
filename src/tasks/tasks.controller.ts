import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@UseGuards(AuthGuard())
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.tasksService.create(createTaskDTO);
  }

  @Get()
  get(@Query() filterDTO: GetTasksFilterDTO): Promise<Task[]> {
    return this.tasksService.getTasks(filterDTO);
  }

  @Get('/:id')
  getById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getById(id);
  }

  @Delete('/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(id);
  }

  @Patch('/:id/status')
  update(
    @Param('id') id: string,
    @Body() status: UpdateTaskStatusDTO,
  ): Promise<Task> {
    return this.tasksService.update(id, status);
  }
}
