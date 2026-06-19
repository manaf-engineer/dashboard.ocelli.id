import { Module } from '@nestjs/common';
import { TrapNodesService } from './trap-nodes.service';
import { TrapNodesController } from './trap-nodes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrapNode } from '../database/entities/trap-node.entity';
import { MinioService } from '../minio/minio.services';

@Module({
  imports: [TypeOrmModule.forFeature([TrapNode])],
  controllers: [TrapNodesController],
  providers: [TrapNodesService, MinioService],
})
export class TrapNodesModule {}
