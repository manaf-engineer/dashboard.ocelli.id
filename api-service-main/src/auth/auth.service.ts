import {
  Injectable,
  Inject,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { generateSingleDataResponse } from '../common/utils/general-response';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../common/message.enum';
import { RedisService } from '../redis/redis.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as moment from 'moment-timezone';
import { ResetPasswordInputDto } from './dto/reset-password-input.dto';
import { ErrorException } from '../common/filters/error.exception';
import { plainToClass } from 'class-transformer';
import { UserResponseDto } from '../users/dtos/response-user.dto';
import { formatDateInTimezone } from '../common/utils/date-to-string';

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  // === Auth Functions ===
  async login(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: [{ username: username }, { email: username }],
      relations: ['role'],
    });

    if (!user || !user.status) {
      throw new ErrorException(
        Message.NOT_FOUND,
        400,
        'Invalid email or password',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ErrorException(
        Message.BAD_REQUEST,
        400,
        'Invalid email or password',
      );
    }

    const token = this.generateToken(user);
    const userResponse = plainToClass(UserResponseDto, user);
    const expirationTimeInSeconds = this.configService.get<number>('jwtExpire');
    const currentTime = new Date();
    const expiredTime = new Date(
      currentTime.getTime() + expirationTimeInSeconds * 1000,
    );
    const expiredTimeResponse = formatDateInTimezone(expiredTime);
    const responseData = {
      user: userResponse,
      token: token,
      expired_at: expiredTimeResponse,
    };

    await this.redisService.set(
      `${this.configService.get('accessTokenRedisPrefix')}:${token}`,
      token,
      this.configService.get<number>('jwtExpire'),
    );

    return generateSingleDataResponse(responseData);
  }

  async logOut(authorization: string) {
    try {
      const token = authorization.split(' ')[1];

      await this.redisService.remove(
        `${this.configService.get('accessTokenRedisPrefix')}:${token}`,
      );
    } catch (error) {
      Logger.error(Message.UNAUTHORIZED);
      throw new ErrorException(Message.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    return generateSingleDataResponse(null);
  }

  // === Helper Functions ===
  generateToken(user: User): string {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }

  async forgetPassword(email: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) return;

    const resetPasswordToken = crypto.randomBytes(30).toString('hex');
    user.password_reset_token = resetPasswordToken;
    user.password_reset_at = moment.utc().add(15, 'minutes').toDate();

    await this.update(user.id, user);

    const data = {
      name: user.name,
      email: user.email,
      link: `${this.configService.get(
        'originUrl',
      )}/reset-password?token=${resetPasswordToken}`,
    };

    await this.mailService.forgetPassword(data);

    return generateSingleDataResponse(null);
  }

  async resetPassword(resetPasswordInput: ResetPasswordInputDto): Promise<any> {
    const user = await this.userRepository.findOneBy({
      password_reset_token: resetPasswordInput.token,
    });

    if (!user) {
      Logger.error(`user ${Message.NOT_FOUND}`);
      throw new ErrorException(
        `user ${Message.NOT_FOUND}`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (moment.utc().isAfter(user.password_reset_at)) {
      Logger.error(Message.TOKEN_EXPIRED);
      throw new ErrorException(Message.TOKEN_EXPIRED, HttpStatus.BAD_REQUEST);
    }

    user.password_reset_token = null;
    user.password_reset_at = null;
    user.password = await bcrypt.hash(resetPasswordInput.password, 10);

    await this.update(user.id, user);

    return generateSingleDataResponse(null);
  }

  async update(id: number, user: User): Promise<User> {
    const userEntity = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(user)
      .where('id = :id', { id: id })
      .returning('*')
      .execute();

    if (userEntity.affected === 0) {
      throw new ErrorException(Message.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return userEntity.raw[0];
  }
}
