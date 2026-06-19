import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('Sould be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return 404 when user not found', async () => {
      const mockUser = {
        username: 'john@mail.com',
        password: 'password',
      };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.loginUser(mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return 403 when password invalid', async () => {
      const mockUser = {
        username: 'john@mail.com',
        password: 'wrong_password',
      };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new BadRequestException('Invalid password'));

      await expect(controller.loginUser(mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return 200 when login success', async () => {
      const mockUser = {
        username: 'john@mail.com',
        password: 'valid_password',
      };

      const response = {
        token: 'jwt_token',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(response);

      const result = await controller.loginUser(mockUser);

      expect(result.token).toBeDefined();
    });
  });
});
