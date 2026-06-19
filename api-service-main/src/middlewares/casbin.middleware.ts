import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { CasbinService } from '../casbin/casbin.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../database/entities/role.entity';

@Injectable()
export class CasbinMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    @Inject(CasbinService) private readonly casbinService: CasbinService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req['user']) {
      // Extract URL and feature from the originalUrl
      const urlParts = new URL(req.originalUrl, `http://${req.headers.host}`);
      const feature = urlParts.pathname.split('/')[1];

      // Get user role label
      const user = await this.userRepository.findOne({
        where: { id: req['userid'] },
        relations: ['role'],
      });

      if (!user) {
        return res.status(403).json({
          code: 403,
          message: 'Forbidden',
          errors: 'User does not have permission',
        });
      }

      // Check permission using the extracted username
      const enforcer = this.casbinService.getEnforcer();
      const hasPermission = await enforcer.enforce(
        user.role.label,
        urlParts.pathname,
        req.method,
      );
      console.log(
        'Role-' +
          user.role.label +
          ' Feature-' +
          feature +
          ' URL-' +
          urlParts.pathname +
          ' Method-' +
          req.method +
          ' : ' +
          hasPermission,
      );

      if (hasPermission) {
        // User has permission, continue to the next middleware or handler
        return next();
      } else {
        // User doesn't have permission, return forbidden status
        return res.status(403).json({
          code: 403,
          message: 'Forbidden',
          errors: 'User does not have permission',
        });
      }
    } else {
      // Username not found in the token
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized',
        errors: 'User not found',
      });
    }
  }
}
