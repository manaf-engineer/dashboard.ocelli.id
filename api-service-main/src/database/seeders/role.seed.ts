import { DataSource } from 'typeorm';
import { Role } from '../entities/role.entity';

export async function RoleSeed(dataSource: DataSource): Promise<any> {
  const roleRepository = dataSource.getRepository(Role);

  const roles = [
    {
      name: 'Superadmin',
      label: 'superadmin',
      description: 'Has access to all functionalities and settings.',
    },
    {
      name: 'Admin',
      label: 'admin',
      description:
        'Can manage users and roles, but with limited settings access.',
    },
    {
      name: 'Peneliti',
      label: 'peneliti',
      description: 'Researcher role with access to specific data and reports.',
    },
  ];

  for (const role of roles) {
    const existingRole = await roleRepository.findOneBy({ label: role.label });
    if (!existingRole) {
      await roleRepository.insert(role);
      console.log(`Inserted role: ${role.name}`);
    } else {
      console.log(`Role with label "${role.label}" already exists.`);
    }
  }
}
