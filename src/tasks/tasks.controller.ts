import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // @Post()
  // create(@Body('title') title, @Body('description') description): Task {
  //   return this.tasksService.save(title, description);
  // }

  @Post()
  create(@Body() createTaskDTO: CreateTaskDTO): Task {
    return this.tasksService.save(createTaskDTO);
  }

  @Get()
  getTasks(@Query() filterDTO: GetTasksFilterDTO): Task[] {
    if (Object.keys(filterDTO).length) {
      return this.tasksService.getTasksWithFilters(filterDTO);
    }
    return this.tasksService.getAll();
  }

  @Get('/:id')
  getById(@Param('id') id: string): Task {
    return this.tasksService.getById(id);
  }

  @Delete('/:id')
  delete(@Param('id') id: string): void {
    this.tasksService.remove(id);
  }

  @Patch('/:id/status')
  update(@Param('id') id: string, @Body() status: UpdateTaskStatusDTO): Task {
    return this.tasksService.update(id, status);
  }
}
