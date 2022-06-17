import Router from 'koa-router';
import { authorizedBlog } from '../../libs/middlewares/authorized';
import addReplyAPI from './addReply';
import removeReply from './removeReply';
import updateReply from './updateReply';

const replies = new Router();

replies.post('/', authorizedBlog, addReplyAPI);
replies.delete('/:id', authorizedBlog, removeReply);
replies.patch('/update/:id', authorizedBlog, updateReply);

export default replies;
