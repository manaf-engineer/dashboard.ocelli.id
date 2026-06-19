import { Module } from '@nestjs/common';
import { InsectsService } from './insects.service';
import { InsectsController } from './insects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Insect } from '../database/entities/insect.entity';
import { InsectImage } from '../database/entities/insect-image.entity';
import { MinioService } from '../minio/minio.services';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Insect, InsectImage]),
    MulterModule.register({
      dest: '../../uploads',
    }),
  ],
  controllers: [InsectsController],
  providers: [InsectsService, MinioService],
})
export class InsectsModule {}
