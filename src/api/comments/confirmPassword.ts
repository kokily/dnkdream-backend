import type { Context } from 'koa';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import Comment from '../../entities/Comment';
import { validateBody } from '../../libs/utils';
import { dataSource } from '../../server';

async function confirmPasswordAPI(ctx: Context) {
  type RequestType = {
    id: string;
    password: string;
  };

  const schema = Joi.object().keys({
    id: Joi.string().required(),
    password: Joi.string().required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { id, password }: RequestType = ctx.request.body;

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

    ctx.body = true;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default confirmPasswordAPI;
