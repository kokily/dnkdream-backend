import type { Context } from 'koa';
import Material from '../../entities/Material';
import { dataSource } from '../../server';

async function readMaterialAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const materialRepo = await dataSource.getRepository(Material);
    const material = await materialRepo.findOneBy({ id });

    if (!material) {
      ctx.status = 404;
      ctx.body = '해당 식재료가 존재하지 않습니다.';
      return;
    }

    ctx.body = material;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default readMaterialAPI;
