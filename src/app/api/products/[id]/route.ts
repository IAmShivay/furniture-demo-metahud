import { NextRequest } from 'next/server';

import { fail, ok, withErrorHandling } from '@/lib/api';
import { deleteProduct, getProductById, updateProduct } from '@/lib/products';
import { idParamSchema, updateProductSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

const parseId = async (context: RouteContext) => {
  const params = await context.params;
  return idParamSchema.safeParse(params);
};





export const GET = withErrorHandling(async (_request: NextRequest, context: RouteContext) => {
  const parsed = await parseId(context);

  if (!parsed.success) {
    return fail('Invalid product identifier', 400, parsed.error.flatten());
  }

  const product = await getProductById(parsed.data.id);

  if (!product) {
    return fail('Product not found', 404);
  }

  return ok({ product });
});





const updateHandler = withErrorHandling(async (request: NextRequest, context: RouteContext) => {
  const parsedId = await parseId(context);

  if (!parsedId.success) {
    return fail('Invalid product identifier', 400, parsedId.error.flatten());
  }

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
    const product = await updateProduct(parsedId.data.id, parsed.data);

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
  const parsedId = await parseId(context);

  if (!parsedId.success) {
    return fail('Invalid product identifier', 400, parsedId.error.flatten());
  }

  try {
    const deleted = await deleteProduct(parsedId.data.id);

    if (!deleted) {
      return fail('Product not found', 404);
    }

    return ok({ id: parsedId.data.id }, 'Product deleted successfully');
  } catch (error) {
    console.error('[api] Failed to delete product:', error);
    return fail('Failed to delete product', 500);
  }
});
