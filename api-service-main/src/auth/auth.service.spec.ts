import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { RedisService } from '../redis/redis.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ErrorException } from '../common/filters/error.exception';
import { Message } from '../common/message.enum';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let redisService: RedisService;
  let mailService: MailService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mockJwtToken') },
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: RedisService,
          useValue: {
            set: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: { forgetPassword: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue(3600) }, // mock jwtExpire to be 3600 seconds
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    jwtService = moduleRef.get<JwtService>(JwtService);
    redisService = moduleRef.get<RedisService>(RedisService);
    mailService = moduleRef.get<MailService>(MailService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
      const user = new User();
      user.username = 'testUser';
      user.email = 'test@example.com';
      user.status = true;
      user.password = await bcrypt.hash('password', 10);

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      const result = await authService.login('testUser', 'password');

      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('token', 'mockJwtToken');
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        authService.login('wrongUser', 'password'),
      ).rejects.toThrowError(
        new ErrorException(Message.NOT_FOUND, 400, 'Invalid email or password'),
      );
    });

    it('should throw an error if password is invalid', async () => {
      const user = new User();
      user.username = 'testUser';
      user.email = 'test@example.com';
      user.password = await bcrypt.hash('password', 10);

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      await expect(
        authService.login('testUser', 'wrongPassword'),
      ).rejects.toThrowError(
        new ErrorException(Message.NOT_FOUND, 400, 'Invalid email or password'),
      );
    });
  });

  describe('logOut', () => {
    it('should remove token from Redis', async () => {
      const token = 'mockJwtToken';
      const authorization = `Bearer ${token}`;

      await authService.logOut(authorization);

      expect(redisService.remove).toBeCalledWith(
        `${configService.get('accessTokenRedisPrefix')}:${token}`,
      );
    });
  });
});
