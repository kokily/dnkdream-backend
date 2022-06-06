import type { Context } from 'koa';
import Post from '../../entities/Post';
import { dataSource } from '../../server';

async function nearPostsAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  type QueryType = {
    category?: string;
    tag?: string;
  };

  const { category, tag }: QueryType = ctx.query;

  try {
    const postsRepo = await dataSource.getRepository(Post);
    const post = await postsRepo.findOneBy({ id });

    if (!post) {
      ctx.status = 404;
      ctx.body = '선택하신 포스트가 없습니다.';
      return;
    }

    const query = await postsRepo
      .createQueryBuilder('posts')
      .orderBy('posts.created_at', 'ASC');

    if (category) {
      query.andWhere('posts.category = :category', { category });
    }

    if (tag) {
      query.andWhere('posts.tag = :tag', { tag });
    }

    const posts = await query.getMany();
    const postIndex = posts.findIndex((data) => {
      if (data.id === post.id) {
        return true;
      } else {
        return false;
      }
    });

    let prev, next;

    if (postIndex < 1 && posts.length === 1) {
      prev = null;
      next = null;
    } else if (postIndex < 1 && posts.length > 1) {
      prev = null;
      next = posts[postIndex + 1];
    } else if (postIndex + 1 === posts.length) {
      prev = posts[postIndex - 1];
      next = null;
    } else {
      prev = posts[postIndex - 1];
      next = posts[postIndex + 1];
    }

    ctx.body = {
      prev,
      next,
    };
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default nearPostsAPI;
