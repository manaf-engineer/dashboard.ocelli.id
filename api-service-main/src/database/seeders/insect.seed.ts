import { DataSource } from 'typeorm';
import { Insect } from '../entities/insect.entity';
import { InsectImage } from '../entities/insect-image.entity';
import { base64Images } from './images';
import { MinioService } from '../../minio/minio.services';
import * as crypto from 'crypto';
import { Tag } from '../entities/tag.entity';

export async function InsectSeed(
  dataSource: DataSource,
  minioService: MinioService,
): Promise<any> {
  const insectRepository = dataSource.getRepository(Insect);
  const insectImageRepository = dataSource.getRepository(InsectImage);
  const tagRepository = dataSource.getRepository(Tag);

  const insects = [
    {
      scientific_name: 'Apis mellifera',
      common_name: 'Western honey bee',
      family: 'Apidae',
      order: 'Hymenoptera',
      description:
        'The Western honey bee is the most common species of honey bee worldwide.',
    },
    {
      scientific_name: 'Danaus plexippus',
      common_name: 'Monarch butterfly',
      family: 'Nymphalidae',
      order: 'Lepidoptera',
      description:
        'The Monarch butterfly is known for its annual migration across North America.',
    },
    {
      scientific_name: 'Coccinella septempunctata',
      common_name: 'Seven-spot ladybird',
      family: 'Coccinellidae',
      order: 'Coleoptera',
      description:
        'This ladybird species is recognizable by its seven black spots on its red wings.',
    },
  ];

  for (const [index, insectData] of insects.entries()) {
    // Check if insect already exists
    let insect = await insectRepository.findOneBy({
      scientific_name: insectData.scientific_name,
    });

    if (!insect) {
      // Insert insect
      insect = insectRepository.create({
        scientific_name: insectData.scientific_name,
        common_name: insectData.common_name,
        family: insectData.family,
        order: insectData.order,
        description: insectData.description,
        created_by: null,
      });
      await insectRepository.save(insect);
      console.log(`Inserted insect: ${insect.common_name}`);
    } else {
      console.log(
        `Insect with scientific name "${insectData.scientific_name}" already exists.`,
      );
    }

    // Check if insect image already exists
    const tags = await tagRepository.find();

    const existingImage = await insectImageRepository.findOneBy({
      insect_id: insect.id,
    });

    // Function to shuffle the array
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    if (!existingImage) {
      // Use an image from the base64 array, looping if necessary
      const imageIndex = index % base64Images.length;
      const base64Image = base64Images[imageIndex];

      const fileFullName = `insect_dataset/${insect.id}/${crypto
        .randomBytes(10)
        .toString('hex')}.png`;

      const randomTags = shuffleArray(tags).slice(0, 3);

      // Insert insect image
      console.log(randomTags);
      const insectImage = insectImageRepository.create({
        insect_id: insect.id,
        image: fileFullName,
        created_by: null,
        tags: randomTags,
      });
      await insectImageRepository.save(insectImage);

      // Upload image into Minio
      await minioService.uploadBase64Image(base64Image, fileFullName);

      console.log(`Inserted image for insect: ${insect.common_name}`);
    } else {
      console.log(`Image for insect "${insect.common_name}" already exists.`);
    }
  }
}
