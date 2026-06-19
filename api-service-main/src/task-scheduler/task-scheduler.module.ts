import { Module } from '@nestjs/common';
import { TaskSchedulerService } from './task-scheduler.service';
import { TaskSchedulerController } from './task-scheduler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskScheduler } from '../database/entities/task-scheduler.entity';
import { TaskSchedulerMessage } from '../database/entities/task-scheduler-message.entity';
import { CasbinModule } from '../casbin/casbin.module';
import { EnvironmentDetail } from '../database/entities/environment-detail.entity';
import { CaptureResult } from '../database/entities/capture-result.entity';
import { TrapNode } from '../database/entities/trap-node.entity';
import { MinioService } from '../minio/minio.services';
import { ManualTask } from "../database/entities/manual-tasks.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskScheduler,
      TaskSchedulerMessage,
      EnvironmentDetail,
      CaptureResult,
      TrapNode,
      ManualTask,
    ]),
    CasbinModule,
  ],
  controllers: [TaskSchedulerController],
  providers: [TaskSchedulerService, MinioService],
})
export class TaskSchedulerModule {}
