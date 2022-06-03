import Token from '../../entities/Token';
import User from '../../entities/User';
import { dataSource } from '../../server';
import generateToken from './generateToken';

async function createTokens(user: User) {
  const tokenRepo = await dataSource.getRepository(Token);
  const token = new Token();

  token.fk_user_id = user.id;

  await tokenRepo.save(token);

  const accessToken = await generateToken(
    { user_id: user.id, username: user.username, admin: user.admin },
    { subject: 'access_token', expiresIn: '15m' }
  );

  const refreshToken = await generateToken(
    {
      user_id: user.id,
      username: user.username,
      admin: user.admin,
      token_id: token.id,
    },
    { subject: 'refresh_token', expiresIn: '15d' }
  );

  token.token = refreshToken;

  await tokenRepo.save(token);

  return { accessToken, refreshToken };
}

export default createTokens;
