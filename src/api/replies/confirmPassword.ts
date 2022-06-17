import type { Context } from 'koa';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import Reply from '../../entities/Reply';
import { loadUser, validateBody } from '../../libs/utils';
import { dataSource } from '../../server';

async function confirmPasswordAPI(ctx: Context) {
  type RequestType = {
    id: string;
    password?: string;
  };

  const schema = Joi.object().keys({
    id: Joi.string().required(),
    password: Joi.string(),
  });

  if (!validateBody(ctx, schema)) return;

  const { id, password }: RequestType = ctx.request.body;

  try {
    const user_id = await loadUser(ctx);
    const repliesRepo = await dataSource.getRepository(Reply);
    const reply = await repliesRepo.findOneBy({ id });

    if (!reply) {
      ctx.status = 404;
      ctx.body = '존재하지 않는 대댓글입니다.';
      return;
    }

    if (password) {
      const valid = await bcrypt.compare(password, reply.reply_password);

      if (!valid) {
        ctx.status = 403;
        ctx.body = '비밀번호가 틀렸습니다.';
        return;
      }
    } else {
      if (!user_id || user_id === '') {
        ctx.status = 403;
        ctx.body = '관리자가 아닙니다.';
        return;
      }
    }

    ctx.body = true;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default confirmPasswordAPI;
