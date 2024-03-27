import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfigService } from './env-config.service';

import { DynamicModule, Global } from '@nestjs/common';
import { ConfigModuleOptions } from '@nestjs/config';

@Global()
@Module({})
export class EnvConfig extends ConfigModule {
  static forRoot(options: ConfigModuleOptions): DynamicModule {
    return {
      module: EnvConfig,
      imports: [super.forRoot(options)],
      providers: [EnvConfigService],
      exports: [EnvConfigService],
    };
  }
}
