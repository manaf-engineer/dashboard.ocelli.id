import { Test, TestingModule } from '@nestjs/testing';
import { TrapNodesService } from './trap-nodes.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../database/entities/role.entity';
import { TrapNode } from '../database/entities/trap-node.entity';
import { RedisService } from '../redis/redis.service';
import { MinioService } from '../minio/minio.services';

describe('TrapNodesService', () => {
  let service: TrapNodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        TrapNodesService,
        ConfigService,
        {
          provide: getRepositoryToken(TrapNode),
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

    service = module.get<TrapNodesService>(TrapNodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
