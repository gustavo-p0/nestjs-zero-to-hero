import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TasksModule } from '../tasks/tasks.module';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  imports: [TasksModule],
})
export class AppModule {}
