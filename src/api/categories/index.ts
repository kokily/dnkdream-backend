import Router from 'koa-router';
import listCategoryAPI from './listCategory';

const categories = new Router();

categories.get('/', listCategoryAPI);

export default categories;
