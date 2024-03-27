import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfig } from 'src/@shared/env-config/env-config.module';
import { EnvConfigService } from 'src/@shared/env-config/env-config.service';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { envConfigValidationSchema } from '../@shared/env-config/env-config.schema';
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
    EnvConfig.forRoot({
      envFilePath: `.env.stage.${process.env.STAGE ?? 'development'}`,
      validationSchema: envConfigValidationSchema,
      isGlobal: true,
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [EnvConfig],
      inject: [EnvConfigService],
      useFactory: async (envConfigService: EnvConfigService) => ({
        type: 'postgres',
        host: envConfigService.getDB_HOST(),
        port: envConfigService.getDB_PORT(),
        username: envConfigService.getDB_USERNAME(),
        password: envConfigService.getDB_PASSWORD(),
        database: envConfigService.getDB_DATABASE(),
        autoLoadEntities: true,
        synchronize: true,
        entities: [Task, User],
      }),
    }),
    AuthModule,
  ],
})
export class AppModule {}
