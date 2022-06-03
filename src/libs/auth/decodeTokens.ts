import jwt from 'jsonwebtoken';

async function decodeTokens<T = any>(token: string): Promise<T> {
  const secretKey = process.env.JWT_SECRET!;

  return new Promise((resolve, reject) => {
    if (!secretKey) return;

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) reject(err);

      resolve(decoded as any);
    });
  });
}

export default decodeTokens;
