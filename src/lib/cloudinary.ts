import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export const CLOUDINARY_FOLDER = 'luxehouse/products';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const;

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadImage(file: File): Promise<UploadedImage> {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.');
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const result: UploadApiResponse = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        resource_type: 'image',
        overwrite: true,
        use_filename: true,
        unique_filename: true,
      },
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(error ?? new Error('Cloudinary upload failed'));
          return;
        }
        resolve(uploadResult);
      },
    );

    stream.end(buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width ?? 0,
    height: result.height ?? 0,
    format: result.format ?? '',
    bytes: result.bytes ?? 0,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  if (!isCloudinaryConfigured || !publicId) return;
  await cloudinary.uploader.destroy(publicId);
}
