import { Test, TestingModule } from '@nestjs/testing';
import { InsectImagesController } from './insect-images.controller';
import { InsectImagesService } from './insect-images.service';
import { JwtModule } from "@nestjs/jwt";
import { EnvironmentDetailsService } from "../environment-details/environment-details.service";

describe('InsectImagesController', () => {
  let controller: InsectImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      controllers: [InsectImagesController],
      providers: [
        {
          provide: InsectImagesService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InsectImagesController>(InsectImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
