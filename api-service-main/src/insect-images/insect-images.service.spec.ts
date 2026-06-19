import { Test, TestingModule } from '@nestjs/testing';
import { InsectImagesService } from './insect-images.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Area } from '../database/entities/area.entity';
import { InsectImage } from '../database/entities/insect-image.entity';
import { Tag } from "../database/entities/tag.entity";
import { ConfigService } from "@nestjs/config";
import { Insect } from "../database/entities/insect.entity";
import { MinioService } from "../minio/minio.services";

describe('InsectImagesService', () => {
  let service: InsectImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsectImagesService,
        ConfigService,
        {
          provide: getRepositoryToken(InsectImage),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Tag),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Insect),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: MinioService,
          useValue: {
            uploadBase64Image: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InsectImagesService>(InsectImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
