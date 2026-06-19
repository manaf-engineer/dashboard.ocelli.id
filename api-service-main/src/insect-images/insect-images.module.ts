import { Module } from '@nestjs/common';
import { InsectImagesService } from './insect-images.service';
import { InsectImagesController } from './insect-images.controller';
import { MinioService } from '../minio/minio.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsectImage } from '../database/entities/insect-image.entity';
import { Tag } from '../database/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InsectImage, Tag])],
  controllers: [InsectImagesController],
  providers: [InsectImagesService, MinioService],
})
export class InsectImagesModule {}
