import { DataSource } from 'typeorm';
import { Endpoint } from '../entities/endpoint.entity'; // Assuming you have an Endpoint entity
import { SubFeature } from '../entities/sub-feature.entity';

export async function EndpointSeed(dataSource: DataSource): Promise<any> {
  const endpointRepository = dataSource.getRepository(Endpoint);
  const subFeatureRepository = dataSource.getRepository(SubFeature);

  // Fetch sub-features with their associated features
  const subFeatures = await subFeatureRepository.find({
    relations: ['feature'],
  });
  const endpoints = [];

  for (const subFeature of subFeatures) {
    switch (subFeature.feature.name) {
      case 'Dashboard': // Replace with actual feature ID for 'Dashboard'
        if (subFeature.name === 'Index') {
          endpoints.push({
            url: '/environment-details/summary/today',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/trap-nodes/summary',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/areas',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/environment-details/summary',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/trap-nodes',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/trap-nodes/all',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
        }
        break;

      case 'Dataset Serangga': // Replace with actual feature ID for 'Dataset Serangga'
        if (subFeature.name === 'Index') {
          endpoints.push({
            url: '/insects',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Detail') {
          endpoints.push({
            url: '/insects/{id}',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/insect-images',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Create') {
          endpoints.push({
            url: '/insects',
            method: 'POST',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/insect-images',
            method: 'POST',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Update') {
          endpoints.push({
            url: '/insects/{id}',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/insect-images/all',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/insects/{id}',
            method: 'PUT',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/insects-images',
            method: 'PUT',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/insects-images/{id}',
            method: 'DELETE',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Delete') {
          endpoints.push({
            url: '/insects/{id}',
            method: 'DELETE',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Import') {
          endpoints.push({
            url: '/insects/upload',
            method: 'POST',
            sub_features_id: subFeature.id,
          });
        }
        break;

      case 'Data Node Trap': // Replace with actual feature ID for 'Data Node Trap'
        if (subFeature.name === 'Index') {
          endpoints.push({
            url: '/trap-nodes',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/areas',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Detail') {
          endpoints.push({
            url: '/trap-nodes/{id}',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/environment-details',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/environment-details/chart',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/capture-results',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/task-scheduler/manual',
            method: 'POST',
            sub_features_id: subFeature.id,
          });
        }
        break;

      case 'Master Node Trap': // Replace with actual feature ID for 'Master Node Trap'
        if (subFeature.name === 'Index') {
          endpoints.push({
            url: '/master-node-traps',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/areas',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Detail') {
          endpoints.push({
            url: '/task-scheduler/manual',
            method: 'POST',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/trap-nodes/{id}',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Create') {
          endpoints.push({
            url: '/areas',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/trap-nodes',
            method: 'POST',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Update') {
          endpoints.push({
            url: '/trap-nodes/{id}',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/areas',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/trap-nodes/{id}',
            method: 'PUT',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Delete') {
          endpoints.push({
            url: '/trap-nodes/{id}',
            method: 'DELETE',
            sub_features_id: subFeature.id,
          });
        }
        break;

      case 'Master Area': // Replace with actual feature ID for 'Master Area'
        if (subFeature.name === 'Index') {
          endpoints.push({
            url: '/areas',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Detail') {
          endpoints.push({
            url: '/areas/{id}',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Create') {
          endpoints.push({
            url: '/areas',
            method: 'POST',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Update') {
          endpoints.push({
            url: '/areas/{id}',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/areas/{id}',
            method: 'PUT',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Delete') {
          endpoints.push({
            url: '/areas/{id}',
            method: 'DELETE',
            sub_features_id: subFeature.id,
          });
        }
        break;

      case 'Laporan Node Trap': // Replace with actual feature ID for 'Laporan Node Trap'
        if (subFeature.name === 'Index') {
          endpoints.push({
            url: '/environment-details/report',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/environment-details/trap-nodes',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/environment-details/areas',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Download') {
          endpoints.push({
            url: '/environment-details/report/download',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
        }
        break;

      case 'Pengaturan Interval': // Replace with actual feature ID for 'Pengaturan Interval'
        if (subFeature.name === 'Index') {
          endpoints.push({
            url: '/task-scheduler',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Update') {
          endpoints.push({
            url: '/task-scheduler',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/task-scheduler',
            method: 'PUT',
            sub_features_id: subFeature.id,
          });
        }
        break;

      case 'Access Control List': // Replace with actual feature ID for 'Access Control List'
        if (subFeature.name === 'Index Role') {
          endpoints.push({
            url: '/roles',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Create Role') {
          endpoints.push({
            url: '/roles/form',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/roles',
            method: 'POST',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Update Role') {
          endpoints.push({
            url: '/roles/{id}',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/roles/{id}',
            method: 'PUT',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Delete Role') {
          endpoints.push({
            url: '/roles/{id}',
            method: 'DELETE',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Index User') {
          endpoints.push({
            url: '/roles',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/users',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Create User') {
          endpoints.push({
            url: '/users',
            method: 'POST',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Update User') {
          endpoints.push({
            url: '/users/{id}',
            method: 'GET',
            sub_features_id: subFeature.id,
          });
          endpoints.push({
            url: '/users/{id}',
            method: 'PUT',
            sub_features_id: subFeature.id,
          });
        } else if (subFeature.name === 'Delete User') {
          endpoints.push({
            url: '/users/{id}',
            method: 'DELETE',
            sub_features_id: subFeature.id,
          });
        }
        break;
    }
  }

  await endpointRepository.insert(endpoints);
}
