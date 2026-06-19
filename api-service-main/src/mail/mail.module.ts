import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule,
    ConfigModule,
    BullModule.registerQueueAsync({
      inject: [ConfigService],
      name: 'mail-queue',
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('redisHost'),
          port: configService.get<number>('redisPort'),
          ...(configService.get('redisPassword') && {
            password: configService.get('redisPassword'),
          }),
        },
        prefix: '{mail-queue}',
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('smtpHost'),
          port: configService.get('smtpPort'),
          auth: {
            user: configService.get('smtpUsername'),
            pass: configService.get('smtpPassword'),
          },
        },
      }),
    }),
  ],
  providers: [MailProcessor, MailService],
  exports: [MailService],
})
export class MailModule {}
