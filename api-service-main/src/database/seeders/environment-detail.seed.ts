import { DataSource } from 'typeorm';
import { TrapNode } from '../entities/trap-node.entity';
import { EnvironmentDetail } from '../entities/environment-detail.entity';

export async function EnvironmentDetailSeed(
  dataSource: DataSource,
): Promise<any> {
  const trapNodeRepository = dataSource.getRepository(TrapNode);
  const environmentDetailRepository =
    dataSource.getRepository(EnvironmentDetail);

  // Fetch all trap nodes from the database
  const trapNodes = await trapNodeRepository.find();

  if (trapNodes.length === 0) {
    console.log('No trap nodes found in the database.');
    return;
  }

  // Generate random environment data (example values)
  const generateRandomEnvironmentData = () => ({
    wind_speed: parseFloat((Math.random() * (5 - 2) + 2).toFixed(2)), // Random wind speed between 2-5
    light_intensity: parseFloat((Math.random() * (8 - 4) + 4).toFixed(2)), // Random light intensity between 4-8
    temperature: parseFloat((Math.random() * (35 - 28) + 28).toFixed(2)), // Random temperature between 28-35 °C
    humidity: parseFloat((Math.random() * (83 - 65) + 65).toFixed(2)), // Random humidity between 65-83%
  });


  // Create multiple environment details for each trap node
  for (const trapNode of trapNodes) {
    // Define multiple collection dates
    const collectionTimes = [
      new Date(Date.now()), // 1 day ago
      new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    ];

    for (const collectionTime of collectionTimes) {
      const environmentData = generateRandomEnvironmentData();

      const environmentDetail = environmentDetailRepository.create({
        ...environmentData,
        collection_time: collectionTime,
        trap_node_id: trapNode.id,
        created_by: null,
      });

      // Save the new environment detail
      await environmentDetailRepository.save(environmentDetail);
      console.log(
        `Inserted environment detail for trap node "${
          trapNode.trap_id
        }" with collection time ${collectionTime.toISOString()}`,
      );
    }
  }
}
