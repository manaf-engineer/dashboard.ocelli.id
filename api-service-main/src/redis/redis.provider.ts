import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();

const configService = new ConfigService();

export type RedisClient = Redis;

export const redisProvider: Provider = {
  useFactory: (): RedisClient => {
    return new Redis({
      host: configService.get('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
      ...(configService.get('REDIS_PASSWORD') && {
        password: configService.get('REDIS_PASSWORD'),
      }),
    });
  },
  provide: 'REDIS_CLIENT',
};
