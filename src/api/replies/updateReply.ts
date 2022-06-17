import type { Context } from 'koa';
import Joi from 'joi';
import { validateBody } from '../../libs/utils';
import { dataSource } from '../../server';
import Reply from '../../entities/Reply';

async function updateReply(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  type RequestType = {
    reply_body: string;
  };

  const schema = Joi.object().keys({
    reply_body: Joi.string().required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { reply_body }: RequestType = ctx.request.body;

  try {
    const repliesRepo = await dataSource.getRepository(Reply);

    await repliesRepo.update({ id }, { reply_body, updated_at: new Date() });

    ctx.status = 200;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default updateReply;
