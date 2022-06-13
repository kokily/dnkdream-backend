import type { Context } from 'koa';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';
import { validateBody } from '../../libs/utils';
import { dataSource } from '../../server';
import Post from '../../entities/Post';
import Tag from '../../entities/Tag';
import { sanitizeOptions } from '.';

async function updatePostAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  type RequestType = {
    category: string;
    title: string;
    body: string;
    thumbnail: string;
    tags: string[];
  };

  const schema = Joi.object().keys({
    category: Joi.string().required(),
    title: Joi.string().required(),
    body: Joi.string().required(),
    thumbnail: Joi.string().required(),
    tags: Joi.array().items(Joi.string().required()).required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { category, title, body, thumbnail, tags }: RequestType =
    ctx.request.body;

  try {
    const postsRepo = await dataSource.getRepository(Post);
    const tagsRepo = await dataSource.getRepository(Tag);

    tags.map(async (tag) => {
      const existTag = await tagsRepo.findOneBy({ name: tag });

      if (!existTag) {
        const newTag = new Tag();

        newTag.name = tag;

        await tagsRepo.save(newTag);
      }
    });

    await postsRepo.update(
      { id },
      {
        category,
        title,
        body: sanitizeHtml(body, sanitizeOptions),
        thumbnail,
        tags,
      }
    );

    const post = await postsRepo.findOneBy({ id });

    if (!post) {
      ctx.status = 404;
      ctx.body = '존재하지 않는 포스트입니다.';
      return;
    }

    ctx.body = post;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default updatePostAPI;
