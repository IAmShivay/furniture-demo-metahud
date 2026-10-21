import { NextRequest } from 'next/server';

import { fail, ok, withErrorHandling } from '@/lib/api';
import { deleteProduct, getProductById, updateProduct } from '@/lib/products';
import { updateProductSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };





export const GET = withErrorHandling(async (_request: NextRequest, context: RouteContext) => {
  const { id } = await context.params;
  const product = await getProductById(id);

  if (!product) {
    return fail('Product not found', 404);
  }

  return ok({ product });
});





const updateHandler = withErrorHandling(async (request: NextRequest, context: RouteContext) => {
  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail('Invalid JSON body', 400);
  }

  const parsed = updateProductSchema.safeParse(body);

  if (!parsed.success) {
    return fail('Validation failed', 422, parsed.error.flatten());
  }

  try {
    const product = await updateProduct(id, parsed.data);

    if (!product) {
      return fail('Product not found', 404);
    }

    return ok({ product }, 'Product updated successfully');
  } catch (error) {
    console.error('[api] Failed to update product:', error);
    return fail('Failed to update product', 500);
  }
});

export const PUT = updateHandler;
export const PATCH = updateHandler;





export const DELETE = withErrorHandling(async (_request: NextRequest, context: RouteContext) => {
  const { id } = await context.params;

  try {
    const deleted = await deleteProduct(id);

    if (!deleted) {
      return fail('Product not found', 404);
    }

    return ok({ id }, 'Product deleted successfully');
  } catch (error) {
    console.error('[api] Failed to delete product:', error);
    return fail('Failed to delete product', 500);
  }
});
