import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnvConfig } from './env-config.service.interface';
@Injectable()
class EnvConfigService implements IEnvConfig {
  constructor(private configService: ConfigService) {}

  getDB_HOST(): string {
    return this.configService.get<string>('DB_HOST');
  }
  getDB_PORT(): number {
    return Number(this.configService.get<number>('DB_PORT'));
  }
  getDB_USERNAME(): string {
    return this.configService.get<string>('DB_USERNAME');
  }
  getDB_PASSWORD(): string {
    return this.configService.get<string>('DB_PASSWORD');
  }
  getDB_DATABASE(): string {
    return this.configService.get<string>('DB_DATABASE');
  }
  getJWT_SECRET(): string {
    return this.configService.get<string>('JWT_SECRET');
  }
}

export { EnvConfigService };
