import type { Context } from 'koa';
import Reply from '../../entities/Reply';
import { dataSource } from '../../server';

async function removeReply(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const repliesRepo = await dataSource.getRepository(Reply);

    await repliesRepo.delete({ id });

    ctx.status = 200;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default removeReply;
