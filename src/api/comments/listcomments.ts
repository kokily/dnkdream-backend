import type { Context } from 'koa';
import Comment from '../../entities/Comment';
import { dataSource } from '../../server';

async function listCommentsAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const commentsRepo = await dataSource.getRepository(Comment);
    const query = await commentsRepo
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.replies', 'reply')
      .where('comments.postId = :postId', { postId: id })
      .orderBy('comments.created_at', 'ASC');

    const comments = await query.getMany();

    ctx.body = comments;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default listCommentsAPI;
