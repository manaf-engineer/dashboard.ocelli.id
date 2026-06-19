import { DataSource } from 'typeorm';
import { CaptureResult } from '../entities/capture-result.entity';
import { TrapNode } from '../entities/trap-node.entity';
import { base64Images } from './images';
import { MinioService } from '../../minio/minio.services';

const captureDates = [
  new Date(Date.now()),
  new Date(Date.now() - 24 * 60 * 60 * 1000),
  new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
];

export async function CaptureResultSeed(
  dataSource: DataSource,
  minioService: MinioService,
): Promise<any> {
  const captureResultRepository = dataSource.getRepository(CaptureResult);
  const trapNodeRepository = dataSource.getRepository(TrapNode);

  // Fetch all trap nodes
  const trapNodes = await trapNodeRepository.find();

  for (const trapNode of trapNodes) {
    // Create capture results with predefined dates
    for (let i = 0; i < captureDates.length; i++) {
      const index = i % base64Images.length;
      const fileFullName = `capture_result/${trapNode.id}/insect_${
        index + 1
      }.png`;

      // Create Capture Result
      const captureResult = new CaptureResult();
      captureResult.collection_time = captureDates[i % captureDates.length];
      captureResult.trap_node = trapNode;
      captureResult.image = fileFullName;
      captureResult.created_by = null;
      captureResult.updated_by = null;
      await captureResultRepository.save(captureResult);

      // Upload Image into Minio
      const base64Image = base64Images[index];
      await minioService.uploadBase64Image(base64Image, fileFullName);

      console.log(`Inserted capture result for trap node: ${trapNode.trap_id}`);
    }
  }
}
