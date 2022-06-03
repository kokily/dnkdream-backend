import type { Context } from 'koa';
import Post from '../../entities/Post';
import { dataSource } from '../../server';

async function removePostAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const postsRepo = await dataSource.getRepository(Post);

    await postsRepo.delete({ id });

    ctx.status = 204;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default removePostAPI;
