import type { Context } from 'koa';
import Recipe from '../../entities/Recipe';
import { loadUser } from '../../libs/utils';
import { dataSource } from '../../server';

async function listRecipesAPI(ctx: Context) {
  type QueryType = {
    title?: string;
    cursor?: string;
  };

  const { title, cursor }: QueryType = ctx.query;

  try {
    const user_id = loadUser(ctx);
    const recipeRepo = await dataSource.getRepository(Recipe);
    const query = recipeRepo
      .createQueryBuilder('recipes')
      .where('recipes.fk_user_id = :user_id', { user_id })
      .leftJoinAndSelect('recipes.materials', 'material')
      .limit(20)
      .orderBy('recipes.created_at', 'DESC');

    if (title) {
      query.andWhere('recipes.title like :title', { title: `%${title}%` });
    }

    if (cursor) {
      const recipe = await recipeRepo.findOneBy({ id: cursor });

      if (!recipe) {
        ctx.status = 404;
        ctx.body = '해당 레시피가 존재하지 않습니다.';
        return;
      }

      query.andWhere('recipes.created_at < :date', {
        date: recipe.created_at,
      });

      query.orWhere('recipes.created_at = :date AND recipes.id < :id', {
        date: recipe.created_at,
        id: recipe.id,
      });
    }

    const recipes = await query.getMany();

    ctx.body = recipes;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default listRecipesAPI;
