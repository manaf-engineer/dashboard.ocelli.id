import { DataSource } from 'typeorm';
import { Area } from '../entities/area.entity';

export async function AreaSeed(dataSource: DataSource): Promise<any> {
  const areaRepository = dataSource.getRepository(Area);

  const areas = [
    {
      area_id: 'ID-JK001',
      name: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      regency: 'Jakarta Pusat',
      subdistrict: 'Gambir',
      created_by: null,
    },
    {
      area_id: 'ID-JB001',
      name: 'Bandung',
      province: 'Jawa Barat',
      regency: 'Bandung',
      subdistrict: 'Coblong',
      created_by: null,
    },
    {
      area_id: 'ID-JT001',
      name: 'Semarang',
      province: 'Jawa Tengah',
      regency: 'Semarang',
      subdistrict: 'Tembalang',
      created_by: null,
    },
    {
      area_id: 'ID-BT001',
      name: 'Tangerang',
      province: 'Banten',
      regency: 'Tangerang',
      subdistrict: 'Cipondoh',
      created_by: null,
    },
    {
      area_id: 'ID-SU001',
      name: 'Medan',
      province: 'Sumatera Utara',
      regency: 'Medan',
      subdistrict: 'Medan Baru',
      created_by: null,
    },
    {
      area_id: 'ID-KI001',
      name: 'Balikpapan',
      province: 'Kalimantan Timur',
      regency: 'Balikpapan',
      subdistrict: 'Balikpapan Kota',
      created_by: null,
    },
  ];

  for (const area of areas) {
    const existingArea = await areaRepository.findOneBy({
      area_id: area.area_id,
    });
    if (!existingArea) {
      await areaRepository.insert(area);
      console.log(`Inserted area: ${area.name} (${area.province})`);
    } else {
      console.log(`Area with ID "${area.area_id}" already exists.`);
    }
  }
}
