import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import * as bcrypt from 'bcrypt';

export async function UserSeed(dataSource: DataSource): Promise<any> {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);

  // Retrieve the roles
  const superadminRole = await roleRepository.findOneBy({
    label: 'superadmin',
  });
  const adminRole = await roleRepository.findOneBy({ label: 'admin' });
  const penelitiRole = await roleRepository.findOneBy({ label: 'peneliti' });

  const users = [
    {
      name: 'Super Admin',
      username: 'superadmin',
      email: 'superadmin@email.com',
      password: await bcrypt.hash('!234Lima', 10),
      status: true,
      role: superadminRole,
    },
    {
      name: 'Admin User',
      username: 'adminuser',
      email: 'admin@email.com',
      password: await bcrypt.hash('!234Lima', 10),
      status: true,
      role: adminRole,
    },
    {
      name: 'Peneliti User',
      username: 'penelitiuser',
      email: 'peneliti@email.com',
      password: await bcrypt.hash('!234Lima', 10),
      status: true,
      role: penelitiRole,
    },
  ];

  for (const user of users) {
    const existingUser = await userRepository.findOneBy({ email: user.email });
    if (!existingUser) {
      await userRepository.insert(user);
      console.log(`Inserted user: ${user.name}`);
    } else {
      console.log(`User with email "${user.email}" already exists.`);
    }
  }
}
