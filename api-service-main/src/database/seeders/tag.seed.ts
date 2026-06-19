import { DataSource } from 'typeorm';
import { Tag } from '../entities/tag.entity';

export async function TagSeed(dataSource: DataSource): Promise<any> {
  const tagRepository = dataSource.getRepository(Tag);

  const tags = [
    {
      name: 'insect',
    },
    {
      name: 'bug',
    },
    {
      name: 'bee',
    },
    {
      name: 'white',
    },
    {
      name: 'black',
    },
  ];

  for (const tag of tags) {
    const existingTag = await tagRepository.findOneBy({
      name: tag.name,
    });
    if (!existingTag) {
      await tagRepository.insert(tag);
      console.log(`Inserted area: ${tag.name})`);
    } else {
      console.log(`Area with ID "${tag.name}" already exists.`);
    }
  }
}
