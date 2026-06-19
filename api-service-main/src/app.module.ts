import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/configuration';
import { User } from './database/entities/user.entity';
import { Casbin } from './database/entities/casbin.entity';
import { TaskScheduler } from './database/entities/task-scheduler.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { IsUniqueConstraint } from './common/validators/is-unique';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { IsExistConstraint } from './common/validators/is-exist';
import { IsStartsWithSlashConstraint } from './common/validators/is-valid-url';
import { Feature } from './database/entities/feature.entity';
import { SubFeature } from './database/entities/sub-feature.entity';
import { Role } from './database/entities/role.entity';
import { Policy } from './database/entities/policy.entity';
import { TaskSchedulerMessage } from './database/entities/task-scheduler-message.entity';
import { CasbinModule } from './casbin/casbin.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskSchedulerModule } from './task-scheduler/task-scheduler.module';
import { Insect } from './database/entities/insect.entity';
import { InsectImage } from './database/entities/insect-image.entity';
import { Area } from './database/entities/area.entity';
import { TrapNode } from './database/entities/trap-node.entity';
import { EnvironmentDetail } from './database/entities/environment-detail.entity';
import { CaptureResult } from './database/entities/capture-result.entity';
import { TrapNodesModule } from './trap-nodes/trap-nodes.module';
import { CaptureResultsModule } from './capture-results/capture-results.module';
import { EnvironmentDetailsModule } from './environment-details/environment-details.module';
import { AreasModule } from './areas/areas.module';
import { InsectsModule } from './insects/insects.module';
import { InsectImagesModule } from './insect-images/insect-images.module';
import { Tag } from './database/entities/tag.entity';
import { ManualTask } from './database/entities/manual-tasks.entity';
import { HealthModule } from './health/health.module';
import { Endpoint } from './database/entities/endpoint.entity';
import { DevicesModule } from './devices/devices.module';
import { Device } from "./database/entities/device.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('dbHost'),
        port: +configService.get('dbPort'),
        username: configService.get('dbUser'),
        password: configService.get('dbPassword'),
        database: configService.get('dbName'),
        entities: [
          User,
          Casbin,
          Role,
          Feature,
          SubFeature,
          Policy,
          TaskScheduler,
          TaskSchedulerMessage,
          Insect,
          InsectImage,
          Area,
          TrapNode,
          EnvironmentDetail,
          CaptureResult,
          Tag,
          ManualTask,
          Endpoint,
          Device,
        ],
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    CasbinModule,
    TaskSchedulerModule,
    ScheduleModule.forRoot(),
    TrapNodesModule,
    CaptureResultsModule,
    EnvironmentDetailsModule,
    AreasModule,
    InsectsModule,
    InsectImagesModule,
    HealthModule,
    DevicesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    IsExistConstraint,
    IsUniqueConstraint,
    IsStartsWithSlashConstraint,
  ],
})
export class AppModule {}
