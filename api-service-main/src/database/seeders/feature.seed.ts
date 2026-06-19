import { DataSource } from 'typeorm';
import { Feature } from '../entities/feature.entity';

export async function FeatureSeed(dataSource: DataSource): Promise<any> {
  const featureRepository = dataSource.getRepository(Feature);

  const features = [
    {
      name: 'Dashboard',
      description: 'Dasbor untuk manajemen pengguna dan statistik.',
    },
    {
      name: 'Dataset Serangga',
      description: 'Kumpulan data tentang serangga yang dikumpulkan.',
    },
    {
      name: 'Data Node Trap',
      description: 'Data hasil penangkapan menggunakan perangkap.',
    },
    {
      name: 'Master Node Trap',
      description: 'Manajemen dan penyimpanan gambar dari node perangkap.',
    },
    {
      name: 'Master Area',
      description: 'Manajemen wilayah dan area pemantauan.',
    },
    {
      name: 'Laporan Trap Node',
      description: 'Laporan terkait hasil dan performa trap node.',
    },
    {
      name: 'Pengaturan Interval',
      description: 'Pengaturan interval untuk pengambilan hasil tangkapan.',
    },
    {
      name: 'Access Control List',
      description: 'Pengaturan hak akses untuk pengguna dan grup.',
    },
  ];

  await featureRepository
    .createQueryBuilder()
    .insert()
    .values(features)
    .execute();
}
