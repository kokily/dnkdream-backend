import type { Context } from 'koa';
import Post from '../../entities/Post';
import { dataSource } from '../../server';

async function listCategoryAPI(ctx: Context) {
  try {
    const postsRepo = await dataSource.getRepository(Post);
    const posts = await postsRepo.find();
    let prevPosts: string[] = [];

    posts.map((post) => {
      prevPosts.push(post.category);
    });

    if (prevPosts.length < 1) {
      ctx.status = 404;
      ctx.body = '아직 포스트가 존재하지 않습니다.';
      return;
    }

    const categories = [...new Set(prevPosts)];

    ctx.body = categories;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default listCategoryAPI;
