import { DataSource } from 'typeorm';
import { TrapNode } from '../entities/trap-node.entity';
import { Area } from '../entities/area.entity';

export async function TrapNodeSeed(dataSource: DataSource): Promise<any> {
  const trapNodeRepository = dataSource.getRepository(TrapNode);
  const areaRepository = dataSource.getRepository(Area);

  // Fetch all areas from the database
  const areas = await areaRepository.find();

  // Example latitude and longitude for each area (you can customize these)
  const locationCoordinates = [
    { latitude: '-6.175110', longitude: '106.865036' }, // Jakarta
    { latitude: '-6.914744', longitude: '107.609810' }, // Bandung
    { latitude: '-7.005145', longitude: '110.438126' }, // Semarang
    { latitude: '-6.202393', longitude: '106.652710' }, // Tangerang
    { latitude: '3.589665', longitude: '98.673826' }, // Medan
    { latitude: '-1.265385', longitude: '116.831230' }, // Balikpapan
  ];

  if (areas.length === 0) {
    console.log('No areas found in the database.');
    return;
  }

  for (const [index, area] of areas.entries()) {
    // Generate a unique trap_id for each trap node
    const trapId = `device_${index + 1}23`;

    // Get corresponding latitude and longitude from the predefined coordinates
    const coordinates = locationCoordinates[index % locationCoordinates.length]; // Cycle through available coordinates

    // Check if a trap node with the same trap_id already exists
    const existingTrapNode = await trapNodeRepository.findOneBy({
      trap_id: trapId,
    });
    if (!existingTrapNode) {
      const newTrapNode = new TrapNode();
      newTrapNode.trap_id = trapId;
      newTrapNode.name = `Trap Node for ${area.name}`;
      newTrapNode.latitude = coordinates.latitude;
      newTrapNode.longitude = coordinates.longitude;
      newTrapNode.status = true;
      newTrapNode.area_id = area.id; // Link to the area
      newTrapNode.created_by = null;
      newTrapNode.last_update = new Date(Date.now()); // Set created_by to null

      await trapNodeRepository.save(newTrapNode);
      console.log(
        `Inserted trap node: ${newTrapNode.trap_id} for area ${area.name}`,
      );
    } else {
      console.log(`Trap node with ID "${trapId}" already exists.`);
    }
  }
}
