import type { Context } from 'koa';
import Tag from '../../entities/Tag';
import { dataSource } from '../../server';

async function listTagsAPI(ctx: Context) {
  try {
    const tagsRepo = await dataSource.getRepository(Tag);
    const listTags = await tagsRepo.find();
    const prevTags: string[] = [];

    listTags.map((tag) => {
      prevTags.push(tag.name);
    });

    const tags = [...new Set(prevTags)];

    ctx.body = tags;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default listTagsAPI;
