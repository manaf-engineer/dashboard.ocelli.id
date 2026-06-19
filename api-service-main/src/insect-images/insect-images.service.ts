import { Injectable } from '@nestjs/common';
import { CreateInsectImageDto } from './dto/create-insect-image.dto';
import { UpdateInsectImageDto } from './dto/update-insect-image.dto';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import {
  generatePaginatedResponse,
  generateSingleDataResponse,
} from '../common/utils/general-response';
import { QueryParamsDto } from '../common/dtos/query-params.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MinioService } from '../minio/minio.services';
import { InsectImage } from '../database/entities/insect-image.entity';
import { Message } from '../common/message.enum';
import { Tag } from '../database/entities/tag.entity';
import * as crypto from 'crypto';
import { ResponseInsectImageDto } from './dto/response-insect-image.dto';
import { ConfigService } from '@nestjs/config';
import { ErrorException } from '../common/filters/error.exception';

@Injectable()
export class InsectImagesService {
  constructor(
    @InjectRepository(InsectImage)
    private readonly insectImageRepository: Repository<InsectImage>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
  ) {}

  async create(createInsectImageDto: CreateInsectImageDto) {
    const { insect_images, insect_id } = createInsectImageDto;

    // Create or retrieve tags
    for (const insectImageDto of insect_images) {
      const tags: Tag[] = [];
      const { tag_names, image } = insectImageDto;
      if (tag_names) {
        for (const tagName of tag_names) {
          let tag = await this.tagRepository.findOne({
            where: { name: tagName },
          });
          if (!tag) {
            // If tag doesn't exist, create it
            tag = this.tagRepository.create({ name: tagName });
            await this.tagRepository.save(tag);
          }
          tags.push(tag);
        }
      }

      // Save base64 image to minio
      const randomString = crypto.randomBytes(10).toString('hex');
      const [metadata] = image.split(',');
      const mimeType = metadata.split(':')[1].split(';')[0];
      const fileExtension = mimeType.split('/')[1];

      const imageFilename = `${randomString}.${fileExtension}`;
      const imageFullname = `insect_dataset/${insect_id}/${imageFilename}`;
      await this.minioService.uploadBase64Image(image, imageFullname);

      // Create the insect image
      const insectImage = this.insectImageRepository.create({
        image: imageFullname,
        insect_id: insect_id,
        tags: tags, // Associate the tags
      });

      await this.insectImageRepository.save(insectImage);
    }

    return generateSingleDataResponse(null); // You might want to return a DTO instead
  }

  async findAll(queryParams: QueryParamsDto) {
    const queryBuilder = this.insectImageRepository
      .createQueryBuilder('insectImage')
      .leftJoinAndSelect('insectImage.tags', 'tag');

    // Filter by tag name if provided
    if (queryParams.search) {
      queryBuilder.andWhere('tag.name ILIKE :tagName', {
        tagName: `%${queryParams.search}%`,
      });
    }

    // Filter by insect_id if provided
    if (queryParams.insect_id) {
      queryBuilder.andWhere('insectImage.insect_id = :insectId', {
        insectId: queryParams.insect_id,
      });
    }

    // Add sorting if specified
    const validSortDirections = ['ASC', 'DESC'] as const;
    let dirIndex = 0;
    if (queryParams.dir.toUpperCase() === 'DESC') {
      dirIndex = 1;
    }

    if (queryParams.sort_by) {
      queryBuilder.orderBy(
        `insectImage.${queryParams.sort_by}`,
        validSortDirections[dirIndex],
      );
    }

    // Pagination
    queryBuilder
      .take(queryParams.limit)
      .skip((queryParams.page - 1) * queryParams.limit);

    // Execute the query
    const [data, totalData] = await queryBuilder.getManyAndCount();

    // Map data to the response DTO
    const dataResponse: ResponseInsectImageDto[] = data.map(
      (insectImageEntity) => {
        const responseDto = plainToClass(
          ResponseInsectImageDto,
          insectImageEntity,
        );
        responseDto.image = this.imageToMinioUrl(insectImageEntity.image);
        return responseDto;
      },
    );

    return generatePaginatedResponse(
      dataResponse,
      totalData,
      queryParams.page,
      queryParams.limit,
    );
  }

