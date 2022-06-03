import Router from 'koa-router';
import auth from './auth';
import materials from './materials';
import recipes from './recipes';
import upload from './upload';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/materials', materials.routes());
api.use('/recipes', recipes.routes());
api.use('/upload', upload.routes());

export default api;
