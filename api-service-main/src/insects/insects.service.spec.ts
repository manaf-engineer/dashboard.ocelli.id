import { Test, TestingModule } from '@nestjs/testing';
import { InsectsService } from './insects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Area } from '../database/entities/area.entity';
import { Insect } from '../database/entities/insect.entity';
import { ConfigService } from '@nestjs/config';
import { MinioService } from '../minio/minio.services';

describe('InsectsService', () => {
  let service: InsectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsectsService,
        ConfigService,
        {
          provide: getRepositoryToken(Insect),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: MinioService,
          useValue: {
            deleteFolder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InsectsService>(InsectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
