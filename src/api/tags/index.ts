import Router from 'koa-router';
import listTagsAPI from './listTags';

const tags = new Router();

tags.get('/', listTagsAPI);

export default tags;
