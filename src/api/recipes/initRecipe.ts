import type { Context } from 'koa';
import Joi from 'joi';
import Recipe from '../../entities/Recipe';
import { loadUser, validateBody } from '../../libs/utils';
import { dataSource } from '../../server';

async function initRecipeAPI(ctx: Context) {
  type RequestType = {
    title: string;
    serving: number;
    thumbnail: string;
  };

  const schema = Joi.object().keys({
    title: Joi.string().required(),
    serving: Joi.number().required(),
    thumbnail: Joi.string().required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { title, serving, thumbnail }: RequestType = ctx.request.body;

  try {
    const user_id = await loadUser(ctx);
    const recipesRepo = await dataSource.getRepository(Recipe);
    const recipe = new Recipe();

    recipe.title = title;
    recipe.serving = serving;
    recipe.thumbnail = thumbnail;
    recipe.fk_user_id = user_id;

    await recipesRepo.save(recipe);

    ctx.body = recipe;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default initRecipeAPI;
