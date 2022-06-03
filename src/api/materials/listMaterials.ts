import type { Context } from 'koa';
import Material from '../../entities/Material';
import { dataSource } from '../../server';

async function listMaterialsAPI(ctx: Context) {
  type QueryType = {
    recipe_id?: string;
  };

  const { recipe_id }: QueryType = ctx.query;

  try {
    if (recipe_id) {
      const materialRepo = await dataSource.getRepository(Material);
      const query = await materialRepo
        .createQueryBuilder('materials')
        .where('materials.fk_recipe_id = :recipe_id', { recipe_id })
        .orderBy('materials.created_at', 'ASC');

      const materials = await query.getMany();

      ctx.body = materials;
    } else {
      ctx.body = [];
    }
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default listMaterialsAPI;
