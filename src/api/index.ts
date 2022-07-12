import Router from 'koa-router';
import auth from './auth';
import categories from './categories';
import comments from './comments';
import materials from './materials';
import posts from './posts';
import recipes from './recipes';
import replies from './replies';
import tags from './tags';
import upload from './upload';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/categories', categories.routes());
api.use('/comments', comments.routes());
api.use('/materials', materials.routes());
api.use('/posts', posts.routes());
api.use('/recipes', recipes.routes());
api.use('/replies', replies.routes());
api.use('/tags', tags.routes());
api.use('/upload', upload.routes());

export default api;
