import { DataSource, Not } from 'typeorm';
import { SubFeature } from '../entities/sub-feature.entity';
import { Role } from '../entities/role.entity';
import { Policy } from '../entities/policy.entity';

export async function PolicySeed(dataSource: DataSource): Promise<any> {
  const subFeatureRepository = dataSource.getRepository(SubFeature);
  const roleRepository = dataSource.getRepository(Role);
  const policyRepository = dataSource.getRepository(Policy);

  const sub_features = await subFeatureRepository.find();

  const roles = await roleRepository.find();

  const policies = [];

  for (const role of roles) {
    for (const sub_feature of sub_features) {
      policies.push({
        role_id: role.id,
        features_id: sub_feature.features_id,
        sub_features_id: sub_feature.id,
        status: false,
      });
    }
  }

  await policyRepository.insert(policies);
}
