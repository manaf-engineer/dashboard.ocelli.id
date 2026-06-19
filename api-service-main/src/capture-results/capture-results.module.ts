import { Module } from '@nestjs/common';
import { CaptureResultsService } from './capture-results.service';
import { CaptureResultsController } from './capture-results.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaptureResult } from '../database/entities/capture-result.entity';
import { EnvironmentDetail } from '../database/entities/environment-detail.entity';
import { MinioService } from '../minio/minio.services';

@Module({
  imports: [TypeOrmModule.forFeature([CaptureResult, EnvironmentDetail])],
  controllers: [CaptureResultsController],
  providers: [CaptureResultsService, MinioService],
})
export class CaptureResultsModule {}
