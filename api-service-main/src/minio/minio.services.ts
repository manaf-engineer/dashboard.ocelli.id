import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class MinioService {
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT'),
      port: Number(this.configService.get('MINIO_PORT')),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
    });
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME');
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'eu-west-1');
    }
  }

  // Function to upload base64 image
  async uploadBase64Image(base64String: string, fileName: string) {
    // Remove the data URL part if it exists
    const base64Data = base64String.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    const metaData = {
      'Content-Type': 'image/png', // Adjust based on the image type
    };

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      buffer,
      undefined,
      metaData,
    );
    console.log(
      'Image uploaded as object ' + fileName + ' in bucket ' + this.bucketName,
    );
  }

  async uploadBase64Image2(base64String: string, fileName: string) {
    // Remove the data URL part if it exists
    // const base64Data = base64String.split(',')[1];
    const buffer = Buffer.from(base64String, 'base64');

    const metaData = {
      'Content-Type': 'image/png', // Adjust based on the image type
    };

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      buffer,
      undefined,
      metaData,
    );
    console.log(
      'Image uploaded as object ' + fileName + ' in bucket ' + this.bucketName,
    );
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }

  async deleteFolder(folderName: string) {
    const objects = this.minioClient.listObjects(
      this.bucketName,
      folderName,
      true,
    );
    const deletePromises = [];

    for await (const obj of objects) {
      deletePromises.push(
        this.minioClient.removeObject(this.bucketName, obj.name),
      );
    }

    await Promise.all(deletePromises);
    console.log(
      'Folder "' +
        folderName +
        '" and its contents have been deleted from bucket ' +
        this.bucketName,
    );
  }

  async getImageStream(imageName: string): Promise<Readable> {
    try {
      return this.minioClient.getObject(this.bucketName, imageName);
    } catch (error) {
      throw new InternalServerErrorException(`Error downloading image: ${imageName}`);
    }
  }
}
