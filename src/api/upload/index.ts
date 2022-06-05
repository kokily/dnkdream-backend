import Router from 'koa-router';
import { imageUpload } from './imageUpload';

const upload = new Router();

upload.post('/', imageUpload);

export default upload;
