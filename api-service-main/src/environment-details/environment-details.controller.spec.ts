import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentDetailsController } from './environment-details.controller';
import { EnvironmentDetailsService } from './environment-details.service';
import { JwtModule } from '@nestjs/jwt';
import { CaptureResultsService } from '../capture-results/capture-results.service';

describe('EnvironmentDetailsController', () => {
  let controller: EnvironmentDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      controllers: [EnvironmentDetailsController],
      providers: [
        {
          provide: EnvironmentDetailsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EnvironmentDetailsController>(
      EnvironmentDetailsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
