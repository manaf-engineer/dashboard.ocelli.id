import { DataSource } from 'typeorm';
import { SubFeature } from '../entities/sub-feature.entity';
import { Feature } from '../entities/feature.entity';

export async function SubFeatureSeed(dataSource: DataSource): Promise<any> {
  const subFeatureRepository = dataSource.getRepository(SubFeature);
  const featureRepository = dataSource.getRepository(Feature);

  const features = await featureRepository.find();
  const subFeatures = [];

  for (const feature of features) {
    switch (feature.name) {
      case 'Dashboard':
        subFeatures.push({
          name: 'Index',
          description: 'Manajemen dasbor',
          features_id: feature.id,
        });
        break;

      case 'Dataset Serangga':
        subFeatures.push({
          name: 'Index',
          description: 'Daftar dataset serangga',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Detail',
          description: 'Detail dataset serangga',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Create',
          description: 'Buat dataset serangga baru',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Update',
          description: 'Perbarui dataset serangga',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Delete',
          description: 'Hapus dataset serangga',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Import',
          description: 'Impor dataset serangga',
          features_id: feature.id,
        });
        break;

      case 'Data Node Trap':
        subFeatures.push({
          name: 'Index',
          description: 'Daftar node trap',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Detail',
          description: 'Detail node trap',
          features_id: feature.id,
        });
        break;

      case 'Master Node Trap':
        subFeatures.push({
          name: 'Index',
          description: 'Daftar master node trap',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Detail',
          description: 'Detail master node trap',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Create',
          description: 'Buat master node trap baru',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Update',
          description: 'Perbarui master node trap',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Delete',
          description: 'Hapus master node trap',
          features_id: feature.id,
        });
        break;

      case 'Master Area':
        subFeatures.push({
          name: 'Index',
          description: 'Daftar master area',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Detail',
          description: 'Detail master area',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Create',
          description: 'Buat master area baru',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Update',
          description: 'Perbarui master area',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Delete',
          description: 'Hapus master area',
          features_id: feature.id,
        });
        break;

      case 'Laporan Trap Node':
        subFeatures.push({
          name: 'Index',
          description: 'Daftar laporan node trap',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Download',
          description: 'Unduh laporan node trap',
          features_id: feature.id,
        });
        break;

      case 'Pengaturan Interval':
        subFeatures.push({
          name: 'Index',
          description: 'Daftar pengaturan interval',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Update',
          description: 'Perbarui pengaturan interval',
          features_id: feature.id,
        });
        break;

      case 'Access Control List':
        subFeatures.push({
          name: 'Index Role',
          description: 'Daftar peran',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Create Role',
          description: 'Buat peran baru',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Update Role',
          description: 'Perbarui peran',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Delete Role',
          description: 'Hapus peran',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Index User',
          description: 'Daftar pengguna',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Create User',
          description: 'Buat pengguna baru',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Update User',
          description: 'Perbarui pengguna',
          features_id: feature.id,
        });
        subFeatures.push({
          name: 'Delete User',
          description: 'Hapus pengguna',
          features_id: feature.id,
        });
        break;
    }
  }

  await subFeatureRepository.insert(subFeatures);
}
