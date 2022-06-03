import type { Context } from 'koa';
import type { ObjectSchema } from 'joi';

export const isProd = process.env.NODE_ENV === 'production';

export function validateBody(ctx: Context, schema: ObjectSchema<any>): boolean {
  const { error } = schema.validate(ctx.request.body);

  if (error?.details) {
    ctx.status = 400;
    ctx.body = error.details[0].message;
    return false;
  }

  return true;
}
