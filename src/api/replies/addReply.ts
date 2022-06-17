import type { Context } from 'koa';
import Joi from 'joi';
import Reply from '../../entities/Reply';
import { validateBody } from '../../libs/utils';
import { dataSource } from '../../server';

async function addReplyAPI(ctx: Context) {
  type RequestType = {
    reply_body: string;
    commentId: string;
    postId: string;
  };

  const schema = Joi.object().keys({
    reply_body: Joi.string().required(),
    commentId: Joi.string().required(),
    postId: Joi.string().required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { reply_body, commentId, postId }: RequestType = ctx.request.body;

  try {
    const repliesRepo = await dataSource.getRepository(Reply);
    const reply = new Reply();

    reply.reply_body = reply_body;
    reply.postId = postId;
    reply.commentId = commentId;

    await repliesRepo.save(reply);

    ctx.body = reply;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default addReplyAPI;
