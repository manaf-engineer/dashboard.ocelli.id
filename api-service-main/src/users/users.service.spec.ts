import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../database/entities/user.entity';
import { Role } from '../database/entities/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, EntityManager, DeleteResult, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/response-user.dto';
import { QueryParamsDto } from '../common/dtos/query-params.dto';
import { ErrorException } from '../common/filters/error.exception';
import { MinioService } from '../minio/minio.services';
import { Message } from '../common/message.enum';
import { plainToInstance } from 'class-transformer';
import {
  generatePaginatedResponse,
  generateSingleDataResponse,
} from '../common/utils/general-response';
import { RolesService } from '../roles/roles.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let entityManager: EntityManager;
  let minioService: MinioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
          useValue: {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        EntityManager,
        {
          provide: MinioService,
          useValue: {
            uploadBase64Image: jest.fn(),
          },
        },
        {
          provide: RolesService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    entityManager = module.get<EntityManager>(EntityManager);
    minioService = module.get<MinioService>(MinioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hello', () => {
    it('should return a welcome message', async () => {
      const username = 'John';
      const result = generateSingleDataResponse(
        'Welcome to Tlab Node : ' + username,
      );

      expect(await service.hello(username)).toEqual(result);
    });
  });

  describe('findUsers', () => {
    it('should return paginated list of users', async () => {
      const queryParams: QueryParamsDto = {
        page: 1,
        limit: 10,
        search: 'John',
        sort_by: 'name',
        dir: 'ASC',
      };
      const role = new Role();
      role.id = 1;
      role.label = 'admin';

      const user = new User();
      user.id = 1;
      user.name = 'John';
      user.role_id = 1;
      user.role = role;

      const users = [user];
      const totalData = 1;

      jest
        .spyOn(userRepository, 'findAndCount')
        .mockResolvedValue([users, totalData]);
      const result = await service.findUsers(queryParams);

      expect(result).toEqual(
        generatePaginatedResponse(
          users.map((user) => plainToInstance(UserResponseDto, user)),
          totalData,
          queryParams.page,
          queryParams.limit,
        ),
      );
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const userId = 1;
      const user = new User();
      user.id = 1;
      user.name = 'John';
      user.role = new Role();
      user.role.label = 'admin';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      expect(await service.findOne(userId)).toEqual(
        generateSingleDataResponse(plainToInstance(UserResponseDto, user)),
      );
    });

    it('should throw user not found exception', async () => {
      const userId = 1;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(userId)).rejects.toThrow(
        new ErrorException(Message.NOT_FOUND, 404, 'User not found'),
      );
    });
  });

  describe('updateUser', () => {
    it('should update and return a user', async () => {
      const userId = 1;
      const id = 1;
      const updateUserDto = new UpdateUserDto();
      updateUserDto.name = 'John';
      const user = new User();
      user.id = 1;
      user.name = 'John';
      user.role_id = 1;

      const role = new Role();
      role.label = 'user';
      user.role = role;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(roleRepository, 'findOneBy').mockResolvedValueOnce(role);

      // Mock the update method
      const updateResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 1,
      };
      jest.spyOn(userRepository, 'update').mockResolvedValueOnce(updateResult);

      const updatedUser = {
        ...user,
        ...updateUserDto,
        message: 'success',
        role: role,
        updated_at: new Date().toISOString(),
        updated_by: userId,
      };

      // Mock the findOne method of the service to return the updated user
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(updatedUser);

      expect(await service.updateUser(id, userId, updateUserDto)).toEqual({
        ...updatedUser,
        message: 'success',
      });
    });

    it('should throw user not found exception', async () => {
      const userId = 1;
      const id = 1;
      const updateUserDto = new UpdateUserDto();
      updateUserDto.name = 'John';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateUser(id, userId, updateUserDto),
      ).rejects.toThrow(new ErrorException('User not found', 404));
    });

    it('should throw cannot update this user exception', async () => {
      const userId = 1;
      const id = 1;
      const updateUserDto = new UpdateUserDto();
      updateUserDto.name = 'John';

      const user = new User();
      user.id = 1;
      user.name = 'John';

      const role = new Role();
      role.label = 'superadmin';
      user.role = role;
      user.role_id = 1;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(roleRepository, 'findOneBy').mockResolvedValue(role);

      await expect(
        service.updateUser(id, userId, updateUserDto),
      ).rejects.toThrow(
        new ErrorException(Message.BAD_REQUEST, 400, 'cannot update this user'),
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const id = 1;
      const user = new User();
      user.id = 1;
      user.name = 'John';
      user.role = new Role();
      user.role.label = 'user';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(userRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as DeleteResult);

      expect(await service.deleteUser(id)).toEqual(
        generateSingleDataResponse(null),
      );
    });

    it('should throw user not found exception', async () => {
      const id = 1;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteUser(id)).rejects.toThrow(
        new ErrorException(Message.NOT_FOUND, 404, 'user not found'),
      );
    });

    it('should throw cannot remove this user exception', async () => {
      const id = 1;
      const user = new User();
      user.id = 1;
      user.name = 'John';
      user.role = new Role();
      user.role.label = 'superadmin';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      await expect(service.deleteUser(id)).rejects.toThrow(
        new ErrorException(Message.BAD_REQUEST, 400, 'cannot remove this user'),
      );
    });
  });

  describe('create', () => {
    // Assuming create functionality and test would go here.

    it('should create and return a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        email: 'john@example.com',
        password: 'StrongPass1!',
        status: true,
        role_id: 1,
      };
      const user = new User();
      user.id = 1;
      user.name = createUserDto.name;
      user.email = createUserDto.email;
      user.password = createUserDto.password;
      user.status = createUserDto.status;
      user.role_id = createUserDto.role_id;

      const role = new Role();
      role.label = 'admin';
      jest.spyOn(roleRepository, 'findOneBy').mockResolvedValue(role);
      jest.spyOn(userRepository, 'create').mockReturnValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const responseData = { user: plainToInstance(UserResponseDto, user) };
      expect(await service.create(createUserDto)).toEqual(
        generateSingleDataResponse(responseData, 201, 'created'),
      );
    });
  });
});
