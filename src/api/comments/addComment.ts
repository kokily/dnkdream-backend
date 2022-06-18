import type { Context } from 'koa';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import Comment from '../../entities/Comment';
import { SendMail, validateBody } from '../../libs/utils';
import { dataSource } from '../../server';

async function addCommentAPI(ctx: Context) {
  type RequestType = {
    postId: string;
    comment_username: string;
    comment_password: string;
    comment_body: string;
  };

  const schema = Joi.object().keys({
    postId: Joi.string().required(),
    comment_username: Joi.string().required(),
    comment_password: Joi.string().required(),
    comment_body: Joi.string().required(),
  });

  if (!validateBody(ctx, schema)) return;

  const {
    postId,
    comment_username,
    comment_password,
    comment_body,
  }: RequestType = ctx.request.body;

  try {
    const commentsRepo = await dataSource.getRepository(Comment);
    const comment = new Comment();

    comment.postId = postId;
    comment.comment_username = comment_username;
    comment.comment_password = await bcrypt.hash(comment_password, 10);
    comment.comment_body = comment_body;

    await commentsRepo.save(comment);
    await SendMail({
      name: comment_username,
      email: 'hkkokily5@gmail.com',
      subject: comment_body.slice(0, 10),
      body: comment_body,
    });

    ctx.body = comment;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default addCommentAPI;
