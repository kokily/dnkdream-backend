import Router from 'koa-router';
import { options } from 'sanitize-html';
import { authorizedBlog } from '../../libs/middlewares/authorized';
import addPostAPI from './addPost';
import listPosts from './listPosts';
import readPostAPI from './readPost';
import removePostAPI from './removePost';
import updatePostAPI from './updatePost';

const posts = new Router();

posts.post('/', authorizedBlog, addPostAPI);
posts.get('/', listPosts);
posts.get('/:id', readPostAPI);
posts.delete('/:id', authorizedBlog, removePostAPI);
posts.patch('/:id', authorizedBlog, updatePostAPI);

export const sanitizeOptions: typeof options = {
  allowedTags: false,
  allowedAttributes: false,
};

export default posts;
