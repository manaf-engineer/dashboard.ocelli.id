import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import {
  generatePaginatedResponse,
  generateSingleDataResponse,
} from '../common/utils/general-response';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, In, Repository } from 'typeorm';
import { Role } from '../database/entities/role.entity';
import { QueryParamsDto } from '../common/dtos/query-params.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CasbinService } from '../casbin/casbin.service';
import { Casbin } from '../database/entities/casbin.entity';
import { Policy } from '../database/entities/policy.entity';
import { User } from '../database/entities/user.entity';
import { SubFeature } from '../database/entities/sub-feature.entity';
import { Feature } from '../database/entities/feature.entity';
import {
  RoleFormResponseDto,
  SubFeatureResponseDto,
} from './dto/form-role.dto';
import { plainToInstance } from 'class-transformer';
import { RoleListResponseDto } from './dto/response-role-list.dto';
import { UserResponseDto } from '../users/dtos/response-user.dto';
import { ErrorException } from '../common/filters/error.exception';
import { Message } from '../common/message.enum';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Casbin)
    private readonly casbinRepository: Repository<Casbin>,
    @InjectRepository(Policy)
    private readonly policyRepository: Repository<Policy>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
    @InjectRepository(SubFeature)
    private readonly subFeatureRepository: Repository<SubFeature>,
    private readonly entityManager: EntityManager,
    private readonly casbinService: CasbinService,
  ) {}

  async create(userId: number, createRoleDto: CreateRoleDto) {
    // Create Role
    const roleLabel = await this.generateUniqueRoleLabel(createRoleDto.name);
    const newRole = this.roleRepository.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
      label: roleLabel,
      created_by: userId,
      created_at: new Date(),
    });
    const savedRole = await this.roleRepository.save(newRole);

    // Create Policy
    const enforcer = this.casbinService.getEnforcer();
    const subFeatureIds = createRoleDto.policies.map(
      (policy) => policy.sub_feature_id,
    );

    // Fetch all relevant subFeatures in a single query
    const subFeatures = await this.subFeatureRepository.find({
      where: { id: In(subFeatureIds) },
      relations: ['endpoints'],
    });

    const subFeatureMap = new Map(
      subFeatures.map((subFeature) => [subFeature.id, subFeature]),
    );

    for (const policy of createRoleDto.policies) {
      const subFeature = subFeatureMap.get(policy.sub_feature_id);

      const newPolicy = this.policyRepository.create({
        features_id: subFeature.features_id,
        sub_features_id: subFeature.id,
        role_id: savedRole.id,
        status: policy.status,
        created_by: userId,
        created_at: new Date(),
      });

      const savedPolicy = await this.policyRepository.save(newPolicy);

      // Add permission only if the policy status is true
      if (policy.status) {
        const policiesToAdd: string[][] = []; // Array to collect policy arrays

        for (const endpoint of subFeature.endpoints) {
          policiesToAdd.push([
            savedRole.label,
            endpoint.url,
            endpoint.method,
            savedPolicy.id.toString(), // Save ID of the new policy
          ]);
        }

        // Add all policies at once
        await enforcer.addPolicies(policiesToAdd);
      }
    }

    return generateSingleDataResponse(null, 201, 'created');
  }

  async getForm() {
    const data = await this.featureRepository.find({
      relations: ['sub_features'],
    });

    const responseData: RoleFormResponseDto[] = data.map((featureEntity) => {
      const featureResponseDto = plainToInstance(
        RoleFormResponseDto,
        featureEntity,
      );
      featureResponseDto.sub_features = featureEntity.sub_features.map(
        (subFeatureEntity) => {
          return plainToInstance(SubFeatureResponseDto, subFeatureEntity);
        },
      );

      return featureResponseDto;
    });

    return generateSingleDataResponse(responseData);
  }

  async findAll(queryParams: QueryParamsDto) {
    const where: any = {};
    if (queryParams.search) {
      where.name = ILike(`%${queryParams.search}%`);
    }

    const [data, totalData] = await this.roleRepository.findAndCount({
      where,
      relations: ['users'], // Include users relation
      order: {
        [queryParams.sort_by]: queryParams.dir.toUpperCase(),
      },
      take: queryParams.limit,
      skip: (queryParams.page - 1) * queryParams.limit,
    });

    const dataResponse: RoleListResponseDto[] = data.map((roleEntity) => {
      const roleDto = plainToInstance(RoleListResponseDto, roleEntity);
      roleDto.user_count = roleEntity.users.length;
      roleDto.users = roleEntity.users.map((userEntity) =>
        plainToInstance(UserResponseDto, userEntity),
      );
      return roleDto;
    });

    return generatePaginatedResponse(
      dataResponse,
      totalData,
      queryParams.page,
      queryParams.limit,
    );
  }

  async findOne(id: number) {
    const role = await this.roleRepository
      .createQueryBuilder('roles')
      .select([
        'roles.id',
        'roles.name',
        'roles.label',
        'roles.description',
        'policies.id',
        'policies.sub_features_id',
        'policies.status',
        'feature.id',
        'feature.name',
        'feature.description',
        'sub_feature.id',
        'sub_feature.name',
        'sub_feature.features_id',
      ])
      .leftJoin('roles.policies', 'policies')
      .leftJoin('policies.feature', 'feature')
      .leftJoin('policies.sub_feature', 'sub_feature')
      .where('roles.id = :id', { id })
      .getOne();

    if (!role) {
      throw new ErrorException(Message.NOT_FOUND, 404, 'role not found');
    }

    const transformedData = {
      role: {
        id: role.id,
        name: role.name,
        description: role.description,
      },
      policies: [],
    };

    const feature_map = {};
    role.policies.forEach((policy) => {
      const feature_id = policy.feature.id;
      const feature_name = policy.feature.name;

      if (!feature_map[feature_id]) {
        feature_map[feature_id] = {
          feature_id: feature_id,
          feature_name: feature_name,
          feature_description: policy.feature.description,
          sub_features: [],
        };
      }

      const policyStatus = role.label === 'superadmin' ? true : policy.status;

      feature_map[feature_id].sub_features.push({
        id: policy.sub_features_id,
        policy_id: policy.id,
        sub_feature_name: policy.sub_feature.name,
        status: policyStatus,
      });
    });

    transformedData.policies = Object.values(feature_map);

    return transformedData;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<any> {
    const existingRole = await this.roleRepository.findOneBy({ id });
    if (!existingRole) {
      throw new ErrorException(Message.NOT_FOUND, 404, 'role not found');
    }

    if (existingRole.label == 'superadmin') {
      throw new ErrorException(
        Message.BAD_REQUEST,
        400,
        'cannot update this role',
      );
    }

    let newLabel = existingRole.label;
    if (updateRoleDto.name !== existingRole.name) {
      const label = await this.generateUniqueRoleLabel(updateRoleDto.name);
      await this.roleRepository.update(
        { id },
        { name: updateRoleDto.name, label: label },
      );
      newLabel = label;

      await this.casbinRepository.update(
        { ptype: 'g', v1: existingRole.label },
        { v1: label },
      );

      await this.casbinRepository.update(
        { ptype: 'p', v0: existingRole.label },
        { v0: label },
      );

      await this.casbinService.reloadPolicy();
    }

    for (const policy of updateRoleDto.policies) {
      const enforcer = this.casbinService.getEnforcer();

      // Fetch the sub-feature and its associated endpoints
      const subFeature = await this.subFeatureRepository.findOne({
        where: { id: policy.sub_feature_id },
        relations: ['endpoints'], // Ensure you include endpoints in the fetch
      });

      // Update Policy
      const policyDB = await this.policyRepository.findOneBy({
        id: policy.policy_id,
      });
      policyDB.status = policy.status;
      await this.policyRepository.save(policyDB);

      // Prepare policies to add or remove
      const policiesToManage: string[][] = subFeature.endpoints.map(
        (endpoint) => [
          newLabel,
          endpoint.url,
          endpoint.method,
          policy.policy_id.toString(),
        ],
      );

      // Update Casbin
      if (policy.status) {
        // Add all policies at once
        await enforcer.addPolicies(policiesToManage);
      } else {
        // Remove all policies at once
        await enforcer.removePolicies(policiesToManage);
      }
    }

    return {
      status: 200,
      message: 'updated',
    };
  }

  async remove(id: number) {
    const role = await this.roleRepository.findOneBy({ id: id });
    if (!role) {
      throw new ErrorException(Message.NOT_FOUND, 404, 'role not found');
    }
    if (role.label == 'superadmin') {
      throw new ErrorException(
        Message.BAD_REQUEST,
        400,
        'cannot remove this role',
      );
    }

    const user_count = await this.userRepository.countBy({ role_id: id });
    if (user_count > 0) {
      throw new ErrorException(
        Message.BAD_REQUEST,
        400,
        'this role still has users',
      );
    }

    // Delete on Policy
    await this.policyRepository.delete({ role_id: id });

    // Delete on Casbin
    await this.casbinRepository.delete({ ptype: 'g', v1: role.label });
    await this.casbinRepository.delete({ ptype: 'p', v0: role.label });
    await this.casbinService.reloadPolicy();

    // Delete Role
    await this.roleRepository.delete({ id: id });

    return generateSingleDataResponse(null, 204, 'no content');
  }

  private async generateUniqueRoleLabel(name: string): Promise<string> {
    // Convert the name to lowercase
    let baseLabel = name.toLowerCase();

    // Replace spaces with underscores
    baseLabel = baseLabel.replace(/\s/g, '_');

    // Remove all symbols
    baseLabel = baseLabel.replace(/[^\w\s]/g, '');

    let label = baseLabel;
    let count = 1;

    const dataExistOnUser = await this.entityManager
      .getRepository('users')
      .createQueryBuilder('users')
      .where({ ['username']: label })
      .getExists();

    if (dataExistOnUser) {
      label = `${label}1`;
    }

    // If label already exists, append a number to make it unique
    while (await this.roleRepository.findOneBy({ label: label })) {
      label = `${baseLabel}${count}`;
      count++;
    }

    return label;
  }
}
