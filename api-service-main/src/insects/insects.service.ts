import { Injectable } from '@nestjs/common';
import { CreateInsectDto } from './dto/create-insect.dto';
import { UpdateInsectDto } from './dto/update-insect.dto';
import { QueryParamsDto } from '../common/dtos/query-params.dto';
import { ILike, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import {
  generatePaginatedResponse,
  generateSingleDataResponse,
} from '../common/utils/general-response';
import { Insect } from '../database/entities/insect.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InsectResponseDto } from './dto/response-insect.dto';
import { ResponseInsectImageDto } from '../insect-images/dto/response-insect-image.dto';
import { Message } from '../common/message.enum';
import { ConfigService } from '@nestjs/config';
import { MinioService } from '../minio/minio.services';
import { ErrorException } from '../common/filters/error.exception';

@Injectable()
export class InsectsService {
  constructor(
    @InjectRepository(Insect)
    private readonly insectsRepository: Repository<Insect>,
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
  ) {}

  async create(createInsectDto: CreateInsectDto) {
    // create insect
    const insect = this.insectsRepository.create(createInsectDto);
    const savedInsect = await this.insectsRepository.save(insect);
    const insectResponseDto = plainToInstance(InsectResponseDto, savedInsect);
    return generateSingleDataResponse(insectResponseDto);
  }

  async findAll(queryParams: QueryParamsDto) {
    const where: any = {};
    if (queryParams.search) {
      where.common_name = ILike(`%${queryParams.search}%`);
    }

    const [data, totalData] = await this.insectsRepository.findAndCount({
      where,
      relations: ['insect_images'],
      order: {
        [queryParams.sort_by]: queryParams.dir.toUpperCase(),
      },
      take: queryParams.limit,
      skip: (queryParams.page - 1) * queryParams.limit,
    });

    // Sample plain object (from database or API response)
    const dataResponse: InsectResponseDto[] = data.map((insectEntity) => {
      const insectResponseDto = plainToInstance(
        InsectResponseDto,
        insectEntity,
      );
      insectResponseDto.insect_images = insectEntity.insect_images
        .slice(0, 1)
        .map((insectImageEntity) => {
          const responseInsectImageDto = plainToInstance(
            ResponseInsectImageDto,
            insectImageEntity,
          );
          responseInsectImageDto.image = `${this.configService.get<string>(
            'minioPublicUrl',
          )}/${this.configService.get<string>('minioBucketName')}/${
            insectImageEntity.image
          }`;

          return responseInsectImageDto;
        });
      return insectResponseDto;
    });

    return generatePaginatedResponse(
      dataResponse,
      totalData,
      queryParams.page,
      queryParams.limit,
    );
  }

  async findOne(id: number) {
    const insectEntity = await this.insectsRepository.findOne({
      where: { id: id },
    });

    if (!insectEntity) {
      throw new ErrorException(Message.NOT_FOUND, 404, 'insect not found');
    }

    return generateSingleDataResponse(
      plainToInstance(InsectResponseDto, insectEntity),
    );
  }

  async update(id: number, updateInsectDto: UpdateInsectDto) {
    await this.insectsRepository.update(id, updateInsectDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    // Delete Insect
    const result = await this.insectsRepository.delete(id);
    if (result.affected === 0) {
      throw new ErrorException(Message.NOT_FOUND, 404, 'insect not found');
    }

    // Delete minio
    await this.minioService.deleteFolder(`insect_dataset/${id}`);
    return generateSingleDataResponse(null, 204, Message.NO_CONTENT);
  }

  async upload(insects): Promise<any> {
    const createPromises = insects.map(async (data) => {
      console.log(data);
      const insect = await this.insectsRepository.findOneBy({
        scientific_name: data.scientific_name,
      });
      if (!insect) {
        await this.insectsRepository.save(data);
      } else {
        await this.insectsRepository.update(insect.id, data);
      }
    });

    await Promise.all(createPromises);
    return generateSingleDataResponse(null);
  }
}
