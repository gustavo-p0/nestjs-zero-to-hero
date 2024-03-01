import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  save(createTaskDTO: CreateTaskDTO): Task {
    const newTask: Task = {
      id: uuidv4(),
      ...createTaskDTO,
      status: TaskStatus.OPEN,
    };
    this.tasks = [...this.tasks, newTask];
    return newTask;
  }

  getTasksWithFilters(filterDTO: GetTasksFilterDTO): Task[] {
    const { status, search } = filterDTO;
    //define a temporary array to hold the result
    let tasks = this.getAll();
    //do something with status
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    //do something with search
    if (search) {
      tasks = tasks.filter(
        ({ title, description }) =>
          title.toLowerCase().includes(search.toLowerCase()) ||
          description.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return tasks;
    //return final result
  }

  getAll(): Task[] {
    return this.tasks;
  }

  getById(id: string): Task | never {
    //try to get task
    //if found, return the found task
    //if not found, throw an error (404 not found)
    const found = this.tasks.find((item) => item.id === id) ?? null;
    if (found) return found;
    throw new NotFoundException(`Task with ID "${id}" not found`);
  }

  remove(id: string): void {
    this.getById(id);
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
  update(id: string, { status }: UpdateTaskStatusDTO): Task | never {
    const toBeUpdated = this.getById(id);
    if (toBeUpdated) {
      const updated = { ...toBeUpdated, status };
      this.tasks = this.tasks.map((task) => {
        return task.id === id ? updated : task;
      });
      return updated;
    }

    return null;
  }
}
