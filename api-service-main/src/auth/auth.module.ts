import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Role } from '../database/entities/role.entity';
import { CasbinModule } from '../casbin/casbin.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';
import { MailModule } from '../mail/mail.module';
import { ConfigService } from '@nestjs/config';
import { Casbin } from '../database/entities/casbin.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
        signOptions: { expiresIn: configService.get<number>('jwtExpire') },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Role, Casbin]),
    CasbinModule,
    RedisModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
