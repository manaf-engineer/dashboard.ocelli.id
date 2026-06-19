import { Module } from '@nestjs/common';
import { EnvironmentDetailsService } from './environment-details.service';
import { EnvironmentDetailsController } from './environment-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentDetail } from '../database/entities/environment-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EnvironmentDetail])],
  controllers: [EnvironmentDetailsController],
  providers: [EnvironmentDetailsService],
})
export class EnvironmentDetailsModule {}
