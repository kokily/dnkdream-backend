import Router from 'koa-router';
import checkAPI from './check';
import loginAPI from './login';
import logoutAPI from './logout';
import registerAPI from './register';

const auth = new Router();

auth.get('/check', checkAPI);
auth.post('/login', loginAPI);
auth.post('/logout', logoutAPI);
auth.post('/register', registerAPI);

export default auth;
