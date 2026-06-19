import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Casbin } from '../database/entities/casbin.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtMiddleware } from '../middlewares/jwt.middleware';
import { CasbinMiddleware } from '../middlewares/casbin.middleware';
import { Role } from '../database/entities/role.entity';
import { Feature } from '../database/entities/feature.entity';
import { SubFeature } from '../database/entities/sub-feature.entity';
import { Policy } from '../database/entities/policy.entity';
import { CasbinModule } from '../casbin/casbin.module';
import { RedisModule } from '../redis/redis.module';
import { MinioService } from '../minio/minio.services';
import { RolesService } from '../roles/roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Casbin, Role, Feature, SubFeature, Policy]),
    CasbinModule,
    RedisModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, MinioService, RolesService],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the JwtMiddleware to all routes in the UsersModule
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: '', method: RequestMethod.GET },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/logout', method: RequestMethod.POST },
        { path: 'auth/forget-password', method: RequestMethod.POST },
        { path: 'auth/reset-password', method: RequestMethod.POST },
        { path: 'health', method: RequestMethod.GET },
      )
      .forRoutes('*');

    // Apply the CasbinMiddleware to all routes in the UsersModule
    consumer
      .apply(CasbinMiddleware)
      .exclude(
        { path: '', method: RequestMethod.GET },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/logout', method: RequestMethod.POST },
        { path: 'auth/forget-password', method: RequestMethod.POST },
        { path: 'auth/reset-password', method: RequestMethod.POST },
        { path: 'health', method: RequestMethod.GET },
        { path: 'me', method: RequestMethod.GET },
        { path: 'update-profile', method: RequestMethod.PUT },
      )
      .forRoutes('*');
  }
}
