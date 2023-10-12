import { Request, Response } from 'express';
import * as s from './service.js';
import { IUser } from './model.js';
import helper from '../../common/utils/helper.js';

export async function register(req: Request, res: Response) {
  const { name, email, mobile, password } = req.body as IUser;

  const [_err, _user] = await s.getUser({ $or: [{ email }, { mobile }] } as any);
  if (_user) return res.status(409).json({ message: 'user already exists' });

  const [err, user] = await s.createUser({ name, email, mobile, password });
  if (err || !user) return res.status(500).json({ message: err || 'Internal Server Error' });

  res.status(200).json({ message: 'user registered successfully', payload: user });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as IUser;
  const [err, user] = await s.getUser({ email });

  if (err) return res.status(500).json({ message: err || 'Internal Server Error' });
  if (!user) return res.status(404).json({ message: 'user not found' });
  if (password !== user.password) return res.status(401).json({ message: 'invalid password' });

  const token = await helper.encodeToken({ userId: user.userId, email: user.email }, { expiresIn: 24 * 3600 });
  await s.updateUser(user.userId, { token });

  res.setHeader('authorization', token);
  res.status(200).json({ message: 'logged in successfully, "authorization" token is attached in header', payload: { userId: user.userId } });
}
