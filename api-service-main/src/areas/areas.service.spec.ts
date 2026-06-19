import { Test, TestingModule } from '@nestjs/testing';
import { AreasService } from './areas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Area } from '../database/entities/area.entity';
import { Repository } from 'typeorm';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { QueryParamsDto } from '../common/dtos/query-params.dto';
import { AreaResponseDto } from './dto/response-area.dto';
import { ErrorException } from '../common/filters/error.exception';
import { Message } from '../common/message.enum';
import {
  generatePaginatedResponse,
  generateSingleDataResponse,
} from '../common/utils/general-response';
import { plainToClass } from 'class-transformer';

describe('AreasService', () => {
  let service: AreasService;
  let repo: Repository<Area>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AreasService,
        {
          provide: getRepositoryToken(Area),
          useClass: Repository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AreasService>(AreasService);
    repo = module.get<Repository<Area>>(getRepositoryToken(Area));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an area', async () => {
      const createAreaDto: CreateAreaDto = {
        area_id: 'test-area-id',
        name: 'Test Area',
        province: 'Test Province',
        regency: 'Test Regency',
        subdistrict: 'Test Subdistrict',
        created_by: 1,
      };

      const savedArea = plainToClass(Area, createAreaDto);
      jest.spyOn(repo, 'create').mockReturnValue(savedArea);
      jest.spyOn(repo, 'save').mockResolvedValue(savedArea);

      const result = await service.create(createAreaDto);

      expect(result).toEqual(
        generateSingleDataResponse(
          plainToClass(AreaResponseDto, savedArea),
          201,
          Message.CREATED,
        ),
      );
      expect(repo.create).toHaveBeenCalledWith(createAreaDto);
      expect(repo.save).toHaveBeenCalledWith(savedArea);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of areas', async () => {
      const queryParams: QueryParamsDto = {
        page: 1,
        limit: 10,
        search: 'Test',
        sort_by: 'name',
        dir: 'ASC',
      };

      const area = new Area();
      area.id = 1;
      area.name = 'Test Area';

      const areas = [area];
      const totalData = 1;

      jest.spyOn(repo, 'findAndCount').mockResolvedValue([areas, totalData]);

      const result = await service.findAll(queryParams);

      expect(result).toEqual(
        generatePaginatedResponse(
          areas.map((area) => plainToClass(AreaResponseDto, area)),
          totalData,
          queryParams.page,
          queryParams.limit,
        ),
      );
    });
  });

  describe('findOne', () => {
    it('should return an area', async () => {
      const id = 1;
      const area = new Area();
      area.id = 1;
      area.name = 'Test Area';

      jest.spyOn(repo, 'findOneBy').mockResolvedValue(area);

      const result = await service.findOne(id);

      expect(result).toEqual(
        generateSingleDataResponse(
          plainToClass(AreaResponseDto, area),
          200,
          Message.SUCCESS,
        ),
      );
    });

    it('should throw an error if area not found', async () => {
      const id = 1;
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(ErrorException);
    });
  });

  describe('update', () => {
    it('should update an area', async () => {
      const id = 1;
      const updateAreaDto: UpdateAreaDto = {
        name: 'Updated Area',
        province: 'Updated Province',
        regency: 'Updated Regency',
        subdistrict: 'Updated Subdistrict',
        updated_by: 1,
      };

      const updatedArea = new Area();
      updatedArea.id = 1;
      updatedArea.name = 'Updated Area';

      jest.spyOn(repo, 'update').mockResolvedValue(null);
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(updatedArea);

      const result = await service.update(id, updateAreaDto);

      expect(result).toEqual(
        generateSingleDataResponse(
          plainToClass(AreaResponseDto, updatedArea),
          200,
          Message.SUCCESS,
        ),
      );
    });

    it('should throw an error if update results in a conflict', async () => {
      const id = 1;
      const updateAreaDto: UpdateAreaDto = {
        name: 'Updated Area',
      };

      jest.spyOn(repo, 'update').mockRejectedValue(new Error('duplicate key'));

      await expect(service.update(id, updateAreaDto)).rejects.toThrow(
        ErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an area', async () => {
      const id = 1;
      jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 1 } as any);

      const result = await service.remove(id);

      expect(result).toEqual(
        generateSingleDataResponse(null, 204, Message.NO_CONTENT),
      );
    });

    it('should throw an error if area to remove is not found', async () => {
      const id = 1;
      jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(id)).rejects.toThrow(ErrorException);
    });
  });
});
