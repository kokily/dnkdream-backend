import type { Context } from 'koa';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';
import Post from '../../entities/Post';
import Tag from '../../entities/Tag';
import { validateBody } from '../../libs/utils';
import { dataSource } from '../../server';
import { sanitizeOptions } from '.';

async function addPostAPI(ctx: Context) {
  type RequestType = {
    category: string;
    title: string;
    body: string;
    thumbnail?: string;
    tags: string[];
  };

  const schema = Joi.object().keys({
    category: Joi.string().required(),
    title: Joi.string().required(),
    body: Joi.string().required(),
    thumbnail: Joi.string(),
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

    const post = new Post();

    post.category = category;
    post.title = title;
    post.body = sanitizeHtml(body, sanitizeOptions);
    post.thumbnail = thumbnail ? thumbnail : null;
    post.tags = tags;

    await postsRepo.save(post);

    ctx.body = post;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default addPostAPI;
