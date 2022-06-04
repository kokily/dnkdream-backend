import type { Context } from 'koa';
import Post from '../../entities/Post';
import { dataSource } from '../../server';

async function listCategoryAPI(ctx: Context) {
  try {
    const postsRepo = await dataSource.getRepository(Post);
    const posts = await postsRepo.find();
    let categories: string[] = [];

    posts.map((post) => {
      categories.push(post.category);
    });

    if (categories.length < 1) {
      ctx.status = 404;
      ctx.body = '아직 포스트가 존재하지 않습니다.';
      return;
    }

    Array.from(new Set(categories));

    ctx.body = categories;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default listCategoryAPI;
