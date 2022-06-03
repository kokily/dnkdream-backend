import type { Context } from 'koa';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import User from '../../entities/User';
import { validateBody } from '../../libs/utils';
import { dataSource } from '../../server';

async function registerAPI(ctx: Context) {
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
    const exists = await userRepo.findOneBy({ username });

    if (exists) {
      ctx.status = 409;
      ctx.body = '이미 등록되어 있는 아이디입니다.';
      return;
    }

    const user = new User();

    user.username = username;
    user.password = await bcrypt.hash(password, 10);
    user.admin = process.env.ADMIN_NAME === username ? true : false;

    await userRepo.save(user);

    ctx.body = {
      user_id: user.id,
    };
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default registerAPI;
