import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentDetailsService } from './environment-details.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { EnvironmentDetail } from '../database/entities/environment-detail.entity';

describe('EnvironmentDetailsService', () => {
  let service: EnvironmentDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [
        EnvironmentDetailsService,
        {
          provide: getRepositoryToken(EnvironmentDetail),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EnvironmentDetailsService>(EnvironmentDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
