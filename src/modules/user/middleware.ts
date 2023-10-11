import { Request, Response, NextFunction } from 'express';
import helper from '../../common/utils/helper.js';
import { IUser } from './model.js';

export async function register(req: Request, res: Response, next: NextFunction) {
  // payload verification

  const { name, email, mobile, password } = req.body as IUser;

  if (!name) return res.status(400).json({ message: 'name is required' });
  if (!email) return res.status(400).json({ message: 'email is required' });
  if (!mobile) return res.status(400).json({ message: 'mobile is required' });
  if (!password) return res.status(400).json({ message: 'password is required' });

  if (name.length < 3 || name.length > 20) return res.status(400).json({ message: 'name must be between 3 and 20 characters' });
  if (password.length < 8 || password.length > 20) return res.status(400).json({ message: 'password must be between 8 and 20 characters' });

  if (!helper.validateEmail(email)) return res.status(400).json({ message: 'invalid email' });
  if (!helper.validateMobile(`${mobile}`)) return res.status(400).json({ message: 'invalid mobile' });
  if (!helper.isStrongPassword(password))
    return res.status(400).json({
      message: 'invalid password. It must be greater than 8 characters and containing at least one uppercase letter, one lowercase letter, one digit, and one special character',
    });

  req.body.mobile = parseInt(`${mobile}`, 10);
  req.body.password = helper.encryptPassword(password);

  next();
}

export async function login(req: Request, res: Response, next: NextFunction) {
  // payload verification

  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: 'email is required' });
  if (!password) return res.status(400).json({ message: 'password is required' });

  if (!helper.validateEmail(email)) return res.status(400).json({ message: 'invalid email' });
  if (!helper.isStrongPassword(password)) return res.status(400).json({ message: 'invalid password.' });

  req.body.password = helper.encryptPassword(password);

  next();
}
