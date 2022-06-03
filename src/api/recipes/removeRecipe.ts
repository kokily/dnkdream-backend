import type { Context } from 'koa';
import Recipe from '../../entities/Recipe';
import { dataSource } from '../../server';

async function removeRecipeAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const recipeRepo = await dataSource.getRepository(Recipe);

    await recipeRepo.delete({ id });

    ctx.status = 204;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default removeRecipeAPI;
