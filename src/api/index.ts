import Router from 'koa-router';
import auth from './auth';
import recipes from './recipes';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/recipes', recipes.routes());

export default api;
