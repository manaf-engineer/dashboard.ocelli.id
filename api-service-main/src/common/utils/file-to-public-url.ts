import * as process from 'node:process';

export function transformImageToPublicUrl(filename: string): string {
  const minioPublicUrl = process.env.MINIO_PUBLIC_URL || 'localhost:9000';
  const minioBucketName = process.env.MINIO_BUCKET_NAME || 'insect';

  if (filename) {
    return `${minioPublicUrl}/${minioBucketName}/${filename}`;
  }

  return filename;
}
