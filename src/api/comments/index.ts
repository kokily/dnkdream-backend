import Router from 'koa-router';
import addCommentAPI from './addComment';
import confirmPasswordAPI from './confirmPassword';
import listCommentsAPI from './listcomments';
import removeCommentAPI from './removeComment';
import updateCommentAPI from './updateComment';

const comments = new Router();

comments.post('/', addCommentAPI);
comments.get('/:id', listCommentsAPI);
comments.delete('/:id', removeCommentAPI);
comments.patch('/:id', updateCommentAPI);
comments.post('/confirm', confirmPasswordAPI);

export default comments;
