import { DataSource } from 'typeorm';
import { Feature } from '../entities/feature.entity';
import { SubFeature } from '../entities/sub-feature.entity';
import { Endpoint } from '../entities/endpoint.entity';
import { Policy } from '../entities/policy.entity';
import { Role } from '../entities/role.entity';

export async function ExportImageSeed(dataSource: DataSource): Promise<any> {
  // Cretae Feature
  const featureRepository = dataSource.getRepository(Feature);
  const newFeature = featureRepository.create({
    name: 'Data Foto',
    description: 'Fitur untuk melihat dan unduh data foto.',
  });
  const savedFeature = await featureRepository.save(newFeature);

  // Create Subfeature
  const subFeatureRepository = dataSource.getRepository(SubFeature);
  const subFeatureIndex = subFeatureRepository.create({
    name: 'Index',
    description: 'Daftar gambar node trap',
    features_id: savedFeature.id,
  });
  const subFeatureDownload = subFeatureRepository.create({
    name: 'Download',
    description: 'Unduh gambar node trap',
    features_id: savedFeature.id,
  });
  const savedSubFeatureIndex = await subFeatureRepository.save(subFeatureIndex);
  const savedSubFeatureDownload = await subFeatureRepository.save(
    subFeatureDownload,
  );

  // Create Endpoint
  const endpointRepository = dataSource.getRepository(Endpoint);
  const endpointIndex = endpointRepository.create({
    url: '/capture-results/report',
    method: 'GET',
    sub_features_id: savedSubFeatureIndex.id,
  });
  const endpointDownload = endpointRepository.create({
    url: '/capture-results/report/download',
    method: 'GET',
    sub_features_id: savedSubFeatureDownload.id,
  });
  await endpointRepository.save(endpointIndex);
  await endpointRepository.save(endpointDownload);

  // Create Policies
  const policyRepository = dataSource.getRepository(Policy);
  const roles = await dataSource.getRepository(Role).find();

  for (const role of roles) {
    const policyIndex = policyRepository.create({
      role_id: role.id,
      features_id: savedSubFeatureIndex.features_id,
      sub_features_id: savedSubFeatureIndex.id,
      status: false,
    });

    const policyDownload = policyRepository.create({
      role_id: role.id,
      features_id: savedSubFeatureDownload.features_id,
      sub_features_id: savedSubFeatureDownload.id,
      status: false,
    });

    await policyRepository.save(policyIndex);
    await policyRepository.save(policyDownload);
  }
}
