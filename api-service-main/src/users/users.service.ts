import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, ILike, EntityManager } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { Role } from '../database/entities/role.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/response-user.dto';
import { QueryParamsDto } from '../common/dtos/query-params.dto';
import {
  generatePaginatedResponse,
  generateSingleDataResponse,
} from '../common/utils/general-response';
import * as bcrypt from 'bcrypt';
import { ErrorException } from '../common/filters/error.exception';
import { plainToInstance } from 'class-transformer';
import { MinioService } from '../minio/minio.services';
import { Message } from '../common/message.enum';
import { RolesService } from '../roles/roles.service';
import { transformImageToPublicUrl } from '../common/utils/file-to-public-url';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly entityManager: EntityManager,
    private readonly minioService: MinioService,
    private readonly roleService: RolesService,
  ) {}

  // === CRUD USERS ===
  async hello(username: string): Promise<any> {
    return generateSingleDataResponse('Welcome to Tlab Node : ' + username);
  }

  async findUsers(queryParams: QueryParamsDto): Promise<any> {
    const where: any = {};
    if (queryParams.search) {
      where.name = ILike(`%${queryParams.search}%`);
    }

    if (queryParams.role_id) {
      where.role_id = queryParams.role_id;
    }

    const [data, totalData] = await this.userRepository.findAndCount({
      where,
      relations: ['role'],
      order: {
        [queryParams.sort_by]: queryParams.dir.toUpperCase(),
      },
      take: queryParams.limit,
      skip: (queryParams.page - 1) * queryParams.limit,
    });

    const usersWithoutPassword: UserResponseDto[] = data.map((userEntity) =>
      plainToInstance(UserResponseDto, userEntity),
    );

    return generatePaginatedResponse(
      usersWithoutPassword,
      totalData,
      queryParams.page,
      queryParams.limit,
    );
  }

  async findOne(userId: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (!user) {
      throw new ErrorException(Message.NOT_FOUND, 404, 'User not found');
    }

    return generateSingleDataResponse(plainToInstance(UserResponseDto, user));
  }

  async myProfile(userId: number): Promise<any> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new ErrorException(Message.NOT_FOUND, 404, 'User not found');
    }

    // Get role and policies
    const role = await this.roleService.findOne(user.role_id);

    const transformedData = {
      id: user.id,
      name: user.name,
      email: user.email,
      photo: transformImageToPublicUrl(user.photo),
      status: user.status,
      role: role.role,
      policies: role.policies,
    };

    return generateSingleDataResponse(transformedData);
  }

  async updateUser(
    id: number,
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['role'],
    });
    if (!user) {
      throw new ErrorException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.role.label == 'superadmin') {
      throw new ErrorException(
        Message.BAD_REQUEST,
        400,
        'cannot update superadmin user',
      );
    }

    // Cannot add user admin
    const role = await this.roleRepository.findOneBy({
      id: updateUserDto.role_id,
    });
    if (role.label == 'superadmin' && user.role_id != updateUserDto.role_id) {
      throw new ErrorException(
        Message.BAD_REQUEST,
        400,
        'cannot add user as superadmin',
      );
    }

    // Generate Username
    if (updateUserDto.name) {
      let generatedUsername = updateUserDto.name.toLowerCase();
      generatedUsername = generatedUsername.replace(/\s/g, '_');
      updateUserDto.username = generatedUsername.replace(/[^\w\s]/g, '');
    }

    // Upload File
    if (updateUserDto.photo) {
      const [metadata] = updateUserDto.photo.split(',');
      const mimeType = metadata.split(':')[1].split(';')[0];
      const fileExtension = mimeType.split('/')[1];

      const imageFullname = `users/${user.id}.${fileExtension}`;
      await this.minioService.uploadBase64Image(
        updateUserDto.photo,
        imageFullname,
      );
      updateUserDto.photo = imageFullname;
    }

    // Encrypt Password
    let hashedPassword: string;
    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    }

    try {
      await this.userRepository.update(id, {
        ...updateUserDto,
        ...(hashedPassword && { password: hashedPassword }),
        updated_at: new Date(),
      });
      return this.findOne(id);
    } catch (e) {
      if (e.message.includes('duplicate key')) {
        throw new ErrorException(
          `user ${Message.DATA_EXIST}`,
          HttpStatus.CONFLICT,
          'username or email already taken please use different name or email',
        );
      }
    }
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({
      where: [{ id: id }],
      relations: ['role'],
    });

    if (!user) {
      throw new ErrorException(Message.NOT_FOUND, 404, 'user not found');
    }

    if (user.role.label == 'superadmin') {
      throw new ErrorException(
        Message.BAD_REQUEST,
        400,
        'cannot remove this user',
      );
    }

    const deleteResult: DeleteResult = await this.userRepository.delete({ id });

    const deletionSuccessful = deleteResult.affected > 0;
    if (!deletionSuccessful) {
      throw new ErrorException(Message.NOT_FOUND, 404, 'User not found');
    }

    return generateSingleDataResponse(null);
  }

  async create(userDto: CreateUserDto): Promise<any> {
    let generatedUsername = userDto.name.toLowerCase();
    generatedUsername = generatedUsername.replace(/\s/g, '_');
    generatedUsername = generatedUsername.replace(/[^\w\s]/g, '');
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    // Cannot create new superadmin user
    const role = await this.roleRepository.findOneBy({
      id: userDto.role_id,
    });
    if (role.label == 'superadmin') {
      throw new ErrorException(
        Message.BAD_REQUEST,
        400,
        'cannot add user as superadmin',
      );
    }

    const newUser = this.userRepository.create({
      ...userDto,
      username: generatedUsername,
      password: hashedPassword,
      created_at: new Date(),
      role_id: userDto.role_id,
    });

    try {
      const savedUser = await this.userRepository.save(newUser);
      const userResp = plainToInstance(UserResponseDto, savedUser);
      const responseData = { user: userResp };
      return generateSingleDataResponse(responseData, 201, 'created');
    } catch (e) {
      if (e.message.includes('duplicate key')) {
        throw new ErrorException(
          `user ${Message.DATA_EXIST}`,
          HttpStatus.CONFLICT,
          'username or email already taken. please use different name or email',
        );
      }
    }
  }
}
