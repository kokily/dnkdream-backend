import Router from 'koa-router';
import addReplyAPI from './addReply';
import confirmPasswordAPI from './confirmPassword';
import removeReply from './removeReply';
import updateReply from './updateReply';

const replies = new Router();

replies.post('/', addReplyAPI);
replies.post('/confirm', confirmPasswordAPI);
replies.delete('/:id', removeReply);
replies.patch('/:id', updateReply);

export default replies;
