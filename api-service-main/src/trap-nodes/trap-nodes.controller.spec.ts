import { Test, TestingModule } from '@nestjs/testing';
import { TrapNodesController } from './trap-nodes.controller';
import { TrapNodesService } from './trap-nodes.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTrapNodeDto } from './dto/create-trap-node.dto';
import { UpdateTrapNodeDto } from './dto/update-trap-node.dto';
import { QueryParamsDto } from '../common/dtos/query-params.dto';
import { generateSingleDataResponse } from '../common/utils/general-response';
import { Message } from '../common/message.enum';
import { AreaResponseDto } from '../areas/dto/response-area.dto';

describe('TrapNodesController', () => {
  let controller: TrapNodesController;
  let trapNodesService: TrapNodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrapNodesController],
      providers: [
        {
          provide: TrapNodesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findAllNoPagination: jest.fn(),
            summary: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TrapNodesController>(TrapNodesController);
    trapNodesService = module.get<TrapNodesService>(TrapNodesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a trap node', async () => {
      const createTrapNodeDto: CreateTrapNodeDto = {
        trap_id: 'trap_id_123',
        name: 'Test Node',
        latitude: '51.5074',
        longitude: '-0.1278',
        status: true,
        area_id: 1,
        created_by: 1,
      };
      const result = { id: 1, ...createTrapNodeDto };
      jest.spyOn(trapNodesService, 'create').mockResolvedValue(result);

      expect(await controller.create(createTrapNodeDto)).toBe(result);
    });
  });
});
