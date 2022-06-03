import type { Context } from 'koa';
import Recipe from '../../entities/Recipe';
import { dataSource } from '../../server';

async function readRecipeAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const recipeRepo = await dataSource.getRepository(Recipe);
    const recipe = await recipeRepo
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.materials', 'material')
      .where('recipe.id = :id', { id })
      .getOne();

    if (!recipe) {
      ctx.status = 404;
      ctx.body = '해당 레시피가 존재하지 않습니다.';
      return;
    }

    ctx.body = recipe;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default readRecipeAPI;
