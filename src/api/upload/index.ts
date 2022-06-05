import Router from 'koa-router';
import { imageAppUpload, imageBlogUpload } from './imageUpload';

const upload = new Router();

upload.post('/app', imageAppUpload);
upload.post('/blog', imageBlogUpload);

export default upload;
