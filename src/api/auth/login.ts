import type { Context } from 'koa';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import Token from '../../entities/Token';
import User from '../../entities/User';
import { validateBody } from '../../libs/utils';
import { dataSource } from '../../server';
import createTokens from '../../libs/auth/createTokens';
import setCookies from '../../libs/auth/setCookies';

async function loginAPI(ctx: Context) {
  type RequestType = {
    username: string;
    password: string;
  };

  const schema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().min(4).required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { username, password }: RequestType = ctx.request.body;

  try {
    const userRepo = await dataSource.getRepository(User);
    const tokenRepo = await dataSource.getRepository(Token);
    const user = await userRepo.findOneBy({ username });

    if (!user) {
      ctx.status = 404;
      ctx.body = '회원가입 후 이용하세요.';
      return;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      ctx.status = 401;
      ctx.body = '비밀번호가 틀렸습니다.';
      return;
    }

    const prevToken = await tokenRepo.findOneBy({ fk_user_id: user.id });

    if (prevToken) {
      await tokenRepo.delete({ fk_user_id: user.id });
    }

    const tokens = await createTokens(user);

    setCookies(ctx, tokens);

    ctx.body = {
      user_id: user.id,
      username: user.username,
      admin: user.admin,
    };
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default loginAPI;
