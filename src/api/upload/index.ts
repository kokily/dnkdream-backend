import Router from 'koa-router';
import {
  authorizedApp,
  authorizedBlog,
} from '../../libs/middlewares/authorized';
import { imageAppUpload, imageBlogUpload } from './imageUpload';

const upload = new Router();

upload.post('/app', authorizedApp, imageAppUpload);
upload.post('/blog', authorizedBlog, imageBlogUpload);

export default upload;
