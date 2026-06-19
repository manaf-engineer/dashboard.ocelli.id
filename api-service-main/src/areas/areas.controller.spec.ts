import { Test, TestingModule } from '@nestjs/testing';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { QueryParamsDto } from '../common/dtos/query-params.dto';
import { Message } from '../common/message.enum';
import { ConfigService } from '@nestjs/config';

describe('AreasController', () => {
  let controller: AreasController;
  let service: AreasService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreasController],
      providers: [
        ConfigService,
        {
          provide: AreasService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AreasController>(AreasController);
    service = module.get<AreasService>(AreasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call AreasService.create with the correct parameters', async () => {
      const createAreaDto: CreateAreaDto = {
        area_id: 'area123',
        name: 'New Area',
        province: 'Province',
        regency: 'Regency',
        subdistrict: 'Subdistrict',
        created_by: 1,
      };

      const result = {
        data: {
          id: 1,
          area_id: 'area123',
          name: 'New Area',
          province: 'Province',
          regency: 'Regency',
          subdistrict: 'Subdistrict',
          created_by: 1,
          created_at: new Date(), // mock the creation date
          updated_by: null,
          updated_at: null,
        },
        code: 201,
        message: Message.CREATED,
      }; // Should match the structure of SingleDataResponseDto<AreaResponseDto>

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createAreaDto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(createAreaDto);
    });
  });

  describe('findAll', () => {
    it('should call AreasService.findAll with the correct parameters', async () => {
      const query: QueryParamsDto = { page: 1, limit: 10 };
      const result = {
        code: 201,
        message: Message.SUCCESS,
        data: {
          page: 1,
          limit: 10,
          total_items: 1,
          total_page: 1,
          items: [
            {
              id: 1,
              area_id: 'area123',
              name: 'New Area',
              province: 'Province',
              regency: 'Regency',
              subdistrict: 'Subdistrict',
              created_by: 1,
              created_at: new Date(), // mock the creation date
              updated_by: null,
              updated_at: null,
            },
          ],
        },
      }; // Should match the structure of PaginatedResponseDto<AreaResponseDto>

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(query)).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should call AreasService.findOne with the correct id', async () => {
      const id = '1';
      const result = {
        data: {
          id: 1,
          area_id: 'area123',
          name: 'New Area',
          province: 'Province',
          regency: 'Regency',
          subdistrict: 'Subdistrict',
          created_by: 1,
          created_at: new Date(), // mock the creation date
          updated_by: null,
          updated_at: null,
        },
        code: 200,
        message: Message.SUCCESS,
      }; // Should match the structure of SingleDataResponseDto<AreaResponseDto>

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(id)).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should call AreasService.update with the correct parameters', async () => {
      const id = '1';
      const updateAreaDto: UpdateAreaDto = { name: 'Updated Area' };
      const result = {
        data: {
          id: 1,
          area_id: 'area123',
          name: 'Updated Area',
          province: 'Province',
          regency: 'Regency',
          subdistrict: 'Subdistrict',
          created_by: 1,
          created_at: new Date(), // mock the creation date
        },
        code: 200,
        message: Message.SUCCESS,
      }; // Should match the structure of SingleDataResponseDto<AreaResponseDto>

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(id, updateAreaDto)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith(+id, updateAreaDto);
    });
  });

  describe('remove', () => {
    it('should call AreasService.remove with the correct id', async () => {
      const id = '1';
      const result = {
        data: null,
        code: 204,
        message: Message.NO_CONTENT,
      }; // Should match the structure of EmptyResponseDto

      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove(id)).toEqual(result);
      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });
});
