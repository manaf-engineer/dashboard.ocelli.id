import { Test, TestingModule } from '@nestjs/testing';
import { InsectsController } from './insects.controller';
import { InsectsService } from './insects.service';
import { JwtModule } from "@nestjs/jwt";
import { TrapNodesService } from "../trap-nodes/trap-nodes.service";

describe('InsectsController', () => {
  let controller: InsectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      controllers: [InsectsController],
      providers: [
        {
          provide: InsectsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InsectsController>(InsectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
