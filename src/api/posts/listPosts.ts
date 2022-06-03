import type { Context } from 'koa';
import Post from '../../entities/Post';
import { dataSource } from '../../server';

async function listPosts(ctx: Context) {
  type QueryType = {
    category?: string;
    tag?: string;
    cursor?: string;
    title?: string;
  };

  const { category, tag, cursor, title }: QueryType = ctx.query;

  try {
    const postsRepo = await dataSource.getRepository(Post);
    const query = await postsRepo
      .createQueryBuilder('posts')
      .limit(20)
      .orderBy('posts.created_at', 'DESC');

    if (category) {
      query.andWhere('posts.category = :category', { category });
    }

    if (tag) {
      query.andWhere(":tag = ANY (string_to_array(posts.tags, ','))", { tag });
    }

    if (title) {
      query.andWhere('posts.title like :title', { title: `%${title}%` });
    }

    if (cursor) {
      const post = await postsRepo.findOneBy({ id: cursor });

      if (!post) {
        ctx.status = 404;
        ctx.body = '해당 포스트가 존재하지 않습니다.';
        return;
      }

      query.andWhere('posts.created_at < :date', { date: post.created_at });
      query.orWhere('posts.created_at = :date AND posts.id < :id', {
        date: post.created_at,
        id: post.id,
      });
    }

    const posts = await query.getMany();

    ctx.body = posts;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default listPosts;
