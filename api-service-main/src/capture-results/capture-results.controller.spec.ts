import { Test, TestingModule } from '@nestjs/testing';
import { CaptureResultsController } from './capture-results.controller';
import { CaptureResultsService } from './capture-results.service';
import { JwtModule } from '@nestjs/jwt';
import { AreasService } from '../areas/areas.service';
import { MinioService } from "../minio/minio.services";
import { ConfigService } from "@nestjs/config";

describe('CaptureResultsController', () => {
  let controller: CaptureResultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      controllers: [CaptureResultsController],
      providers: [
        ConfigService,
        {
          provide: CaptureResultsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: MinioService,
          useValue: {
            getImageStream: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CaptureResultsController>(CaptureResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
