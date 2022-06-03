import type { Context } from 'koa';
import Token from '../../entities/Token';
import User from '../../entities/User';
import { loadUser } from '../../libs/utils';
import { dataSource } from '../../server';

async function checkAPI(ctx: Context) {
  try {
    const user_id = await loadUser(ctx);

    if (!user_id) {
      ctx.throw(403, '로그인 후 사용하세요');
    }

    const userRepo = await dataSource.getRepository(User);
    const tokenRepo = await dataSource.getRepository(Token);
    const user = await userRepo.findOneBy({ id: user_id });

    if (!user) {
      ctx.status = 404;
      ctx.body = '존재하지 않는 아이디입니다.';
      return;
    }

    const token = await tokenRepo.findOneBy({ fk_user_id: user.id });

    if (!token) {
      ctx.status = 403;
      ctx.body = '토큰 미 발행';
      return;
    }

    ctx.body = {
      user_id,
      username: user.username,
      admin: user.admin,
    };
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default checkAPI;
