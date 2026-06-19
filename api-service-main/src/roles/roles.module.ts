import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Role } from '../database/entities/role.entity';
import { Policy } from '../database/entities/policy.entity';
import { Casbin } from '../database/entities/casbin.entity';
import { CasbinModule } from '../casbin/casbin.module';
import { SubFeature } from '../database/entities/sub-feature.entity';
import { Feature } from '../database/entities/feature.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Policy, Casbin, Feature, SubFeature]),
    CasbinModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
