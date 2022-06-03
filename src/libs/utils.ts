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

export function loadUser(ctx: Context): string | null {
  const { user_id } = ctx.state.user;

  if (!user_id) {
    ctx.status = 401;
    ctx.body = '로그인 후 이용하세요';
    return null;
  }

  return user_id;
}
