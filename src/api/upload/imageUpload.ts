import type { Context } from 'koa';
import { uploadImage } from '../../libs/utils';

export async function imageUpload(ctx: Context) {
  try {
    if (ctx.request.files) {
      const file = ctx.request.files.file;
      const { key, url } = await uploadImage(JSON.parse(JSON.stringify(file)));

      ctx.body = { key, url };
    } else {
      console.log('업로드 된 파일이 없습니다.');
    }
  } catch (err: any) {
    ctx.throw(500, err);
  }
}
