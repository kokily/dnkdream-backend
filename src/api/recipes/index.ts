import Router from 'koa-router';
import { authorizedApp } from '../../libs/middlewares/authorized';
import addContentAPI from './addContent';
import addCostAPI from './addCost';
import initRecipeAPI from './initRecipe';
import listRecipesAPI from './listRecipes';
import readRecipeAPI from './readRecipe';
import removeRecipeAPI from './removeRecipe';
import updateThumbnailAPI from './updateThumbnail';

const recipes = new Router();

recipes.patch('/:id', authorizedApp, addContentAPI);
recipes.patch('/cost/:id', authorizedApp, addCostAPI);
recipes.post('/', authorizedApp, initRecipeAPI);
recipes.get('/', authorizedApp, listRecipesAPI);
recipes.get('/:id', authorizedApp, readRecipeAPI);
recipes.delete('/:id', authorizedApp, removeRecipeAPI);
recipes.patch('/thumbnail/:id', authorizedApp, updateThumbnailAPI);

export default recipes;
