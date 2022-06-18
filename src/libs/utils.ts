import type { Context } from 'koa';
import type { ManagedUpload } from 'aws-sdk/clients/s3';
import type { ObjectSchema } from 'joi';
import type { SendMailOptions } from 'nodemailer';
import aws from 'aws-sdk';
import fs from 'fs';
import moment from 'moment';
import nodemailer from 'nodemailer';

export const isProd = process.env.NODE_ENV === 'production';

export function validateBody(ctx: Context, schema: ObjectSchema<any>): boolean {
  const { error } = schema.validate(ctx.request.body);

  if (error?.details) {
    ctx.status = 400;
    ctx.body = error.details[0].message;
    return false;
  }

  return true;
}

export function loadUser(ctx: Context): string {
  const { user_id } = ctx.state.user;

  if (!user_id) {
    ctx.status = 401;
    ctx.body = '로그인 후 이용하세요';
    return '';
  }

  return user_id;
}

export type FileType = {
  size: number;
  filepath: string;
  newFilename: string;
  mimetype: string;
  mtime: string;
  originalFilename: string;
};

export type S3ReturnType = {
  key: string;
  url: string;
};

export type ParamsType = {
  Bucket: string;
  Body: fs.ReadStream;
  Key: string;
  ContentType: string;
};

// AWS Config
aws.config.update({
  region: 'ap-northeast-2',
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

// S3 Version
const s3 = new aws.S3({
  apiVersion: '2006-03-01',
});

export async function uploadImage(file: FileType): Promise<S3ReturnType> {
  return new Promise((resolve, reject) => {
    const Params: ParamsType = {
      Bucket: 'image.dnkdream.com',
      Body: fs.createReadStream(file.filepath),
      Key: `${moment().format('YYMMDD_HHmmss')}_${file.newFilename.trim()}`,
      ContentType: file.mimetype,
    };

    Params.Body.on('error', (err) => {
      reject(err);
    });

    s3.upload(Params, (err: Error, data: ManagedUpload.SendData) => {
      if (err) {
        reject(err);
      } else if (data) {
        resolve({
          key: data.Key,
          url: data.Location,
        });
      }
    });
  });
}

export type MailProps = {
  name: string;
  email: string;
  subject: string;
  body: string;
};

export async function SendMail({
  name,
  email,
  subject,
  body,
}: MailProps): Promise<string | null> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const options: SendMailOptions = {
    from: email,
    to: 'hkkokily5@gmail.com',
    subject: 'D&K Dreams Blog 댓글이 달렸습니다',
    html: `
      <h2>제목: ${subject}</h2>
      <h3>작성자: ${name} 님</h3>
      <p>${body}</p>
    `,
  };

  try {
    await transporter.sendMail(options);

    return subject;
  } catch (err: any) {
    throw new Error(err);
  }
}
