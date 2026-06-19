import { Test, TestingModule } from '@nestjs/testing';
import { CaptureResultsService } from './capture-results.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Area } from '../database/entities/area.entity';
import { CaptureResult } from "../database/entities/capture-result.entity";
import { EnvironmentDetail } from "../database/entities/environment-detail.entity";
import { ConfigService } from "@nestjs/config";

describe('CaptureResultsService', () => {
  let service: CaptureResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        CaptureResultsService,
        {
          provide: getRepositoryToken(CaptureResult),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(EnvironmentDetail),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CaptureResultsService>(CaptureResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
