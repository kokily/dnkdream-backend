import type { Context } from 'koa';
import Joi from 'joi';
import { validateBody } from '../../libs/utils';
import Material from '../../entities/Material';
import Recipe from '../../entities/Recipe';
import { dataSource } from '../../server';

async function addMaterialAPI(ctx: Context) {
  type RequestType = {
    recipe_id: string;
    name: string;
    divide: string;
    unit: string;
    usage: number;
    price: number;
    cost: number;
  };

  const schema = Joi.object().keys({
    recipe_id: Joi.string().required(),
    name: Joi.string().required(),
    divide: Joi.string().required(),
    unit: Joi.string().required(),
    usage: Joi.number().required(),
    price: Joi.number().required(),
    cost: Joi.number().required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { recipe_id, name, divide, unit, usage, price, cost }: RequestType =
    ctx.request.body;

  try {
    const recipesRepo = await dataSource.getRepository(Recipe);
    const materialsRepo = await dataSource.getRepository(Material);

    const recipe = await recipesRepo.findOneBy({ id: recipe_id });

    if (!recipe) {
      ctx.status = 404;
      ctx.body = '해당 레시피가 존재하지 않습니다.';
      return;
    }

    const material = new Material();

    material.name = name;
    material.divide = divide;
    material.unit = unit;
    material.usage = usage;
    material.price = price;
    material.cost = cost;
    material.fk_recipe_id = recipe_id;

    await materialsRepo.save(material);

    ctx.body = material;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default addMaterialAPI;
