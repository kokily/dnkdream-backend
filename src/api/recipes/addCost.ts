import type { Context } from 'koa';
import Joi from 'joi';
import Recipe from '../../entities/Recipe';
import { validateBody } from '../../libs/utils';
import { dataSource } from '../../server';

async function addCostAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  type RequestType = {
    all_cost: number;
    all_price: number;
  };

  const schema = Joi.object().keys({
    all_cost: Joi.number().required(),
    all_price: Joi.number().required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { all_cost, all_price }: RequestType = ctx.request.body;

  try {
    const recipesRepo = await dataSource.getRepository(Recipe);

    await recipesRepo.update({ id }, { all_cost, all_price });

    ctx.status = 200;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default addCostAPI;
