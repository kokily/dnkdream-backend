import Router from 'koa-router';
import { authorizedBlog } from '../../libs/middlewares/authorized';
import addPostAPI from './addPost';
import listPosts from './listPosts';
import nearPostsAPI from './nearPosts';
import readPostAPI from './readPost';
import removePostAPI from './removePost';
import updatePostAPI from './updatePost';

const posts = new Router();

posts.post('/', authorizedBlog, addPostAPI);
posts.get('/', listPosts);
posts.get('/near/:id', nearPostsAPI);
posts.get('/:id', readPostAPI);
posts.delete('/:id', authorizedBlog, removePostAPI);
posts.patch('/:id', authorizedBlog, updatePostAPI);

export default posts;