  async findAllNoPagination(queryParams: QueryParamsDto) {
    const queryBuilder = this.insectImageRepository
      .createQueryBuilder('insectImage')
      .leftJoinAndSelect('insectImage.tags', 'tag');

    // Filter by insect_id if provided
    if (queryParams.insect_id) {
      queryBuilder.andWhere('insectImage.insect_id = :insectId', {
        insectId: queryParams.insect_id,
      });
    }

    const sort = 'ASC';
    queryBuilder.orderBy(`insectImage.id`, sort);
    const data = await queryBuilder.getMany();

    // Map data to the response DTO
    const dataResponse: ResponseInsectImageDto[] = data.map(
      (insectImageEntity) => {
        const responseDto = plainToClass(
          ResponseInsectImageDto,
          insectImageEntity,
        );
        responseDto.image = this.imageToMinioUrl(insectImageEntity.image);
        return responseDto;
      },
    );

    return generateSingleDataResponse(dataResponse);
  }

  async findOne(id: number) {
    const insectImage = await this.insectImageRepository.findOne({
      where: { id: id },
      relations: ['tags'], // Load tags relation
    });

    if (!insectImage) {
      throw new ErrorException(
        Message.NOT_FOUND,
        404,
        'insect image not found',
      );
    }

    const responseDto = plainToClass(ResponseInsectImageDto, insectImage);
    responseDto.image = this.imageToMinioUrl(insectImage.image);

    return generateSingleDataResponse(responseDto, 200, Message.SUCCESS);
  }

  async update(updateInsectImageDto: UpdateInsectImageDto) {
    const { insect_images } = updateInsectImageDto;
    for (const insectImageDto of insect_images) {
      const { id, image, tag_names } = insectImageDto;

      const insectImage = await this.insectImageRepository.findOne({
        where: { id },
        relations: ['tags'], // Load current tags
      });

      if (!insectImage) {
        throw new ErrorException(
          Message.NOT_FOUND,
          404,
          'insect image not found',
        );
      }

      // Update image URL if provided
      if (image) {
        // Save base64 image to minio
        const randomString = crypto.randomBytes(10).toString('hex');
        const [metadata] = image.split(',');
        const mimeType = metadata.split(':')[1].split(';')[0];
        const fileExtension = mimeType.split('/')[1];

        const imageFilename = `${randomString}.${fileExtension}`;
        const imageFullname = `insect_dataset/${updateInsectImageDto.insect_id}/${imageFilename}`;
        await this.minioService.uploadBase64Image(image, imageFullname);

        insectImage.image = imageFullname;
      }

      // Handle tags
      if (tag_names) {
        const newTags: Tag[] = [];

        // Create or retrieve new tags
        for (const tagName of tag_names) {
          let tag = await this.tagRepository.findOne({
            where: { name: tagName },
          });
          if (!tag) {
            tag = this.tagRepository.create({ name: tagName });
            await this.tagRepository.save(tag);
          }
          newTags.push(tag);
        }

        // Optionally, remove tags that are not in the new array
        const existingTagIds = insectImage.tags.map((tag) => tag.id);
        const newTagIds = newTags.map((tag) => tag.id);
        const tagsToRemove = existingTagIds.filter(
          (id) => !newTagIds.includes(id),
        );

        // Update the tags relationship
        insectImage.tags = newTags;

        if (tagsToRemove.length) {
          // Here you can remove the tags from the junction table
          await this.insectImageRepository
            .createQueryBuilder()
            .relation(InsectImage, 'tags')
            .of(insectImage)
            .remove(tagsToRemove);
        }
      }

      await this.insectImageRepository.save(insectImage);
    }

    // Save the updated insect image
    return generateSingleDataResponse(null);
  }

  async remove(id: number) {
    const insectImage = await this.insectImageRepository.findOneBy({ id: id });
    if (!insectImage) {
      throw new ErrorException(
        Message.NOT_FOUND,
        404,
        'insect image not found',
      );
    }

    // Delete Minio
    await this.minioService.deleteFile(insectImage.image);

    // Delete Database
    await this.insectImageRepository.delete(id);

    return generateSingleDataResponse(null, 204, Message.NO_CONTENT);
  }

  imageToMinioUrl(filename: string) {
    return `${this.configService.get<string>(
      'minioPublicUrl',
    )}/${this.configService.get<string>('minioBucketName')}/${filename}`;
  }
}
