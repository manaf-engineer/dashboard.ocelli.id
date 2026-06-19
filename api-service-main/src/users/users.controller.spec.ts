import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { QueryParamsDto } from '../common/dtos/query-params.dto';
import { generateSingleDataResponse } from '../common/utils/general-response';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findUsers: jest.fn(),
            findOne: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            create: jest.fn(),
            hello: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockQuery: QueryParamsDto = { page: 1, limit: 10 };
      const result = [{ id: 1, name: 'John' }];
      jest.spyOn(usersService, 'findUsers').mockResolvedValue(result);

      expect(await controller.findAll(mockQuery)).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const result = { id: 1, name: 'John' };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne({ userid: 1 }, 1)).toBe(result);
    });

    it('should throw NotFoundException', async () => {
      jest
        .spyOn(usersService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.findOne({ userid: 1 }, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      const mockUpdateUserDto: UpdateUserDto = Object.assign(
        new UpdateUserDto(),
        { name: 'John' },
      );
      const result = { id: 1, ...mockUpdateUserDto };
      jest.spyOn(usersService, 'updateUser').mockResolvedValue(result);

      expect(await controller.update({ userid: 1 }, 1, mockUpdateUserDto)).toBe(
        result,
      );
    });

    it('should throw BadRequestException', async () => {
      const mockUpdateUserDto: UpdateUserDto = Object.assign(
        new UpdateUserDto(),
        { name: 'John' },
      );
      jest
        .spyOn(usersService, 'updateUser')
        .mockRejectedValue(new BadRequestException());

      await expect(
        controller.update({ userid: 1 }, 1, mockUpdateUserDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateProfile', () => {
    it('should update and return user profile', async () => {
      const mockUpdateUserDto: UpdateUserDto = Object.assign(
        new UpdateUserDto(),
        { name: 'John' },
      );
      const result = { id: 1, ...mockUpdateUserDto };
      jest.spyOn(usersService, 'updateUser').mockResolvedValue(result);

      expect(
        await controller.updateProfile({ userid: 1 }, mockUpdateUserDto),
      ).toBe(result);
    });

    it('should throw BadRequestException', async () => {
      const mockUpdateUserDto: UpdateUserDto = Object.assign(
        new UpdateUserDto(),
        { name: 'John' },
      );
      jest
        .spyOn(usersService, 'updateUser')
        .mockRejectedValue(new BadRequestException());

      await expect(
        controller.updateProfile({ userid: 1 }, mockUpdateUserDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user', async () => {
      const result = generateSingleDataResponse(null);
      jest.spyOn(usersService, 'deleteUser').mockResolvedValue(result);

      expect(await controller.deleteUserById(1)).toBe(result);
    });

    it('should throw NotFoundException', async () => {
      jest
        .spyOn(usersService, 'deleteUser')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.deleteUserById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const mockCreateUserDto: CreateUserDto = new CreateUserDto();
      mockCreateUserDto.name = 'John';
      const result = { id: 1, ...mockCreateUserDto };
      jest.spyOn(usersService, 'create').mockResolvedValue(result);

      expect(await controller.create(mockCreateUserDto)).toBe(result);
    });

    it('should throw BadRequestException', async () => {
      const mockCreateUserDto: CreateUserDto = new CreateUserDto();
      mockCreateUserDto.name = 'John';
      jest
        .spyOn(usersService, 'create')
        .mockRejectedValue(new BadRequestException());

      await expect(controller.create(mockCreateUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('hello', () => {
    it('should return hello message', async () => {
      const result = { message: 'Hello, John' };
      jest.spyOn(usersService, 'hello').mockResolvedValue(result);

      expect(await controller.hello({ user: 'John' })).toBe(result);
    });
  });
});
