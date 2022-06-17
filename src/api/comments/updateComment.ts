import type { Context } from 'koa';
import Joi from 'joi';
import Comment from '../../entities/Comment';
import { validateBody } from '../../libs/utils';
import { dataSource } from '../../server';

async function updateCommentAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  type RequestType = {
    comment_body: string;
  };

  const schema = Joi.object().keys({
    comment_body: Joi.string().required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { comment_body }: RequestType = ctx.request.body;

  try {
    const commentsRepo = await dataSource.getRepository(Comment);

    await commentsRepo.update({ id }, { comment_body, updated_at: new Date() });

    ctx.status = 200;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default updateCommentAPI;
