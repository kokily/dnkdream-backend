import type { Context } from 'koa';
import Joi from 'joi';
import { loadUser, validateBody } from '../../libs/utils';
import { dataSource } from '../../server';
import Recipe from '../../entities/Recipe';

async function addContentAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  type RequestType = {
    content: string;
  };

  const schema = Joi.object().keys({
    content: Joi.string().required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { content }: RequestType = ctx.request.body;

  try {
    const user_id = await loadUser(ctx);
    const recipeRepo = await dataSource.getRepository(Recipe);
    const recipe = await recipeRepo.findOneBy({ id });

    if (!recipe) {
      ctx.status = 404;
      ctx.body = '해당 레시피가 존재하지 않습니다.';
      return;
    }

    if (recipe.fk_user_id !== user_id) {
      ctx.status = 403;
      ctx.body = '해당 레시피의 작성자가 일치하지 않습니다.';
      return;
    }

    await recipeRepo.update({ id }, { content, updated_at: new Date() });

    ctx.status = 200;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default addContentAPI;
