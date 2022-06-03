import type { SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

async function generateToken(
  payload: any,
  options?: SignOptions
): Promise<string> {
  const secretKey = process.env.JWT_SECRET!;
  const jwtOptions: SignOptions = {
    issuer: 'dnkdream.com',
    expiresIn: '3d',
    ...options,
  };

  if (!jwtOptions.expiresIn) {
    delete jwtOptions.expiresIn;
  }

  return new Promise((resolve, reject) => {
    if (!secretKey) return;

    jwt.sign(payload, secretKey, jwtOptions, (err, token) => {
      if (err || token === undefined) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

export default generateToken;
