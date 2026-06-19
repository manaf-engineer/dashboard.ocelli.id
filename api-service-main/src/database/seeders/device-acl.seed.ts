import { DataSource } from 'typeorm';
import { Feature } from '../entities/feature.entity';
import { SubFeature } from '../entities/sub-feature.entity';
import { Endpoint } from '../entities/endpoint.entity';
import { Policy } from '../entities/policy.entity';
import { Role } from '../entities/role.entity';

export async function DeviceAclSeed(dataSource: DataSource): Promise<any> {
  // Cretae Feature
  const featureRepository = dataSource.getRepository(Feature);
  const newFeature = featureRepository.create({
    name: 'Data Device',
    description: 'Fitur untuk mengelola data device',
  });
  const savedFeature = await featureRepository.save(newFeature);

  // Create Subfeature
  const subFeatureRepository = dataSource.getRepository(SubFeature);
  const subFeatures = subFeatureRepository.create([
    {
      name: 'Index',
      description: 'Daftar device trap',
      features_id: savedFeature.id,
    },
    {
      name: 'Detail',
      description: 'Lihat detail device trap',
      features_id: savedFeature.id,
    },
    {
      name: 'Create',
      description: 'Buat device trap baru',
      features_id: savedFeature.id,
    },
    {
      name: 'Update',
      description: 'Ubah device trap baru',
      features_id: savedFeature.id,
    },
    {
      name: 'Delete',
      description: 'Hapus device trap',
      features_id: savedFeature.id,
    },
  ]);
  const savedSubfeatures = await subFeatureRepository.save(subFeatures);

  const endpointRepository = dataSource.getRepository(Endpoint);
  const endpoints = [];
  for (const subFeature of savedSubfeatures) {
    switch (subFeature.name) {
      case 'Index':
        endpoints.push({
          url: '/devices',
          method: 'GET',
          sub_features_id: subFeature.id,
        });
        break;
      case 'Detail':
        endpoints.push({
          url: '/devices/{id}',
          method: 'GET',
          sub_features_id: subFeature.id,
        });
        break;
      case 'Create':
        endpoints.push({
          url: '/devices',
          method: 'POST',
          sub_features_id: subFeature.id,
        });
        break;
      case 'Update':
        endpoints.push({
          url: '/devices/{id}',
          method: 'GET',
          sub_features_id: subFeature.id,
        });
        endpoints.push({
          url: '/devices/{id}',
          method: 'PUT',
          sub_features_id: subFeature.id,
        });
        break;
      case 'Delete':
        endpoints.push({
          url: '/devices/{id}',
          method: 'DELETE',
          sub_features_id: subFeature.id,
        });
        break;
    }
  }
  await endpointRepository.insert(endpoints);

  // Create Policies
  const policyRepository = dataSource.getRepository(Policy);
  const roles = await dataSource.getRepository(Role).find();

  const policies = [];
  for (const subfeature of savedSubfeatures) {
    for (const role of roles) {
      policies.push({
        role_id: role.id,
        features_id: subfeature.features_id,
        sub_features_id: subfeature.id,
        status: false,
      });
    }
  }
  await policyRepository.insert(policies);
}
