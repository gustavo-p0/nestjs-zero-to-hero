import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { TasksModule } from '../tasks/tasks.module';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'task_management',
      autoLoadEntities: true,
      synchronize: true,
      entities: [Task, User],
    }),
    AuthModule,
  ],
})
export class AppModule {}
