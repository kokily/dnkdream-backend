import type { Context } from 'koa';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import Comment from '../../entities/Comment';
import { validateBody } from '../../libs/utils';
import { dataSource } from '../../server';

async function removeCommentAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  type RequestType = {
    password: string;
  };

  const schema = Joi.object().keys({
    password: Joi.string().required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { password }: RequestType = ctx.request.body;

  try {
    const commentsRepo = await dataSource.getRepository(Comment);
    const comment = await commentsRepo.findOneBy({ id });

    if (!comment) {
      ctx.status = 404;
      ctx.body = '존재하지 않는 댓글입니다.';
      return;
    }

    const valid = await bcrypt.compare(password, comment.comment_password);

    if (!valid) {
      ctx.status = 403;
      ctx.body = '비밀번호가 틀렸습니다.';
      return;
    }

    await commentsRepo.delete({ id });

    ctx.status = 200;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default removeCommentAPI;
