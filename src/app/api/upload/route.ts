import { NextRequest } from 'next/server';
import { z } from 'zod';

import { fail, ok, withErrorHandling } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { hasMinimumRole } from '@/lib/rbac';
import {
  ALLOWED_IMAGE_TYPES,
  isCloudinaryConfigured,
  MAX_IMAGE_SIZE_BYTES,
  uploadImage,
} from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

const uploadSchema = z.object({
  file: z.custom<File>(
    (value) => typeof File !== 'undefined' && value instanceof File,
    'A file is required',
  ),
});

/**
 * POST /api/upload
 * Uploads a product image to Cloudinary and returns its secure URL.
 */
export const POST = withErrorHandling(async (request: NextRequest) => {
  const user = await getCurrentUser();

  if (!user) {
    return fail('You need to sign in to upload images', 401);
  }

  if (!hasMinimumRole(user.role, 'manager')) {
    return fail('You do not have permission to upload images', 403);
  }

  if (!isCloudinaryConfigured) {
    return fail('Image uploads are not configured on this server', 503);
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return fail('Invalid form data', 400);
  }

  const parsed = uploadSchema.safeParse({ file: formData.get('file') });

  if (!parsed.success) {
    return fail('Validation failed', 422, parsed.error.flatten());
  }

  const { file } = parsed.data;

  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return fail('Only JPG, PNG, WEBP or AVIF images are allowed', 415);
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return fail('The image must be smaller than 5 MB', 413);
  }

  try {
    const image = await uploadImage(file);
    return ok({ image }, 'Image uploaded successfully');
  } catch (error) {
    console.error('[api] Cloudinary upload failed:', error);
    return fail('Failed to upload the image', 500);
  }
});
