import type { Context } from 'koa';
import Post from '../../entities/Post';
import { dataSource } from '../../server';

async function readPostAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const postsRepo = await dataSource.getRepository(Post);
    const post = await postsRepo.findOneBy({ id });

    if (!post) {
      ctx.status = 404;
      ctx.body = '해당 포스트가 존재하지 않습니다.';
      return;
    }

    const query = await postsRepo
      .createQueryBuilder('posts')
      .where('posts.category = :category', { category: post.category })
      .orderBy('posts.created_at', 'DESC');
    const posts = await query.getMany();

    const postsIndex = posts.findIndex((data) => {
      if (data.id === post.id) {
        return true;
      } else {
        return false;
      }
    });

    let prev, next;

    if (postsIndex < 1 && posts.length === 1) {
      prev = null;
      next = null;
    } else if (postsIndex < 1 && posts.length > 1) {
      prev = null;
      next = posts[postsIndex + 1];
    } else if (postsIndex + 1 === posts.length) {
      prev = posts[postsIndex - 1];
      next = null;
    } else {
      prev = posts[postsIndex - 1];
      next = posts[postsIndex + 1];
    }

    ctx.body = {
      post,
      prev,
      next,
    };
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default readPostAPI;
