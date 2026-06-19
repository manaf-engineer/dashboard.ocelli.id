import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Extract JWT token from the request headers
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token format

    if (token) {
      try {
        // Check JWT Exist on Redis
        const isTokenWhitelisted = await this.redisService.get(
          `${this.configService.get('accessTokenRedisPrefix')}:${token}`,
        );
        if (!isTokenWhitelisted) {
          return res.status(401).json({
            code: 401,
            message: 'Unauthorized',
            errors: 'You are logged out',
          });
        }

        // Verify and decode the JWT token
        const jwtSecret = this.configService.get<string>('jwtSecret');
        const decodedToken = verify(token, jwtSecret) as string | JwtPayload;

        let username: string | undefined;
        let userId: string | undefined;

        if (typeof decodedToken === 'string') {
          username = decodedToken;
          userId = '0';
        } else if (
          decodedToken &&
          typeof decodedToken === 'object' &&
          'username' in decodedToken
        ) {
          userId = decodedToken.sub;
          username = decodedToken.username;
        }

        if (username) {
          req['user'] = username;
          req['userid'] = userId;
          next();
        } else {
          // Username not found in the token
          return res.status(401).json({
            code: 401,
            message: 'Unauthorized',
            errors: 'User Not Found',
          });
        }
      } catch (error) {
        // Handle token verification error
        return res.status(401).json({
          code: 401,
          message: 'Unauthorized',
          errors: 'Token Invalid',
        });
      }
    } else {
      // Token not found in headers
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized',
        errors: 'Token Not Found',
      });
    }
  }
}
