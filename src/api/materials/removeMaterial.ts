import type { Context } from 'koa';
import { loadUser } from '../../libs/utils';
import Material from '../../entities/Material';
import Recipe from '../../entities/Recipe';
import { dataSource } from '../../server';

async function removeMaterialAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const user_id = await loadUser(ctx);
    const recipeRepo = await dataSource.getRepository(Recipe);
    const materialRepo = await dataSource.getRepository(Material);
    const material = await materialRepo.findOneBy({ id });

    if (!material) {
      ctx.status = 404;
      ctx.body = '해당 식재료가 존재하지 않습니다.';
      return;
    }

    const recipe = await recipeRepo.findOneBy({ id: material.fk_recipe_id });

    if (!recipe) {
      ctx.status = 404;
      ctx.body = '해당 레시피가 존재하지 않습니다.';
      return;
    }

    if (recipe.fk_user_id !== user_id) {
      ctx.status = 403;
      ctx.body = '해당 레시피의 작성자가 아닙니다.';
      return;
    }

    await materialRepo.delete({ id });

    ctx.status = 204;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default removeMaterialAPI;
